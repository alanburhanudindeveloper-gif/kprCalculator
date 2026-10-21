import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Wallet,
  CheckCircle2,
  HelpCircle,
  PiggyBank,
  Sparkles,
} from 'lucide-react';
import { FinancialAssessmentResult } from '../../types/financialHealth';
import { formatRupiah } from '../../utils/calculator';

interface FinancialDashboardOverviewProps {
  assessment: FinancialAssessmentResult;
  onApplyRecommended: () => void;
  onOpenWhatIf: () => void;
}

export const FinancialDashboardOverview: React.FC<FinancialDashboardOverviewProps> = ({
  assessment,
  onApplyRecommended,
  onOpenWhatIf,
}) => {
  const {
    totalIncome,
    totalExpenses,
    cicilanKprCurrent,
    totalOtherDebts,
    disposableIncome,
    extraAnnualTarget,
    extraMonthlyEquivalent,
    remainingBuffer,
    emergencyFundMonths,
    emergencyCategory,
    dtiRatio,
    healthStatus,
    healthScore,
    healthHeadline,
    healthExplanation,
    insights,
    warnings,
    recommendedExtraAnnual,
    whyRecommended,
  } = assessment;

  const isHealthy = healthStatus === 'healthy';
  const isCaution = healthStatus === 'caution';
  const isAggressive = healthStatus === 'aggressive';

  return (
    <div className="space-y-6">
      {/* 1. HEALTH SCORE & STATUS BANNER */}
      <div
        className={`p-5 rounded-2xl border transition-all ${
          isHealthy
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-100'
            : isCaution
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-100'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-100'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                isHealthy
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                  : isCaution
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-600 dark:text-amber-400'
                  : 'bg-rose-500/20 border-rose-500/40 text-rose-600 dark:text-rose-400'
              }`}
            >
              {isHealthy ? (
                <ShieldCheck className="w-6 h-6" />
              ) : isCaution ? (
                <AlertTriangle className="w-6 h-6" />
              ) : (
                <AlertOctagon className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider opacity-75">
                  Indikasi Kesehatan Finansial
                </span>
                <span className="text-xs opacity-50">·</span>
                <span className="text-xs font-bold">
                  Skor: {healthScore}/100
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold tracking-tight mt-0.5">
                {isHealthy && '🟢 SEHAT'}
                {isCaution && '🟡 PERLU DIPERTIMBANGKAN'}
                {isAggressive && '🔴 TERLALU AGRESIF'}
                <span className="text-sm font-semibold opacity-85 ml-2">({healthHeadline})</span>
              </h3>
              <p className="text-xs sm:text-sm mt-1 leading-relaxed opacity-90 max-w-2xl">
                {healthExplanation}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-1.5 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-current/15">
            <span className="text-[11px] font-semibold opacity-75">Target Extra Payment Anda:</span>
            <span className="text-base font-extrabold tracking-tight">
              {formatRupiah(extraAnnualTarget)}/thn
            </span>
            <span className="text-xs opacity-80">
              (Setara {formatRupiah(extraMonthlyEquivalent)}/bln)
            </span>
          </div>
        </div>

        {/* Warnings & Insights */}
        {(warnings.length > 0 || insights.length > 0) && (
          <div className="mt-4 pt-3.5 border-t border-current/15 space-y-2 text-xs">
            {warnings.map((w, idx) => (
              <div key={idx} className="flex items-start gap-2 text-rose-700 dark:text-rose-300">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{w}</span>
              </div>
            ))}
            {insights.map((ins, idx) => (
              <div key={idx} className="flex items-start gap-2 text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{ins}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. CASH FLOW WATERFALL & DISPOSABLE INCOME CARDS */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Wallet className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Struktur Cash Flow &amp; Disposable Income Bulanan</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Perhitungan kemampuan kas bersih sebelum dan sesudah beban extra payment
            </p>
          </div>
        </div>

        {/* Waterfall Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          {/* Income */}
          <div className="bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 rounded-xl p-3">
            <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-400 block">
              Penghasilan Bersih
            </span>
            <span className="text-sm sm:text-base font-extrabold text-emerald-900 dark:text-emerald-200 mt-1 block">
              +{formatRupiah(totalIncome)}
            </span>
            <span className="text-[10px] text-emerald-700/80 dark:text-emerald-400 mt-0.5 block">
              Take-home pay bulanan
            </span>
          </div>

          {/* Expenses */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl p-3">
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block">
              Pengeluaran Rutin
            </span>
            <span className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-slate-200 mt-1 block">
              -{formatRupiah(totalExpenses)}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 block">
              Kebutuhan hidup &amp; utilitas
            </span>
          </div>

          {/* Cicilan KPR */}
          <div className="bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/40 rounded-xl p-3">
            <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-400 block">
              Cicilan KPR Berjalan
            </span>
            <span className="text-sm sm:text-base font-extrabold text-blue-900 dark:text-blue-200 mt-1 block">
              -{formatRupiah(cicilanKprCurrent)}
            </span>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 mt-0.5 block">
              Kewajiban reguler KPR
            </span>
          </div>

          {/* Utang Lain */}
          <div className="bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 rounded-xl p-3">
            <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-400 block">
              Utang Lain (Non-KPR)
            </span>
            <span className="text-sm sm:text-base font-extrabold text-amber-900 dark:text-amber-200 mt-1 block">
              -{formatRupiah(totalOtherDebts)}
            </span>
            <span className="text-[10px] text-amber-700/80 dark:text-amber-400 mt-0.5 block">
              Mobil/motor/kartu kredit
            </span>
          </div>

          {/* Disposable Income */}
          <div className="col-span-2 sm:col-span-1 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-xl p-3">
            <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400 block">
              = Disposable Income
            </span>
            <span
              className={`text-sm sm:text-base font-extrabold mt-1 block ${
                disposableIncome > 0
                  ? 'text-indigo-900 dark:text-indigo-200'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {formatRupiah(disposableIncome)}
            </span>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-0.5 block">
              Surplus kas sebelum extra
            </span>
          </div>
        </div>

        {/* 3. BUFFER AFTER EXTRA PAYMENT */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Sisa Financial Buffer Setelah Target Extra Payment:
              </span>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                  remainingBuffer >= 2_000_000
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : remainingBuffer >= 1_000_000
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                    : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                }`}
              >
                {remainingBuffer >= 2_000_000
                  ? 'Buffer Aman'
                  : remainingBuffer >= 1_000_000
                  ? 'Buffer Tipis'
                  : 'Beresiko Defisit'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {remainingBuffer >= 2_000_000
                ? 'Masih terdapat buffer cash flow yang cukup aman setelah memperhitungkan target pembayaran ekstra KPR Anda.'
                : remainingBuffer >= 0
                ? 'Buffer bulanan Anda relatif tipis. Extra payment ini mempercepat KPR, tetapi mengurangi fleksibilitas ketika ada pengeluaran tak terduga.'
                : 'Target extra payment Anda melebihi kapasitas surplus kas bulanan. Disarankan menurunkan nominal target agar tidak defisit.'}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs text-slate-400 block">Sisa Kas Bulanan:</span>
            <span
              className={`text-lg sm:text-xl font-extrabold tracking-tight ${
                remainingBuffer >= 1_000_000
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : remainingBuffer >= 0
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {formatRupiah(remainingBuffer)}/bulan
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              (setelah disisihkan {formatRupiah(extraMonthlyEquivalent)}/bln)
            </span>
          </div>
        </div>

        {/* 4. EMERGENCY FUND & DTI INDICATORS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
          {/* Emergency Fund */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <PiggyBank className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Kecukupan Dana Darurat</span>
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  emergencyCategory === 'strong'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : emergencyCategory === 'moderate'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                }`}
              >
                {emergencyCategory === 'strong' ? 'Kuat' : emergencyCategory === 'moderate' ? 'Cukup' : 'Rendah'}
              </span>
            </div>
            <div className="text-sm font-extrabold text-slate-900 dark:text-white">
              ±{emergencyFundMonths.toFixed(1)} Bulan Pengeluaran
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
              {emergencyCategory === 'low'
                ? 'Dana darurat < 3 bulan. Disarankan memperkuat cadangan darurat terlebih dahulu sebelum agresif melunasi KPR.'
                : emergencyCategory === 'moderate'
                ? 'Dana darurat mencakup 3-6 bulan pengeluaran wajib. Kondisi ideal untuk mulai melakukan extra payment proporsional.'
                : 'Dana darurat > 6 bulan pengeluaran. Anda memiliki fondasi keamanan finansial yang sangat kokoh.'}
            </p>
          </div>

          {/* Debt To Income (DTI) */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Rasio Beban Utang (DTI)</span>
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  dtiRatio <= 0.35
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : dtiRatio <= 0.45
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                }`}
              >
                {dtiRatio <= 0.35 ? 'Aman' : dtiRatio <= 0.45 ? 'Moderat' : 'Tinggi'}
              </span>
            </div>
            <div className="text-sm font-extrabold text-slate-900 dark:text-white">
              {(dtiRatio * 100).toFixed(0)}% dari Total Pendapatan
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
              Total cicilan utang (KPR + lainnya) dibanding penghasilan bersih. Standar sehat perbankan adalah maksimal 30% - 40%.
            </p>
          </div>
        </div>
      </div>

      {/* 5. RECOMMENDED EXTRA PAYMENT HERO CARD */}
      <div className="bg-linear-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-5 sm:p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-extrabold text-[11px] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Rekomendasi Seimbang (Optimal Range)
              </span>
              <h4 className="text-xl sm:text-2xl font-black mt-2 tracking-tight">
                {formatRupiah(recommendedExtraAnnual)} / tahun
              </h4>
              <p className="text-xs text-blue-200 mt-0.5">
                Setara cicilan ekstra tabungan {formatRupiah(recommendedExtraAnnual / 12)} / bulan
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onApplyRecommended}
                className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>Terapkan Rekomendasi Ini</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3.5 border border-white/15 text-xs text-blue-100 leading-relaxed">
            <strong className="text-white block mb-1">Mengapa angka ini direkomendasikan?</strong>
            {whyRecommended}
          </div>
        </div>
      </div>
    </div>
  );
};
