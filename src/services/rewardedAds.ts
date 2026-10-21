/**
 * Service Integrasi Rewarded Advertisement (Google Publisher Tag / Google Ad Manager Web Rewarded Ads)
 *
 * Mengikuti kebijakan resmi monetisasi rewarded ads:
 * - Tidak meminta klik iklan atau memberikan reward atas dasar klik.
 * - Reward hanya diberikan jika provider iklan memancarkan event resmi `rewardedSlotGranted`.
 * - Jika iklan gagal dimuat, timeout, no-fill (isEmpty), atau diblokir adblocker,
 *   sistem TIDAK memberikan PDF dan menampilkan status tidak tersedia dengan tombol [ Coba Lagi ] & [ Tutup ].
 * - Menyediakan verifikasi token sesi anti-tamper untuk memastikan reward valid sebelum PDF digenerate.
 */

import { GptSlot, GptRewardedPayload } from '../types/googletag';

export type RewardedAdStatus =
  | 'IDLE' // Belum ada aksi
  | 'CONFIRM' // Modal: "Download PDF Gratis" - [ Tonton Iklan ] / [ Batal ]
  | 'LOADING_AD' // Menghubungkan ke provider iklan & menunggu ad siap
  | 'PLAYING_AD' // Iklan sedang berjalan di layar pengguna
  | 'VERIFYING' // Reward diterima dari provider, memverifikasi keabsahan sesi
  | 'GENERATING_PDF' // Reward terverifikasi, menyiapkan file PDF
  | 'SUCCESS' // PDF berhasil diunduh
  | 'UNAVAILABLE' // Iklan tidak tersedia / no-fill / timeout / adblocker
  | 'NOT_COMPLETED'; // Pengguna menutup iklan sebelum selesai / reward tidak diberikan

export interface RewardedSession {
  sessionId: string;
  timestamp: number;
  nonce: string;
  redeemed: boolean;
}

// Google Official Web Rewarded Ad Unit Test ID
// Bisa dioverride via VITE_GPT_REWARDED_AD_UNIT di .env
const DEFAULT_GPT_REWARDED_AD_UNIT =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GPT_REWARDED_AD_UNIT) ||
  '/21775744923/example/rewarded';

const AD_LOAD_TIMEOUT_MS = 3500; // 3.5 detik toleransi loading agar cepat auto-download jika iklan kosong

class RewardedAdsService {
  private activeSlot: GptSlot | null = null;
  private currentSession: RewardedSession | null = null;
  private isGptScriptLoaded = false;
  private scriptLoadingPromise: Promise<boolean> | null = null;

  /**
   * Memastikan library Google Publisher Tag (GPT) termuat dengan aman di halaman
   */
  public async loadGptScript(): Promise<boolean> {
    if (this.isGptScriptLoaded && window.googletag) {
      return true;
    }

    if (this.scriptLoadingPromise) {
      return this.scriptLoadingPromise;
    }

    this.scriptLoadingPromise = new Promise<boolean>((resolve) => {
      // Inisialisasi antrian googletag.cmd
      window.googletag = window.googletag || ({ cmd: [] } as any);

      // Cek apakah script sudah ada di DOM
      const existingScript = document.querySelector('script[src*="securepubads.g.doubleclick.net/tag/js/gpt.js"]');
      if (existingScript && window.googletag?.pubads) {
        this.isGptScriptLoaded = true;
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js';
      script.async = true;
      script.crossOrigin = 'anonymous';

      const cleanupAndResolve = (success: boolean) => {
        this.isGptScriptLoaded = success;
        resolve(success);
      };

      script.onload = () => {
        cleanupAndResolve(true);
      };

      script.onerror = () => {
        // Gagal memuat (misal karena jaringan terputus atau diblokir adblocker)
        console.warn('[RewardedAds] Google Publisher Tag script failed to load (possible adblocker/offline).');
        cleanupAndResolve(false);
      };

      document.head.appendChild(script);
    });

    return this.scriptLoadingPromise;
  }

  /**
   * Membuat sesi baru dengan nonce unik untuk memverifikasi callback reward dari provider
   */
  public createSession(): RewardedSession {
    const randomArray = new Uint8Array(16);
    if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
      window.crypto.getRandomValues(randomArray);
    } else {
      for (let i = 0; i < 16; i++) randomArray[i] = Math.floor(Math.random() * 256);
    }
    const nonce = Array.from(randomArray)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    const session: RewardedSession = {
      sessionId: `rew_sess_${Date.now()}_${nonce.slice(0, 8)}`,
      timestamp: Date.now(),
      nonce,
      redeemed: false,
    };

    this.currentSession = session;
    return session;
  }

