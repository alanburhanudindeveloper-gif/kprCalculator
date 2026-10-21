import React, { useEffect } from 'react';
import {
  FileText,
  PlayCircle,
  X,
  AlertCircle,
  Loader2,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { RewardedAdStatus } from '../services/rewardedAds';

interface RewardedAdPdfModalProps {
  isOpen: boolean;
  status: RewardedAdStatus;
  statusMessage?: string;
  onWatchAd: () => void;
  onCancel: () => void;
  onRetry: () => void;
}

export const RewardedAdPdfModal: React.FC<RewardedAdPdfModalProps> = ({
  isOpen,
  status,
  statusMessage,
  onWatchAd,
  onCancel,
  onRetry,
}) => {
  // Listen for Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Izinkan escape jika di status konfirmasi, tidak tersedia, belum selesai, atau sukses
      if (e.key === 'Escape') {
        if (
          status === 'CONFIRM' ||
          status === 'UNAVAILABLE' ||
          status === 'NOT_COMPLETED' ||
          status === 'SUCCESS'
        ) {
          onCancel();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, status, onCancel]);

  if (!isOpen) return null;

  const isClosable =
    status === 'CONFIRM' ||
    status === 'UNAVAILABLE' ||
    status === 'NOT_COMPLETED' ||
    status === 'SUCCESS';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rewarded-ad-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && isClosable) {
          onCancel();
        }
      }}
    >
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden transition-all animate-in zoom-in-95 duration-200">
        {/* Close Button (X) */}
        {isClosable && (
          <button
            type="button"
            onClick={onCancel}
            aria-label="Tutup popup"
            className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* --- 1. STATE: CONFIRM (Flow Awal Sesuai Brief) --- */}
        {status === 'CONFIRM' && (
          <div className="text-center space-y-5">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xs">
              <FileText className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3
                id="rewarded-ad-modal-title"
                className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight"
              >
                Download PDF Gratis
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed px-2">
                Untuk mendapatkan PDF secara gratis, tonton iklan singkat terlebih dahulu.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-100 dark:border-slate-800 text-left flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                Dokumen mencakup ringkasan simulasi SP3K BCA, perbandingan pangkas tenor/cicilan, dan jadwal amortisasi bulanan lengkap.
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <button
                type="button"
                onClick={onWatchAd}
                className="w-full sm:flex-1 py-3 px-4 bg-[#0060af] hover:bg-[#004e90] active:scale-[0.98] text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Tonton Iklan</span>
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="w-full sm:w-28 py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.98] text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-xl transition cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        )}

        {/* --- 2. STATE: LOADING AD --- */}
        {status === 'LOADING_AD' && (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Loader2 className="w-7 h-7 animate-spin" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Memuat Iklan Singkat...
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Menghubungkan ke penyedia iklan resmi. Mohon tunggu sebentar.
              </p>
            </div>
          </div>
        )}

        {/* --- 3. STATE: PLAYING AD --- */}
        {status === 'PLAYING_AD' && (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 animate-pulse">
              <PlayCircle className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Iklan Sedang Ditampilkan
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 px-4">
                Selesaikan tayangan iklan hingga reward diberikan untuk mengunduh dokumen PDF secara otomatis.
              </p>
            </div>
          </div>
        )}

        {/* --- 4. STATE: VERIFYING & GENERATING PDF --- */}
        {(status === 'VERIFYING' || status === 'GENERATING_PDF') && (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-7 h-7 animate-bounce" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                PDF sedang disiapkan...
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {statusMessage || 'Dokumen simulasi Anda sedang disiapkan dan akan otomatis terunduh.'}
              </p>
            </div>
          </div>
        )}

        {/* --- 5. STATE: SUCCESS --- */}
        {status === 'SUCCESS' && (
          <div className="text-center py-5 space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Download Berhasil!
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                File PDF simulasi KPR telah disimpan ke perangkat Anda.
              </p>
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl transition cursor-pointer"
            >
              Tutup
            </button>
          </div>
        )}

        {/* --- 6. STATE: UNAVAILABLE (Sesuai Syarat Ketat User) --- */}
        {status === 'UNAVAILABLE' && (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <AlertCircle className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Iklan Belum Tersedia
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed px-2">
                Maaf, iklan sedang tidak tersedia. Silakan coba lagi beberapa saat.
              </p>
              {statusMessage && (
                <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1">
                  Catatan: {statusMessage}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={onRetry}
                className="w-full sm:flex-1 py-2.5 px-4 bg-[#0060af] hover:bg-[#004e90] active:scale-[0.98] text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Coba Lagi</span>
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="w-full sm:w-24 py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        )}

        {/* --- 7. STATE: NOT COMPLETED (User menutup sebelum reward selesai) --- */}
        {status === 'NOT_COMPLETED' && (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Tayangan Iklan Belum Selesai
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed px-2">
                Iklan belum selesai atau reward belum diterima. PDF belum dapat di-download.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={onRetry}
                className="w-full sm:flex-1 py-2.5 px-4 bg-[#0060af] hover:bg-[#004e90] active:scale-[0.98] text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <PlayCircle className="w-3.5 h-3.5" />
                <span>Coba Lagi</span>
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="w-full sm:w-24 py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
