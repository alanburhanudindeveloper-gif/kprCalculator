import React from 'react';
import { SlidersHorizontal, RotateCcw, Building2, Sun, Moon, HelpCircle, FileDown } from 'lucide-react';

interface NavbarProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onReset: () => void;
  onClearSavedData: () => void;
  onOpenParams: () => void;
  onOpenRefinancingGuide: () => void;
  onExportPdf: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isDarkMode,
  onToggleDarkMode,
  onReset,
  onClearSavedData,
  onOpenParams,
  onOpenRefinancingGuide,
  onExportPdf,
}) => {
  return (
    <header className="bg-[#0060af] dark:bg-slate-900 text-white shadow-md sticky top-0 z-30 transition-colors border-b border-blue-700/50 dark:border-slate-800">
      {/* Top Primary Bar */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3 sm:gap-4">
        {/* Zone 1: Brand Title */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="w-9 h-9 rounded-xl bg-white/10 dark:bg-blue-600/20 flex items-center justify-center shrink-0 border border-white/20 dark:border-blue-500/30 hover:bg-white/20 transition"
            aria-label="Kembali ke Beranda Kalkulator KPR"
          >
            <Building2 className="w-5 h-5 text-white dark:text-blue-400" />
          </a>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-wider uppercase text-blue-200 dark:text-blue-400">
                SP3K BCA Model
              </span>
              <span className="text-white/40 dark:text-slate-600 text-xs">·</span>
              <span className="text-[10px] text-blue-100 dark:text-slate-400 hidden sm:inline">
                Amortisasi Bulanan Presisi
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-extrabold tracking-tight whitespace-nowrap">
              Kalkulator KPR Simulator
            </h1>
          </div>
        </div>

        {/* Zone 2 & 3: Actions + Dark Mode Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Export to PDF Button */}
          <button
            type="button"
            onClick={onExportPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-lg transition-all whitespace-nowrap shadow-xs cursor-pointer"
            title="Download Dokumen Hasil Simulasi dalam Format PDF"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>

          {/* Refinancing / Info Guide */}
          <button
            type="button"
            onClick={onOpenRefinancingGuide}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-white bg-white/10 dark:bg-slate-800 hover:bg-white/20 dark:hover:bg-slate-700 active:scale-95 rounded-lg border border-white/20 dark:border-slate-700 transition-all whitespace-nowrap cursor-pointer"
            title="Pelajari apakah rate berubah saat refinancing vs extra payment"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden md:inline">Refinancing?</span>
          </button>

          {/* Prominent Dark Mode Toggle */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-white bg-white/15 dark:bg-slate-800 hover:bg-white/25 dark:hover:bg-slate-700 active:scale-95 rounded-lg border border-white/20 dark:border-slate-700 transition-all cursor-pointer whitespace-nowrap shadow-xs"
            aria-label={isDarkMode ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
            title={isDarkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
          >
            {isDarkMode ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-300 transition-transform hover:rotate-45" />
                <span className="hidden sm:inline">Terang</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-blue-100 transition-transform hover:-rotate-12" />
                <span className="hidden sm:inline">Gelap</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenParams}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-white bg-white/10 dark:bg-slate-800 hover:bg-white/20 dark:hover:bg-slate-700 active:scale-95 rounded-lg border border-white/20 dark:border-slate-700 transition-all whitespace-nowrap cursor-pointer"
            title="Kustomisasi Parameter SP3K"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Parameter</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-white bg-white/10 dark:bg-slate-800 hover:bg-white/20 dark:hover:bg-slate-700 active:scale-95 rounded-lg border border-white/20 dark:border-slate-700 transition-all whitespace-nowrap cursor-pointer"
            title="Kembalikan semua nilai ke default SP3K BCA"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Reset</span>
          </button>

          <button
            onClick={onClearSavedData}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-white bg-red-500/20 hover:bg-red-500/30 dark:bg-red-500/15 dark:hover:bg-red-500/25 active:scale-95 rounded-lg border border-red-200/30 dark:border-red-500/30 transition-all whitespace-nowrap cursor-pointer"
            title="Hapus semua data yang tersimpan di browser"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Hapus Data</span>
          </button>
        </div>
      </div>

      {/* Subnav for Internal Linking & Search Intent */}
      <nav
        aria-label="Navigasi Utama Kalkulator KPR"
        className="bg-[#005296] dark:bg-slate-950/70 border-t border-blue-600/30 dark:border-slate-800/80 px-4 py-2"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar text-xs font-semibold text-blue-100 dark:text-slate-300 gap-4 sm:gap-6">
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            <a
              href="#kalkulator-section"
              className="hover:text-white dark:hover:text-white transition flex items-center gap-1.5"
            >
              <span>Kalkulator Pokok</span>
            </a>
            <a
              href="#financial-advisor-section"
              className="text-amber-300 dark:text-amber-400 font-bold hover:text-white dark:hover:text-white transition flex items-center gap-1.5"
            >
              <span>Cek Finansial &amp; Advisor</span>
            </a>
            <a
              href="#skenario-section"
              className="hover:text-white dark:hover:text-white transition flex items-center gap-1.5"
            >
              <span>Skenario Nominal</span>
            </a>
            <a
              href="#grafik-section"
              className="hover:text-white dark:hover:text-white transition flex items-center gap-1.5"
            >
              <span>Grafik Bunga &amp; Tenor</span>
            </a>
            <a
              href="#amortisasi-section"
              className="hover:text-white dark:hover:text-white transition flex items-center gap-1.5"
            >
              <span>Tabel Amortisasi</span>
            </a>
          </div>

          <div className="flex items-center gap-4 shrink-0 text-amber-300 dark:text-amber-400">
            <a
              href="#panduan-pelunasan"
              className="hover:underline flex items-center gap-1"
            >
              <span>Panduan KPR</span>
            </a>
            <a
              href="#faq-kpr"
              className="hover:underline flex items-center gap-1"
            >
              <span>FAQ</span>
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};
