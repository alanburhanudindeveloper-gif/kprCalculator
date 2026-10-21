import React, { useState, useId } from 'react';
import {
  Sliders,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Clock,
  TrendingDown,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';
import { UserFinancialProfile, FinancialAssessmentResult } from '../../types/financialHealth';
import { KprParameters, SimulationMode, PaymentInterval, SimulationResult } from '../../types/kpr';
import { assessFinancialHealth } from '../../utils/financialAdvisor';
import { formatRupiah, runAmortizationSimulation } from '../../utils/calculator';

interface WhatIfInteractiveSliderProps {
  profile: UserFinancialProfile;
  kprParams: KprParameters;
  interval: PaymentInterval;
  mode: SimulationMode;
  baseline: SimulationResult;
  simulated: SimulationResult;
  currentExtraAnnual: number;
  onApplyExtra: (amount: number) => void;
}

export const WhatIfInteractiveSlider: React.FC<WhatIfInteractiveSliderProps> = ({
  profile,
  kprParams,
  interval,
  mode,
  baseline,
  simulated,
  currentExtraAnnual,
  onApplyExtra,
}) => {
  const sliderInputId = useId();
  const [sliderValue, setSliderValue] = useState<number>(currentExtraAnnual);

  // Evaluasi secara real-time berdasarkan sliderValue
  const whatIfSim = runAmortizationSimulation(kprParams, sliderValue, interval, mode);
  const whatIfAssessment = assessFinancialHealth({
    profile,
    kprParams,
    extraAnnualTarget: sliderValue,
    interval,
    mode,
    baseline,
    simulated: whatIfSim,
  });

  const {
    disposableIncome,
    remainingBuffer,
    extraMonthlyEquivalent,
    healthStatus,
    healthScore,
    healthHeadline,
    warnings,
    insights,
    recommendedExtraAnnual,
  } = whatIfAssessment;

  const diffBulan = Math.max(0, baseline.bulanLunas - whatIfSim.bulanLunas);
  const hematBunga = Math.max(0, baseline.totalBunga - whatIfSim.totalBunga);

  const isHealthy = healthStatus === 'healthy';
  const isCaution = healthStatus === 'caution';
  const isAggressive = healthStatus === 'aggressive';

  const quickAmounts = [
    0,
    12_000_000,
    24_000_000,
    36_000_000,
    48_000_000,
    60_000_000,
    72_000_000,
    96_000_000,
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-5">
      <div>
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Analisis Interaktif What-If Extra Payment</span>
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Geser nilai extra payment di bawah untuk melihat dampak langsung terhadap tenor KPR, sisa buffer kas, dan status kesehatan finansial.
        </p>
      </div>

      {/* Interactive Slider Box */}
      <div className="bg-slate-50 dark:bg-slate-800/60 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <label htmlFor={sliderInputId} className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Simulasi Extra Payment Tahunan:
            </label>
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {formatRupiah(sliderValue)} <span className="text-sm font-normal text-slate-500">/tahun</span>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Beban Bulanan Setara:</span>
            <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
              {formatRupiah(extraMonthlyEquivalent)} / bulan
            </span>
          </div>
        </div>

        {/* Range Slider */}
        <div className="space-y-2">
          <input
            id={sliderInputId}
            type="range"
            min={0}
            max={120_000_000}
            step={2_000_000}
            value={sliderValue}
            onChange={(e) => setSliderValue(Number(e.target.value))}
            className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Rp0 (Normal)</span>
            <span>Rp30 Jt</span>
            <span>Rp60 Jt</span>
            <span>Rp90 Jt</span>
            <span>Rp120 Jt+</span>
          </div>
        </div>

        {/* Quick Click Shortcuts */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mr-1">
            Pilihan Cepat:
          </span>
          {quickAmounts.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setSliderValue(amt)}
              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                sliderValue === amt
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {amt === 0 ? 'Rp0' : `${amt / 1_000_000} Jt`}
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Result Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        {/* Estimasi Tenor */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            <span>Estimasi Tenor</span>
          </span>
          <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-1 block">
            {(whatIfSim.bulanLunas / 12).toFixed(1)} Tahun
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 block">
            {diffBulan > 0 ? `Pangkas ${diffBulan} bulan` : 'Sesuai tenor normal'}
          </span>
        </div>

        {/* Hemat Bunga */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />
            <span>Hemat Bunga</span>
          </span>
          <span className="text-sm sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">
            {formatRupiah(hematBunga)}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            Penghematan bunga bank
          </span>
        </div>

        {/* Sisa Buffer Kas */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
            Sisa Buffer Kas Bulanan
          </span>
          <span
            className={`text-sm sm:text-base font-extrabold mt-1 block ${
              remainingBuffer >= 1_500_000
                ? 'text-emerald-600 dark:text-emerald-400'
                : remainingBuffer >= 0
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {formatRupiah(remainingBuffer)}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            Setelah disisihkan per bulan
          </span>
        </div>

        {/* Live Status Badge */}
        <div
          className={`p-3 rounded-xl border flex flex-col justify-between ${
            isHealthy
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200'
              : isCaution
              ? 'bg-amber-50/70 border-amber-200 text-amber-950 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200'
              : 'bg-rose-50/70 border-rose-200 text-rose-950 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-200'
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">
            Status Finansial
          </span>
          <div className="text-sm sm:text-base font-extrabold mt-1">
            {isHealthy && '🟢 SEHAT'}
            {isCaution && '🟡 WASPADA'}
            {isAggressive && '🔴 AGRESIF'}
          </div>
          <span className="text-[10px] opacity-80 mt-0.5 block">
            Skor: {healthScore}/100
          </span>
        </div>
      </div>

      {/* Live Warning / Feedback */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs space-y-1.5 border border-slate-100 dark:border-slate-800">
        <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span>Analisis Kapasitas Cash Flow:</span>
        </div>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
          {isHealthy &&
            `Alokasi ${formatRupiah(sliderValue)}/tahun masih berada dalam batas aman cash flow Anda (${((extraMonthlyEquivalent / Math.max(1, disposableIncome)) * 100).toFixed(0)}% dari surplus). Buffer likuiditas bulanan tetap terjaga.`}
          {isCaution &&
            `Alokasi ${formatRupiah(sliderValue)}/tahun menggunakan ${((extraMonthlyEquivalent / Math.max(1, disposableIncome)) * 100).toFixed(0)}% dari surplus kas Anda. Tenor berkurang signifikan, namun fleksibilitas pengeluaran darurat mulai terbatas.`}
          {isAggressive &&
            `Target ${formatRupiah(sliderValue)}/tahun sangat agresif dan berisiko menekan cash flow atau mengorbankan dana darurat. Pertimbangkan mendekati rekomendasi seimbang sekitar ${formatRupiah(recommendedExtraAnnual)}/tahun.`}
        </p>
      </div>

      {/* Apply Slider Button */}
      {sliderValue !== currentExtraAnnual && (
        <button
          type="button"
          onClick={() => onApplyExtra(sliderValue)}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
        >
          <span>Terapkan {formatRupiah(sliderValue)}/tahun ke Simulator Utama</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
