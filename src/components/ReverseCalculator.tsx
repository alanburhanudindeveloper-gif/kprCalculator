import React, { useState, useId } from 'react';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { KprParameters, PaymentInterval, SimulationResult } from '../types/kpr';
import { findExtraForTargetYears, formatRupiah, formatBulanTahun } from '../utils/calculator';

interface ReverseCalculatorProps {
  params: KprParameters;
  interval: PaymentInterval;
  baseline: SimulationResult;
  onApplyExtra: (amount: number) => void;
}

export const ReverseCalculator: React.FC<ReverseCalculatorProps> = ({
  params,
  interval,
  baseline,
  onApplyExtra,
}) => {
  const sliderId = useId();
  const [targetYearsEarlier, setTargetYearsEarlier] = useState<number>(5);
  const [justApplied, setJustApplied] = useState(false);

  const searchResult = findExtraForTargetYears(params, targetYearsEarlier, interval);
  const targetTenorTahun = params.tenorBulan / 12 - targetYearsEarlier;
  const targetTenorBulan = targetTenorTahun * 12;

  const extraNeeded = searchResult.extraAnnualNeeded;
  const extraPerBulan = Math.round(extraNeeded / 12);
  const totalExtra = searchResult.testResult.totalExtra;
  const bungaDihemat = Math.max(0, baseline.totalBunga - searchResult.testResult.totalBunga);

  const handleApply = () => {
    onApplyExtra(extraNeeded);
    setJustApplied(true);
    setTimeout(() => setJustApplied(false), 2500);
  };

  return (
    <div
      id="reverse-calculator-section"
      className="bg-gradient-to-br from-indigo-950 via-blue-950 to-slate-900 text-white p-5 sm:p-6 rounded-2xl shadow-sm border border-blue-900/40 space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Reverse Calculator (Iterative Binary Search)</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
            "Saya ingin KPR lunas lebih cepat {targetYearsEarlier} tahun"
          </h3>
        </div>

        <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 self-start sm:self-auto flex items-center gap-2">
          <span className="text-xs text-blue-200">Target Pangkas:</span>
          <span className="text-sm font-extrabold text-amber-300">{targetYearsEarlier} Tahun Lebih Cepat</span>
        </div>
      </div>

      {/* Slider */}
      <div className="space-y-1 pt-1">
        <label htmlFor={sliderId} className="sr-only">Target Pengurangan Tenor (Tahun)</label>
        <input
          id={sliderId}
          type="range"
          min={1}
          max={15}
          step={1}
          value={targetYearsEarlier}
          onChange={(e) => setTargetYearsEarlier(Number(e.target.value))}
          className="w-full h-2.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400"
        />
        <div className="flex justify-between text-[10px] sm:text-[11px] text-blue-200 font-semibold px-1">
          <span>1 Thn</span>
          <span>3 Thn</span>
          <span>5 Thn</span>
          <span>8 Thn</span>
          <span>10 Thn</span>
          <span>12 Thn</span>
          <span>15 Thn</span>
        </div>
      </div>

      {/* Numerical Search Output Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-1 tabular-nums">
        <div className="bg-white/10 p-3 rounded-xl border border-white/10">
          <span className="text-[11px] text-blue-200 block font-medium">Target Tenor Baru</span>
          <div className="text-base sm:text-lg font-bold text-white mt-0.5">
            {targetTenorTahun} Tahun
          </div>
          <span className="text-[10px] text-blue-300">({targetTenorBulan} Bulan)</span>
        </div>

        <div className="bg-white/10 p-3 rounded-xl border border-white/10">
          <span className="text-[11px] text-blue-200 block font-medium">Extra Dibutuhkan / Tahun</span>
          <div className="text-base sm:text-lg font-extrabold text-amber-300 mt-0.5">
            {formatRupiah(extraNeeded)}
          </div>
          <span className="text-[10px] text-amber-200/80">/ tahun (disetor 1x/thn)</span>
        </div>

        <div className="bg-white/10 p-3 rounded-xl border border-white/10">
          <span className="text-[11px] text-blue-200 block font-medium">Setara Jika Dicicil / Bulan</span>
          <div className="text-base sm:text-lg font-bold text-cyan-200 mt-0.5">
            {formatRupiah(extraPerBulan)}
          </div>
          <span className="text-[10px] text-blue-300">/ bulan (ditabung mandiri)</span>
        </div>

        <div className="bg-white/10 p-3 rounded-xl border border-white/10">
          <span className="text-[11px] text-blue-200 block font-medium">Estimasi Bunga Dihemat</span>
          <div className="text-base sm:text-lg font-bold text-emerald-400 mt-0.5">
            {formatRupiah(bungaDihemat)}
          </div>
          <span className="text-[10px] text-emerald-300">Total extra: {formatRupiah(totalExtra)}</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/10">
        <p className="text-xs text-blue-200 leading-tight">
          *Dihitung melalui simulasi amortisasi bulanan iteratif non-linear presisi hingga mencapai target waktu {targetTenorTahun} tahun.
        </p>
        <button
          onClick={handleApply}
          className={`shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
            justApplied
              ? 'bg-emerald-500 text-white'
              : 'bg-amber-400 hover:bg-amber-300 text-slate-950 active:scale-95'
          }`}
        >
          {justApplied ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Diterapkan ke Simulator!</span>
            </>
          ) : (
            <>
              <span>Gunakan {formatRupiah(extraNeeded)}/thn ke Simulasi Utama</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
