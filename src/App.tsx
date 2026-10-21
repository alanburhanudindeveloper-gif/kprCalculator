import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ModeSelector } from './components/ModeSelector';
import { LoanParametersCard } from './components/LoanParametersCard';
import { HeroQuestionBanner } from './components/HeroQuestionBanner';
import { ExtraPaymentInput } from './components/ExtraPaymentInput';
import { SummaryDashboard } from './components/SummaryDashboard';
import { ComparisonTable } from './components/ComparisonTable';
import { ReverseCalculator } from './components/ReverseCalculator';
import { ScenarioTable } from './components/ScenarioTable';
import { ChartsSection } from './components/ChartsSection';
import { AmortizationSchedule } from './components/AmortizationSchedule';
import { Sp3kParameterModal } from './components/Sp3kParameterModal';
import { Disclaimer } from './components/Disclaimer';
import { MonthlyBreakdownExplainer } from './components/MonthlyBreakdownExplainer';
import { RefinancingGuideModal } from './components/RefinancingGuideModal';
import { KprSeoContentSection } from './components/KprSeoContentSection';
import { KprParameters, SimulationMode, PaymentInterval } from './types/kpr';
import {
  DEFAULT_SP3K_PARAMS,
  runAmortizationSimulation,
  generateScenarioItems,
  formatRupiah,
} from './utils/calculator';
import { exportKprSimulationToPdf } from './utils/pdfExport';
import { RewardedAdPdfModal } from './components/RewardedAdPdfModal';
import { rewardedAdsService, RewardedAdStatus } from './services/rewardedAds';
import {
  loadCalculatorSnapshot,
  loadFinancialProfile,
  loadThemePreference,
  saveCalculatorSnapshot,
  saveFinancialProfile,
  saveThemePreference,
  clearFinancialProfile,
  saveSimulationHistoryEntry,
  clearAllSavedData,
  loadSimulationHistory,
  SimulationHistoryEntry,
} from './services/localDb';
import { FinancialHealthAdvisorCard } from './components/financial/FinancialHealthAdvisorCard';
import { UserFinancialProfile } from './types/financialHealth';
import { DEFAULT_FINANCIAL_PROFILE } from './utils/financialAdvisor';
import { CheckCircle2 } from 'lucide-react';
import { SimulationHistoryPanel } from './components/SimulationHistoryPanel';
import { hasSupabaseConfig, syncSimulationToSupabase } from './services/supabase';

