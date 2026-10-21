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
import { KprParameters, SimulationMode, PaymentInterval } from './types/kpr';
import {
  DEFAULT_SP3K_PARAMS,
  runAmortizationSimulation,
  generateScenarioItems,
  formatRupiah,
} from './utils/calculator';
import { exportKprSimulationToPdf } from './utils/pdfExport';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [params, setParams] = useState<KprParameters>(DEFAULT_SP3K_PARAMS);
  const [mode, setMode] = useState<SimulationMode>('A');
  const [extraAnnual, setExtraAnnual] = useState<number>(20_000_000);
  const [interval, setInterval] = useState<PaymentInterval>(12);
  const [isParamModalOpen, setIsParamModalOpen] = useState(false);
  const [isRefinancingModalOpen, setIsRefinancingModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  const handleReset = () => {
    setParams(DEFAULT_SP3K_PARAMS);
    setExtraAnnual(20_000_000);
    setInterval(12);
    setMode('A');
    showToast('Parameter dikembalikan ke data default SP3K BCA (Plafon Rp631 Juta, 20 Tahun)');
  };

  const handleApplyReverseExtra = (amount: number) => {
    setExtraAnnual(amount);
    showToast(`Berhasil menerapkan target extra payment: ${formatRupiah(amount)}/tahun`);
  };

  const handleExportPdf = () => {
    try {
      showToast('Membuat dokumen PDF...');
      exportKprSimulationToPdf({
        params,
        extraAnnual,
        interval,
        mode,
        baseline,
        simulated,
      });
      showToast('File PDF berhasil diunduh!');
    } catch (err) {
      console.error(err);
      showToast('Gagal mengekspor PDF.');
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
          onOpenParams={() => setIsParamModalOpen(true)}
          onOpenRefinancingGuide={() => setIsRefinancingModalOpen(true)}
          onExportPdf={handleExportPdf}
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

          {/* Scenario Table */}
          <ScenarioTable
            scenarios={scenarios}
            currentExtraAnnual={extraAnnual}
            onSelectExtra={(amt) => {
              setExtraAnnual(amt);
              showToast(`Dipilih skenario extra payment ${formatRupiah(amt)}/tahun`);
            }}
          />

          {/* 3 Interactive Chart.js Visualizations */}
          <ChartsSection
            params={params}
            baseline={baseline}
            simulated={simulated}
            mode={mode}
            isDarkMode={isDarkMode}
          />

          {/* Amortization Schedule Table */}
          <AmortizationSchedule
            schedule={simulated.schedule}
            totalMonths={simulated.bulanLunas}
            onExportPdf={handleExportPdf}
          />

          {/* Legal and Technical Disclaimer */}
          <Disclaimer mode={mode} />
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">KPR Extra Payment Simulator</span>
            <span>·</span>
            <span>Data Default SP3K BCA Plafon Rp631.000.000 (20 Tahun)</span>
          </div>
          <div className="text-slate-400 dark:text-slate-500">
            Perhitungan amortisasi bulanan aktuaria perbankan
          </div>
        </div>
      </footer>

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
