import React, { useState } from 'react';
import { Calculator, ArrowRight, HelpCircle, CheckCircle, SplitSquareVertical } from 'lucide-react';
import { KprParameters, SimulationMode, PaymentInterval } from '../types/kpr';
import { formatRupiah, runAmortizationSimulation } from '../utils/calculator';

interface MonthlyBreakdownExplainerProps {
  params: KprParameters;
  extraAnnual: number;
  interval: PaymentInterval;
  activeMode: SimulationMode;
  onSelectMode: (mode: SimulationMode) => void;
  onOpenRefinancingGuide?: () => void;
}

export const MonthlyBreakdownExplainer: React.FC<MonthlyBreakdownExplainerProps> = ({
  params,
  extraAnnual,
  interval,
  activeMode,
  onSelectMode,
  onOpenRefinancingGuide,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(13); // Default bulan ke-13 (tepat setelah extra payment pertama di bulan ke-12)

  // Jalankan simulasi untuk kedua mode agar bisa dibandingkan secara berdampingan
  const simModeA = runAmortizationSimulation(params, extraAnnual, interval, 'A');
  const simModeB = runAmortizationSimulation(params, extraAnnual, interval, 'B');
  const baseline = runAmortizationSimulation(params, 0, 12, 'A');

  const rowA = simModeA.schedule.find((r) => r.bulan === selectedMonth) ?? simModeA.schedule[simModeA.schedule.length - 1];
  const rowB = simModeB.schedule.find((r) => r.bulan === selectedMonth) ?? simModeB.schedule[simModeB.schedule.length - 1];
  const rowBase = baseline.schedule.find((r) => r.bulan === selectedMonth) ?? baseline.schedule[baseline.schedule.length - 1];

  // Hitung persentase porsi pokok vs bunga pada bulan terpilih
  const totalCicilanA = rowA ? rowA.cicilanBulanan : 1;
  const porsiBungaPctA = rowA ? ((rowA.bungaBulan / totalCicilanA) * 100).toFixed(1) : '0';
  const porsiPokokPctA = rowA ? ((rowA.pokokBulan / totalCicilanA) * 100).toFixed(1) : '0';

  const totalCicilanB = rowB ? rowB.cicilanBulanan : 1;
  const porsiBungaPctB = rowB ? ((rowB.bungaBulan / totalCicilanB) * 100).toFixed(1) : '0';
  const porsiPokokPctB = rowB ? ((rowB.pokokBulan / totalCicilanB) * 100).toFixed(1) : '0';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs transition-colors space-y-5">
      {/* Header Penjelasan Konsep */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <Calculator className="w-4 h-4" />
            <span>Konsep Finansial: Cara Kerja Pengurangan Pokok & Bunga</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white mt-0.5">
            "Setelah Pokok Berkurang, Mengapa Cicilan Bisa Berkurang atau Tenor Pangkas?"
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Ya, benar sekali! 100% extra payment digunakan untuk memotong <strong>sisa pokok utang</strong>. Setelah pokok berkurang, beban bunga otomatis ikut turun.
          </p>
        </div>

        <div className="flex items-center gap-1.5 self-start md:self-auto bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => onSelectMode('A')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeMode === 'A'
                ? 'bg-[#0060af] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Pangkas Tenor
          </button>
          <button
            onClick={() => onSelectMode('B')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeMode === 'B'
                ? 'bg-[#0060af] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Turunkan Cicilan
          </button>
        </div>
      </div>

      {/* 3 Rumus Inti Perbankan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3.5 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-200/60 dark:border-blue-900/40 space-y-1">
          <span className="font-bold text-blue-900 dark:text-blue-300 block">1. Rumus Bunga Bulanan</span>
          <div className="font-mono text-slate-700 dark:text-slate-300 font-bold text-[11px] bg-white dark:bg-slate-900 p-2 rounded-lg border border-blue-100 dark:border-slate-800">
            Bunga = Saldo Pokok × (Rate / 12)
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            Karena saldo pokok dipotong extra payment, maka nominal bunga bulan berikutnya <strong>otomatis langsung mengecil</strong>.
          </p>
        </div>

        <div className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/60 dark:border-emerald-900/40 space-y-1">
          <span className="font-bold text-emerald-900 dark:text-emerald-300 block">2. Rumus Pokok Bulanan</span>
          <div className="font-mono text-slate-700 dark:text-slate-300 font-bold text-[11px] bg-white dark:bg-slate-900 p-2 rounded-lg border border-emerald-100 dark:border-slate-800">
            Pokok Cicilan = Angsuran - Bunga
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            Jika angsuran tetap (Mode A), bunga yang mengecil membuat <strong>porsi pokok melonjak tajam</strong>, mempercepat lunas.
          </p>
        </div>

        <div className="p-3.5 bg-purple-50/60 dark:bg-purple-950/30 rounded-xl border border-purple-200/60 dark:border-purple-900/40 space-y-1">
          <span className="font-bold text-purple-900 dark:text-purple-300 block">3. Rumus Recalculate (Mode B)</span>
          <div className="font-mono text-slate-700 dark:text-slate-300 font-bold text-[11px] bg-white dark:bg-slate-900 p-2 rounded-lg border border-purple-100 dark:border-slate-800">
            Cicilan Baru = PMT(Rate/12, Sisa Bulan, Saldo)
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            Jika memilih menurunkan cicilan, bank menghitung ulang angsuran agar <strong>tagihan tiap bulan menjadi lebih enteng</strong>.
          </p>
        </div>
      </div>

      {/* Interactive Inspector: Cek Porsi Pokok & Bunga Pada Bulan Tertentu */}
      <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              Pilih Bulan untuk Melihat Rincian Porsi Pokok & Bunga:
            </span>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-bold ml-2">
              Bulan ke-{selectedMonth} (Tahun ke-{Math.ceil(selectedMonth / 12)})
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSelectedMonth(1)}
              className="text-[11px] font-semibold px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
            >
              Bln 1 (Awal)
            </button>
            <button
              onClick={() => setSelectedMonth(13)}
              className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-200"
            >
              Bln 13 (Pasca Extra 1)
            </button>
            <button
              onClick={() => setSelectedMonth(37)}
              className="text-[11px] font-semibold px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
            >
              Bln 37 (Rate 6,99%)
            </button>
            <button
              onClick={() => setSelectedMonth(73)}
              className="text-[11px] font-semibold px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
            >
              Bln 73 (Rate 8,99%)
            </button>
          </div>
        </div>

        {/* Range Slider for Month */}
        <input
          type="range"
          min={1}
          max={Math.min(params.tenorBulan, Math.max(simModeA.bulanLunas, 120))}
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer accent-[#0060af]"
        />

        {/* Comparison: Apa yang terjadi di Bulan ke-X */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Box 1: Mode A (Pangkas Tenor) */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              activeMode === 'A'
                ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-400 dark:border-blue-600 ring-2 ring-blue-500/20'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                <SplitSquareVertical className="w-3.5 h-3.5 text-blue-600" />
                <span>OPSI A: Cicilan Tetap (Pangkas Tenor)</span>
              </span>
              {activeMode === 'A' && (
                <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                  Mode Sedang Aktif
                </span>
              )}
            </div>

            {rowA ? (
              <div className="space-y-2.5 text-xs tabular-nums">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Sisa Saldo Pokok Awal:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {formatRupiah(rowA.saldoAwal)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Suku Bunga Periode Ini:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                    {rowA.sukuBungaPersen}% p.a.
                  </span>
                </div>
                <div className="flex justify-between text-slate-800 dark:text-slate-100 font-bold border-t border-slate-200 dark:border-slate-700/60 pt-2">
                  <span>Cicilan Bulanan (Tetap):</span>
                  <span className="text-sm font-extrabold text-blue-700 dark:text-blue-400">
                    {formatRupiah(rowA.cicilanBulanan)}
                  </span>
                </div>

                {/* Progress Bar Pokok vs Bunga */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                      Pokok: {formatRupiah(rowA.pokokBulan)} ({porsiPokokPctA}%)
                    </span>
                    <span className="text-rose-600 dark:text-rose-400 font-bold">
                      Bunga: {formatRupiah(rowA.bungaBulan)} ({porsiBungaPctA}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-rose-200 dark:bg-rose-950/80 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${porsiPokokPctA}%` }}
                      className="bg-emerald-500 h-full transition-all"
                      title={`Pokok: ${porsiPokokPctA}%`}
                    />
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  <strong>Dampak:</strong> Cicilan tetap, porsi pokok membesar &rarr;{' '}
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    KPR lunas di bulan ke-{simModeA.bulanLunas} ({formatRupiah(simModeA.totalBunga)} total bunga)
                  </span>.
                </div>
              </div>
            ) : (
              <div className="text-xs text-purple-600 font-bold py-4 text-center">
                KPR sudah lunas sebelum bulan ini!
              </div>
            )}
          </div>

          {/* Box 2: Mode B (Recalculate / Turunkan Cicilan) */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              activeMode === 'B'
                ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-400 dark:border-blue-600 ring-2 ring-blue-500/20'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                <SplitSquareVertical className="w-3.5 h-3.5 text-emerald-600" />
                <span>OPSI B: Turunkan Cicilan (Tenor Tetap)</span>
              </span>
              {activeMode === 'B' && (
                <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                  Mode Sedang Aktif
                </span>
              )}
            </div>

            {rowB && (
              <div className="space-y-2.5 text-xs tabular-nums">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Sisa Saldo Pokok Awal:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {formatRupiah(rowB.saldoAwal)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Suku Bunga Periode Ini:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                    {rowB.sukuBungaPersen}% p.a.
                  </span>
                </div>
                <div className="flex justify-between text-slate-800 dark:text-slate-100 font-bold border-t border-slate-200 dark:border-slate-700/60 pt-2">
                  <span>Cicilan Baru Setelah Recalculate:</span>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400">
                      {formatRupiah(rowB.cicilanBulanan)}
                    </span>
                    {rowBase && rowBase.cicilanBulanan > rowB.cicilanBulanan && (
                      <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">
                        Turun -{formatRupiah(rowBase.cicilanBulanan - rowB.cicilanBulanan)}/bln
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar Pokok vs Bunga */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                      Pokok: {formatRupiah(rowB.pokokBulan)} ({porsiPokokPctB}%)
                    </span>
                    <span className="text-rose-600 dark:text-rose-400 font-bold">
                      Bunga: {formatRupiah(rowB.bungaBulan)} ({porsiBungaPctB}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-rose-200 dark:bg-rose-950/80 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${porsiPokokPctB}%` }}
                      className="bg-emerald-500 h-full transition-all"
                      title={`Pokok: ${porsiPokokPctB}%`}
                    />
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  <strong>Dampak:</strong> Cicilan bulanan berkurang jadi lebih ringan, tenor tetap{' '}
                  <span className="text-blue-600 dark:text-blue-400 font-bold">
                    240 bulan ({params.tenorBulan / 12} tahun)
                  </span>.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Refinancing vs Extra Payment Educational Callout */}
      {onOpenRefinancingGuide && (
        <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl border border-amber-200/80 dark:border-amber-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="font-bold text-amber-950 dark:text-amber-300 block">
              💡 Apakah suku bunga tetap sama jika melakukan Refinancing / Take Over?
            </span>
            <p className="text-[11px] text-amber-900/90 dark:text-amber-200/80 leading-relaxed">
              Jika setor extra di BCA, <strong>rate SP3K tetap berlaku</strong>. Namun jika refinancing ke bank lain, rate lama akan hangus dan kena penalti/biaya baru.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenRefinancingGuide}
            className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs transition shadow-xs"
          >
            <span>Buka Panduan Refinancing</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