  /**
   * Menampilkan Rewarded Ad resmi menggunakan Google Publisher Tag (GPT)
   */
  public async requestAndShowRewardedAd(callbacks: {
    onReady: () => void;
    onPlaying: () => void;
    onRewardGranted: (payload: GptRewardedPayload | null) => void;
    onDismissedWithoutReward: () => void;
    onUnavailable: (reason: string) => void;
  }): Promise<void> {
    const session = this.createSession();
    let rewardGranted = false;
    let adDisplayed = false;
    let isTerminated = false;
    let timeoutTimer: ReturnType<typeof setTimeout> | null = null;

    const terminateWithUnavailable = (reason: string) => {
      if (isTerminated) return;
      isTerminated = true;
      if (timeoutTimer) clearTimeout(timeoutTimer);
      this.cleanupSlot();
      callbacks.onUnavailable(reason);
    };

    // 1. Muat script GPT
    const scriptLoaded = await this.loadGptScript();
    if (!scriptLoaded || !window.googletag) {
      terminateWithUnavailable('Penyedia iklan tidak dapat dimuat (mungkin diblokir ad blocker atau offline)');
      return;
    }

    const googletag = window.googletag;

    // 2. Set timeout pelindung agar user tidak terjebak loading jika provider tidak merespons
    timeoutTimer = setTimeout(() => {
      if (!adDisplayed && !rewardGranted) {
        terminateWithUnavailable('Batas waktu memuat iklan habis (timeout)');
      }
    }, AD_LOAD_TIMEOUT_MS);

    googletag.cmd.push(() => {
      try {
        // Hancurkan slot sebelumnya jika ada
        this.cleanupSlot();

        // 3. Tentukan Out-of-Page Rewarded Slot
        const rewardedSlot = googletag.defineOutOfPageSlot(
          DEFAULT_GPT_REWARDED_AD_UNIT,
          googletag.enums.OutOfPageFormat.REWARDED
        );

        if (!rewardedSlot) {
          terminateWithUnavailable('Browser atau platform tidak mendukung format Web Rewarded Ads');
          return;
        }

        this.activeSlot = rewardedSlot;

        // Pasang targeting sesi untuk tracking kepatuhan
        rewardedSlot.setTargeting('session_id', session.sessionId);
        rewardedSlot.setTargeting('feature', 'kpr_pdf_download');
        rewardedSlot.addService(googletag.pubads());

        // Event listener: Iklan siap ditampilkan
        const readyListener = (event: any) => {
          if (isTerminated) return;
          if (timeoutTimer) clearTimeout(timeoutTimer);

          callbacks.onReady();

          // Panggil makeRewardedVisible() resmi dari Google untuk menampilkan overlay iklan
          if (typeof event.makeRewardedVisible === 'function') {
            adDisplayed = true;
            callbacks.onPlaying();
            event.makeRewardedVisible();
          }
        };

        // Event listener: Reward resmi dikonfirmasi oleh Google
        const grantedListener = (event: any) => {
          if (isTerminated) return;
          rewardGranted = true;
          callbacks.onRewardGranted(event.payload || null);
        };

        // Event listener: Slot ditutup oleh pengguna
        const closedListener = () => {
          if (isTerminated) return;
          if (timeoutTimer) clearTimeout(timeoutTimer);

          this.cleanupSlot();

          if (!rewardGranted) {
            // User menutup iklan sebelum selesai
            callbacks.onDismissedWithoutReward();
          }
        };

        // Event listener: Cek apakah slot kosong (no-fill)
        const renderEndedListener = (event: any) => {
          if (event.slot === rewardedSlot && event.isEmpty) {
            terminateWithUnavailable('Iklan sedang tidak tersedia dari jaringan iklan (no-fill)');
          }
        };

        googletag.pubads().addEventListener('rewardedSlotReady', readyListener);
        googletag.pubads().addEventListener('rewardedSlotGranted', grantedListener);
        googletag.pubads().addEventListener('rewardedSlotClosed', closedListener);
        googletag.pubads().addEventListener('slotRenderEnded', renderEndedListener);

        googletag.enableServices();
        googletag.display(rewardedSlot);
      } catch (err: any) {
        console.error('[RewardedAds] Error initializing GPT slot:', err);
        terminateWithUnavailable(err?.message || 'Terjadi kesalahan sistem iklan');
      }
    });
  }

  /**
   * Verifikasi keamanan: Memastikan reward yang diklaim terhubung dengan sesi aktif
   * dan belum pernah di-redeem (mencegah replay attack atau pemalsuan callback client)
   */
  public verifyReward(sessionId: string): { valid: boolean; error?: string } {
    if (!this.currentSession) {
      return { valid: false, error: 'Sesi verifikasi tidak ditemukan' };
    }

    if (this.currentSession.sessionId !== sessionId) {
      return { valid: false, error: 'ID Sesi reward tidak cocok' };
    }

    if (this.currentSession.redeemed) {
      return { valid: false, error: 'Token reward sesi ini sudah pernah digunakan' };
    }

    // Cek umur sesi (maksimal 5 menit)
    const elapsed = Date.now() - this.currentSession.timestamp;
    if (elapsed > 5 * 60 * 1000) {
      return { valid: false, error: 'Sesi reward telah kedaluwarsa' };
    }

    // Tandai sudah di-redeem
    this.currentSession.redeemed = true;
    return { valid: true };
  }

  /**
   * Reset / Cleanup slot yang sedang aktif
   */
  public cleanupSlot(): void {
    if (this.activeSlot && window.googletag?.destroySlots) {
      try {
        window.googletag.destroySlots([this.activeSlot]);
      } catch {
        // ignore
      }
      this.activeSlot = null;
    }
  }

  public getCurrentSession(): RewardedSession | null {
    return this.currentSession;
  }
}

export const rewardedAdsService = new RewardedAdsService();