export default function App() {
  const [params, setParams] = useState<KprParameters>(DEFAULT_SP3K_PARAMS);
  const [mode, setMode] = useState<SimulationMode>('A');
  const [extraAnnual, setExtraAnnual] = useState<number>(20_000_000);
  const [interval, setInterval] = useState<PaymentInterval>(12);
  const [isParamModalOpen, setIsParamModalOpen] = useState(false);
  const [isRefinancingModalOpen, setIsRefinancingModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [historyEntries, setHistoryEntries] = useState<SimulationHistoryEntry[]>([]);

  // Dark Mode State with LocalStorage & OS preference detection
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    let isMounted = true;

    const hydrateFromDatabase = async () => {
      try {
        const savedSnapshot = await loadCalculatorSnapshot();
        if (isMounted && savedSnapshot) {
          setParams(savedSnapshot.params);
          setExtraAnnual(savedSnapshot.extraAnnual);
          setInterval(savedSnapshot.interval);
          setMode(savedSnapshot.mode);
        }

        const savedProfile = await loadFinancialProfile();
        if (isMounted && savedProfile) {
          setFinancialProfile(savedProfile);
        }

        const savedTheme = await loadThemePreference();
        if (isMounted && savedTheme) {
          const nextIsDark = savedTheme === 'dark';
          setIsDarkMode(nextIsDark);
        }

        const savedHistory = await loadSimulationHistory();
        if (isMounted) {
          setHistoryEntries(savedHistory);
        }
      } finally {
        if (isMounted) {
          setHasHydrated(true);
        }
      }
    };

    void hydrateFromDatabase();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;

    void saveCalculatorSnapshot({
      params,
      extraAnnual,
      interval,
      mode,
      updatedAt: Date.now(),
    });
  }, [params, extraAnnual, interval, mode, hasHydrated]);

  useEffect(() => {
    if (!hasHydrated) return;
    void saveThemePreference(isDarkMode ? 'dark' : 'light');
  }, [isDarkMode, hasHydrated]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    showToast(isDarkMode ? 'Mode Terang diaktifkan' : 'Mode Gelap diaktifkan');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Hitung baseline: tanpa extra payment (SP3K murni)
  const baseline = runAmortizationSimulation(params, 0, 12, 'A');

  // 2. Hitung simulasi dengan extra payment dan mode yang dipilih
  const simulated = runAmortizationSimulation(params, extraAnnual, interval, mode);

  // 3. Generate skenario otomatis
  const scenarios = generateScenarioItems(params, interval, mode, baseline);

  const handleSaveCurrentSimulation = async () => {
    const payload = {
      params,
      extraAnnual,
      interval,
      mode,
      savedAt: Date.now(),
    };

    await saveSimulationHistoryEntry(payload);
    const refreshedHistory = await loadSimulationHistory();
    setHistoryEntries(refreshedHistory);

    if (hasSupabaseConfig) {
      await syncSimulationToSupabase(payload);
      showToast('Simulasi disimpan ke lokal dan cloud');
    } else {
      showToast('Simulasi disimpan di browser');
    }
  };

  const handleRestoreHistory = (entry: SimulationHistoryEntry) => {
    setParams(entry.params);
    setExtraAnnual(entry.extraAnnual);
    setInterval(entry.interval);
    setMode(entry.mode);
    showToast('Data riwayat berhasil dipulihkan');
  };

  const handleReset = () => {
    setParams(DEFAULT_SP3K_PARAMS);
    setExtraAnnual(20_000_000);
    setInterval(12);
    setMode('A');
    showToast('Parameter dikembalikan ke data default SP3K BCA (Plafon Rp631 Juta, 20 Tahun)');
  };

  const handleClearSavedData = async () => {
    setParams(DEFAULT_SP3K_PARAMS);
    setExtraAnnual(20_000_000);
    setInterval(12);
    setMode('A');
    setIsDarkMode(false);
    localStorage.setItem('theme', 'light');
    localStorage.removeItem('kpr_financial_profile');
    setFinancialProfile(DEFAULT_FINANCIAL_PROFILE);
    await clearAllSavedData();
    showToast('Data tersimpan di browser berhasil dihapus');
  };

  const [financialProfile, setFinancialProfile] = useState<UserFinancialProfile>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('kpr_financial_profile');
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return DEFAULT_FINANCIAL_PROFILE;
  });

  const handleUpdateFinancialProfile = (newProfile: UserFinancialProfile) => {
    setFinancialProfile(newProfile);
    try {
      localStorage.setItem('kpr_financial_profile', JSON.stringify(newProfile));
    } catch {
      // ignore
    }
    void saveFinancialProfile(newProfile);
    showToast('Profil finansial berhasil diperbarui');
  };

  const handleResetFinancialProfile = () => {
    setFinancialProfile(DEFAULT_FINANCIAL_PROFILE);
    try {
      localStorage.removeItem('kpr_financial_profile');
    } catch {
      // ignore
    }
    void clearFinancialProfile();
    showToast('Profil finansial dikembalikan ke standar');
  };

  const handleApplyReverseExtra = (amount: number) => {
    setExtraAnnual(amount);
    showToast(`Berhasil menerapkan target extra payment: ${formatRupiah(amount)}/tahun`);
  };

  // --- REWARDED ADVERTISEMENT PDF MONETIZATION FLOW ---
  const [isRewardedModalOpen, setIsRewardedModalOpen] = useState(false);
  const [rewardedStatus, setRewardedStatus] = useState<RewardedAdStatus>('IDLE');
  const [rewardedErrorMsg, setRewardedErrorMsg] = useState<string>('');

  // 1. Entry point saat user menekan tombol [ Download PDF ] / [ Export PDF ]
  const requestPdfDownload = () => {
    setRewardedErrorMsg('');
    setRewardedStatus('CONFIRM');
    setIsRewardedModalOpen(true);
  };

  // 2. User membatalkan dialog
  const handleCancelRewardedModal = () => {
    rewardedAdsService.cleanupSlot();
    setIsRewardedModalOpen(false);
    setRewardedStatus('IDLE');
    setRewardedErrorMsg('');
  };

  // 3. User memilih [ Tonton Iklan ] / [ Coba Lagi ]
  const showRewardedAd = () => {
    setRewardedStatus('LOADING_AD');
    setRewardedErrorMsg('');

    rewardedAdsService.requestAndShowRewardedAd({
      onReady: () => {
        // Iklan siap ditampilkan
      },
      onPlaying: () => {
        setRewardedStatus('PLAYING_AD');
      },
      onRewardGranted: () => {
        // Callback resmi dari provider iklan diterima
        // Lakukan verifikasi sesi reward anti-tamper
        const activeSession = rewardedAdsService.getCurrentSession();
        if (!activeSession) {
          setRewardedStatus('UNAVAILABLE');
          setRewardedErrorMsg('Sesi reward tidak ditemukan');
          return;
        }

        const verifyResult = rewardedAdsService.verifyReward(activeSession.sessionId);
        if (!verifyResult.valid) {
          setRewardedStatus('UNAVAILABLE');
          setRewardedErrorMsg(verifyResult.error || 'Verifikasi reward gagal');
          return;
        }

        // Reward valid & terverifikasi -> siapkan dan download PDF
        executePdfGeneration();
      },
      onDismissedWithoutReward: () => {
        // User menutup iklan sebelum reward selesai
        setRewardedStatus('NOT_COMPLETED');
      },
      onUnavailable: (_reason: string) => {
        // Jika iklan masih kosong, no-fill, atau tidak tersedia:
        // Langsung lakukan auto download PDF untuk pengguna
        setRewardedStatus('GENERATING_PDF');
        setRewardedErrorMsg('Iklan sedang kosong. Menyiapkan dan mengunduh PDF secara langsung...');
        showToast('Iklan kosong, PDF langsung diunduh otomatis...');
        setTimeout(() => {
          executePdfGeneration();
        }, 400);
      },
    });
  };

  // 4. Generate & Auto-Download PDF hanya setelah reward resmi diverifikasi
  const executePdfGeneration = () => {
    try {
      setRewardedStatus('GENERATING_PDF');
      exportKprSimulationToPdf({
        params,
        extraAnnual,
        interval,
        mode,
        baseline,
        simulated,
        profile: financialProfile,
      });
      setRewardedStatus('SUCCESS');
      showToast('File PDF berhasil diunduh!');
      setTimeout(() => {
        setIsRewardedModalOpen(false);
        setRewardedStatus('IDLE');
      }, 1500);
    } catch (err) {
      console.error('[PDF Export Error]:', err);
      showToast('Gagal memproses dokumen PDF.');
      setIsRewardedModalOpen(false);
      setRewardedStatus('IDLE');
    }
  };

  const scrollToReverseSection = () => {
    const el = document.getElementById('reverse-calculator-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const pangkasBulan = Math.max(0, baseline.bulanLunas - simulated.bulanLunas);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] flex flex-col justify-between font-sans text-slate-800 dark:text-slate-100 transition-colors">
      <div>
        <Navbar
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          onReset={handleReset}
          onClearSavedData={handleClearSavedData}
          onOpenParams={() => setIsParamModalOpen(true)}
          onOpenRefinancingGuide={() => setIsRefinancingModalOpen(true)}
          onExportPdf={requestPdfDownload}
        />

        <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
          {/* Mode Selector */}
          <ModeSelector currentMode={mode} onSelectMode={setMode} />

          {/* Hero Question Banner */}
          <HeroQuestionBanner
            mode={mode}
            extraAnnual={extraAnnual}
            bulanPangkas={pangkasBulan}
            bulanLunas={simulated.bulanLunas}
            params={params}
            onScrollToReverse={scrollToReverseSection}
          />

          {/* Kalkulator Input Pokok KPR & Extra Payment Section */}
          <div id="kalkulator-section" className="space-y-6">
            {/* Variabel Pokok KPR & Suku Bunga (Multi-Kondisi: Fix Berjenjang, Fixed, Floating, Flat) */}
            <LoanParametersCard
              params={params}
              onChangeParams={(newParams) => {
                setParams(newParams);
                showToast('Parameter Pokok KPR & Suku Bunga berhasil disesuaikan');
              }}
              onResetDefaults={handleReset}
            />

            {/* Input Extra Payment */}
            <ExtraPaymentInput
              extraAnnual={extraAnnual}
              interval={interval}
              onChangeExtra={setExtraAnnual}
              onChangeInterval={setInterval}
            />
          </div>

          {/* Summary Dashboard Cards */}
          <SummaryDashboard
            mode={mode}
            params={params}
            baseline={baseline}
            simulated={simulated}
          />

          {/* Comparison Table */}
          <ComparisonTable
            mode={mode}
            params={params}
            baseline={baseline}
            simulated={simulated}
            extraAnnual={extraAnnual}
          />

          {/* Interactive Monthly Breakdown Explainer */}
          <MonthlyBreakdownExplainer
            params={params}
            extraAnnual={extraAnnual}
            interval={interval}
            activeMode={mode}
            onSelectMode={setMode}
            onOpenRefinancingGuide={() => setIsRefinancingModalOpen(true)}
          />

          {/* Reverse Calculator (Mode A Pangkas Tenor) */}
          {mode === 'A' && (
            <ReverseCalculator
              params={params}
              interval={interval}
              baseline={baseline}
              onApplyExtra={handleApplyReverseExtra}
            />
          )}

          {/* FINANCIAL HEALTH & EXTRA PAYMENT ADVISOR (FITUR UTAMA BARU) */}
          <FinancialHealthAdvisorCard
            profile={financialProfile}
            onChangeProfile={handleUpdateFinancialProfile}
            onResetProfile={handleResetFinancialProfile}
            kprParams={params}
            extraAnnual={extraAnnual}
            interval={interval}
            mode={mode}
            baseline={baseline}
            simulated={simulated}
            onApplyExtra={(amt) => {
              setExtraAnnual(amt);
              showToast(`Berhasil menerapkan target extra payment: ${formatRupiah(amt)}/tahun`);
            }}
          />

          <div className="pt-2">
            <SimulationHistoryPanel
              entries={historyEntries}
              onRestore={handleRestoreHistory}
              onSaveCurrent={handleSaveCurrentSimulation}
              cloudEnabled={hasSupabaseConfig}
            />
          </div>

          {/* Scenario Table Section */}
          <section id="skenario-section" aria-label="Tabel Skenario Nominal Pembayaran Ekstra">
            <ScenarioTable
              scenarios={scenarios}
              currentExtraAnnual={extraAnnual}
              onSelectExtra={(amt) => {
                setExtraAnnual(amt);
                showToast(`Dipilih skenario extra payment ${formatRupiah(amt)}/tahun`);
              }}
            />
          </section>

          {/* 3 Interactive Chart.js Visualizations Section */}
          <section id="grafik-section" aria-label="Grafik Visualisasi Penurunan Pokok dan Bunga">
            <ChartsSection
              params={params}
              baseline={baseline}
              simulated={simulated}
              mode={mode}
              isDarkMode={isDarkMode}
            />
          </section>

          {/* Amortization Schedule Table Section */}
          <section id="amortisasi-section" aria-label="Tabel Jadwal Amortisasi Bulanan KPR">
            <AmortizationSchedule
              schedule={simulated.schedule}
              totalMonths={simulated.bulanLunas}
              onExportPdf={requestPdfDownload}
            />
          </section>

          {/* Comprehensive SEO Content & FAQ Section */}
          <KprSeoContentSection />

          {/* Legal and Technical Disclaimer */}
          <Disclaimer mode={mode} />
        </main>
      </div>

      {/* SEO Optimized Footer with Internal Links */}
      <footer className="mt-14 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-6xl mx-auto px-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            {/* Col 1: Brand & Purpose */}
            <div className="md:col-span-2 space-y-2">
              <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm block">
                Kalkulator KPR Simulator (SP3K BCA Model)
              </span>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Aplikasi kalkulator simulasi pelunasan KPR berbasis amortisasi bulanan aktuarial.
                Membantu nasabah menghitung dampak pembayaran ekstra terhadap pengurangan pokok pinjaman,
                pemangkasan tenor kredit, dan recalculation cicilan bulanan (Fix Berjenjang, Fixed, Floating, dan Flat).
              </p>
              <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                Data Default: Plafon Rp631.000.000 · Tenor 240 Bulan (20 Tahun)
              </div>
            </div>

            {/* Col 2: Fitur Utama */}
            <div className="space-y-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider block">
                Fitur Simulasi
              </span>
              <ul className="space-y-1.5 text-[11px]">
                <li>
                  <a href="#kalkulator-section" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                    Mode A: Pangkas Tenor
                  </a>
                </li>
                <li>
                  <a href="#kalkulator-section" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                    Mode B: Turunkan Cicilan
                  </a>
                </li>
                <li>
                  <a href="#reverse-calculator-section" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                    Target Pelunasan Terbalik
                  </a>
                </li>
                <li>
                  <a href="#skenario-section" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                    Skenario Nominal Ekstra
                  </a>
                </li>
                <li>
                  <a href="#financial-advisor-section" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline transition">
                    Cek Kesehatan Finansial
                  </a>
                </li>
                <li>
                  <a href="#amortisasi-section" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                    Tabel Amortisasi Lengkap
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Edukasi & Panduan */}
            <div className="space-y-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider block">
                Edukasi KPR
              </span>
              <ul className="space-y-1.5 text-[11px]">
                <li>
                  <a href="#panduan-pelunasan" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                    Panduan Pelunasan KPR
                  </a>
                </li>
                <li>
                  <a href="#panduan-pelunasan" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                    Cara Hitung Bunga Anuitas
                  </a>
                </li>
                <li>
                  <a href="#faq-kpr" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                    Tanya Jawab (FAQ KPR)
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setIsRefinancingModalOpen(true)}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition text-left cursor-pointer"
                  >
                    Panduan Suku Bunga Refinancing
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={requestPdfDownload}
                    className="text-amber-600 dark:text-amber-400 hover:underline text-left cursor-pointer font-semibold"
                  >
                    Download Laporan PDF
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 dark:text-slate-500">
            <div>
              &copy; {new Date().getFullYear()} Kalkulator KPR Simulator. Didesain untuk perencanaan keuangan cerdas masyarakat Indonesia.
            </div>
            <div className="flex items-center gap-3">
              <a href="#kalkulator-section" className="hover:underline text-blue-600 dark:text-blue-400">
                Kembali ke Atas &uarr;
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Rewarded Advertisement Modal for PDF Download */}
      <RewardedAdPdfModal
        isOpen={isRewardedModalOpen}
        status={rewardedStatus}
        statusMessage={rewardedErrorMsg}
        onWatchAd={showRewardedAd}
        onCancel={handleCancelRewardedModal}
        onRetry={showRewardedAd}
      />

      {/* SP3K Parameters Modal */}
      <Sp3kParameterModal
        isOpen={isParamModalOpen}
        params={params}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onClose={() => setIsParamModalOpen(false)}
        onSave={(newParams) => {
          setParams(newParams);
          showToast('Parameter SP3K berhasil diperbarui');
        }}
        onReset={handleReset}
      />

      {/* Refinancing Guide Modal */}
      <RefinancingGuideModal
        isOpen={isRefinancingModalOpen}
        onClose={() => setIsRefinancingModalOpen(false)}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold py-3 px-4 rounded-xl shadow-lg border border-transparent dark:border-slate-700 flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
