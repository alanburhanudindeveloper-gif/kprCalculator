import React from 'react';
import { CalendarCheck, ShieldCheck, DollarSign, Sparkles, TrendingDown } from 'lucide-react';
import { SimulationMode, SimulationResult, KprParameters } from '../types/kpr';
import { formatRupiah, formatBulanTahun } from '../utils/calculator';

interface SummaryDashboardProps {
  mode: SimulationMode;
  params: KprParameters;
  baseline: SimulationResult;
  simulated: SimulationResult;
}

export const SummaryDashboard: React.FC<SummaryDashboardProps> = ({
  mode,
  params,
  baseline,
  simulated,
}) => {
  const pangkasBulan = Math.max(0, baseline.bulanLunas - simulated.bulanLunas);
  const hematBunga = Math.max(0, baseline.totalBunga - simulated.totalBunga);
  const hematKasBersih = Math.max(0, baseline.totalPengeluaran - simulated.totalPengeluaran);

  if (mode === 'A') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Tenor Baru */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Masa Tenor Baru</span>
              <CalendarCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tabular-nums">
              {formatBulanTahun(simulated.bulanLunas)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Lunas pada <strong className="text-slate-800 dark:text-slate-200">Bulan ke-{simulated.bulanLunas}</strong>
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex justify-between">
            <span>Tenor Awal:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">{params.tenorBulan / 12} Tahun</span>
          </div>
        </div>

        {/* Card 2: Pengurangan Tenor */}
        <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white p-4 sm:p-5 rounded-2xl shadow-xs border border-blue-600/30 dark:border-blue-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-blue-200 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Pangkas Tenor</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-300 tabular-nums">
              {pangkasBulan > 0 ? `${formatBulanTahun(pangkasBulan)}` : '0 Bulan'}
            </div>
            <p className="text-xs text-blue-100 mt-1">
              {pangkasBulan > 0 ? 'Lebih cepat bebas utang KPR' : `Sesuai tenor normal ${params.tenorBulan / 12} thn`}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-blue-600/50 text-[11px] text-blue-200 flex justify-between">
            <span>Total Pengurangan:</span>
            <span className="font-bold text-white tabular-nums">{pangkasBulan} Bulan</span>
          </div>
        </div>

        {/* Card 3: Bunga Dihemat */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-4 sm:p-5 rounded-2xl shadow-xs border border-emerald-500/30 dark:border-emerald-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-emerald-200 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Bunga Dihemat</span>
              <ShieldCheck className="w-4 h-4 text-emerald-200" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white tabular-nums">
              {formatRupiah(hematBunga)}
            </div>
            <p className="text-xs text-emerald-100 mt-1">
              Beban bunga bank yang batal dibayar
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-emerald-500/50 text-[11px] text-emerald-200 flex justify-between">
            <span>Sisa Bunga Dibayar:</span>
            <span className="font-bold text-white tabular-nums">{formatRupiah(simulated.totalBunga)}</span>
          </div>
        </div>

        {/* Card 4: Total Extra & Net Kas */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Extra Disetor</span>
              <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tabular-nums">
              {formatRupiah(simulated.totalExtra)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              100% dipotongkan ke pokok
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Net Hemat Kas:</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
              {hematKasBersih > 0 ? formatRupiah(hematKasBersih) : 'Rp0'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // MODE B: Recalculate Cicilan
  const turunCicilan = Math.max(0, simulated.cicilanAwal - simulated.cicilanAkhir);
  const turunPct = simulated.cicilanAwal > 0 ? (turunCicilan / simulated.cicilanAwal) * 100 : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      {/* Card 1: Cicilan Awal */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors">
        <div>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Cicilan Awal</span>
            <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            {formatRupiah(simulated.cicilanAwal)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Cicilan per bulan pada awal KPR</p>
        </div>
        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex justify-between">
          <span>Tenor Pinjaman:</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">Tetap {params.tenorBulan / 12} Tahun</span>
        </div>
      </div>

      {/* Card 2: Cicilan Terakhir */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white p-4 sm:p-5 rounded-2xl shadow-xs border border-blue-600/30 dark:border-blue-500/20 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-blue-200 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Cicilan Terakhir</span>
            <TrendingDown className="w-4 h-4 text-emerald-300" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white tabular-nums">
            {formatRupiah(simulated.cicilanAkhir)}
          </div>
          <p className="text-xs text-blue-100 mt-1">Setelah akumulasi extra pokok</p>
        </div>
        <div className="mt-3 pt-2 border-t border-blue-600/50 text-[11px] text-blue-200 flex justify-between">
          <span>Penurunan Cicilan:</span>
          <span className="font-bold text-amber-300 tabular-nums">
            -{formatRupiah(turunCicilan)} ({turunPct.toFixed(1)}%)
          </span>
        </div>
      </div>

      {/* Card 3: Bunga Dihemat */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-4 sm:p-5 rounded-2xl shadow-xs border border-emerald-500/30 dark:border-emerald-500/20 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-emerald-200 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Bunga Dihemat</span>
            <ShieldCheck className="w-4 h-4 text-emerald-200" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white tabular-nums">
            {formatRupiah(hematBunga)}
          </div>
          <p className="text-xs text-emerald-100 mt-1">Hemat beban bunga kumulatif</p>
        </div>
        <div className="mt-3 pt-2 border-t border-emerald-500/50 text-[11px] text-emerald-200 flex justify-between">
          <span>Total Bunga Baru:</span>
          <span className="font-bold text-white tabular-nums">{formatRupiah(simulated.totalBunga)}</span>
        </div>
      </div>

      {/* Card 4: Total Extra Disetor */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors">
        <div>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Extra Disetor</span>
            <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            {formatRupiah(simulated.totalExtra)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Total setoran pokok ekstra</p>
        </div>
        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Net Hemat Kas:</span>
          <span className="font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">{formatRupiah(hematKasBersih)}</span>
        </div>
      </div>
    </div>
  );
};
