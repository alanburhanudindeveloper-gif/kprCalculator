import React, { useState } from 'react';
import {
  CalendarRange,
  Clock,
  TrendingDown,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { KprParameters, SimulationMode, PaymentInterval, SimulationResult } from '../../types/kpr';
import { formatRupiah, runAmortizationSimulation } from '../../utils/calculator';

interface FlexibleYearlyScheduleCardProps {
  kprParams: KprParameters;
  interval: PaymentInterval;
  mode: SimulationMode;
  baseline: SimulationResult;
  onApplyFlexibleSchedule?: (schedule: Record<number, number>) => void;
}

export const FlexibleYearlyScheduleCard: React.FC<FlexibleYearlyScheduleCardProps> = ({
  kprParams,
  interval,
  mode,
  baseline,
}) => {
  // Bawaan default: 5 tahun pertama dengan nominal variatif
  const [schedule, setSchedule] = useState<Record<number, number>>({
    1: 30_000_000,
    2: 50_000_000,
    3: 20_000_000,
    4: 0, // Misal: anak masuk sekolah / renovasi
    5: 60_000_000,
  });

  const [notes, setNotes] = useState<Record<number, string>>({
    1: 'Bonus awal kerja / tabungan',
    2: 'Rezeki proyek sampingan lancar',
    3: 'Extra moderat',
    4: 'Pengeluaran anak masuk sekolah (Jeda Rp0)',
    5: 'Kenaikan karir & surplus besar',
  });

  const years = [1, 2, 3, 4, 5, 6, 7];

  const updateYearExtra = (year: number, amount: number) => {
    setSchedule((prev) => ({ ...prev, [year]: Math.max(0, amount) }));
  };

  const updateYearNote = (year: number, text: string) => {
    setNotes((prev) => ({ ...prev, [year]: text }));
  };

  const resetDefaultSchedule = () => {
    setSchedule({
      1: 30_000_000,
      2: 50_000_000,
      3: 20_000_000,
      4: 0,
      5: 60_000_000,
    });
  };

  // Jalankan simulasi aktuaria dengan customAnnualSchedule!
  const flexSim = runAmortizationSimulation(kprParams, 0, interval, mode, schedule);

  const diffBulan = Math.max(0, baseline.bulanLunas - flexSim.bulanLunas);
  const hematBunga = Math.max(0, baseline.totalBunga - flexSim.totalBunga);
  const totalExtraDisetor = flexSim.totalExtra;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarRange className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Skenario Fleksibel: Extra Payment Berbeda Tiap Tahun</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Anda tidak wajib membayar nominal ekstra yang sama setiap tahun. Sesuaikan dengan naik-turun kondisi riil hidup Anda.
          </p>
        </div>

        <button
          type="button"
          onClick={resetDefaultSchedule}
          className="self-start sm:self-auto px-2.5 py-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Contoh</span>
        </button>
      </div>

      {/* Educational Banner */}
      <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl border border-blue-200/60 dark:border-blue-900/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2.5">
        <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div>
          <strong>Fleksibilitas adalah Kunci:</strong> Jika tahun ini keuangan sedang bagus, Anda bisa membayar ekstra lebih banyak. Namun jika ada kebutuhan besar (biaya sekolah, renovasi, atau kelahiran anak), Anda bebas menghentikan sementara (Rp0) tanpa merusak akad pokok pinjaman.
        </div>
      </div>

      {/* Table Editor */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              <th className="py-2.5 px-3 font-semibold">Tahun ke-</th>
              <th className="py-2.5 px-3 font-semibold">Nominal Extra Payment</th>
              <th className="py-2.5 px-3 font-semibold">Rencana Kebutuhan / Catatan Hidup</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {years.map((y) => {
              const val = schedule[y] ?? 0;
              const note = notes[y] ?? '';

              return (
                <tr key={y} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-bold text-slate-800 dark:text-white">
                    Tahun {y}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="relative w-44">
                      <span className="absolute left-2.5 top-2 text-slate-400 font-semibold text-xs">Rp</span>
                      <input
                        type="number"
                        step="5000000"
                        value={val}
                        onChange={(e) => updateYearExtra(y, Number(e.target.value))}
                        className={`w-full pl-8 pr-2 py-1.5 bg-white dark:bg-slate-900 border rounded-lg text-xs font-bold focus:outline-none focus:border-blue-500 ${
                          val === 0
                            ? 'text-slate-400 border-slate-200 dark:border-slate-800'
                            : 'text-slate-900 dark:text-white border-slate-300 dark:border-slate-700'
                        }`}
                      />
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <input
                      type="text"
                      placeholder="Contoh: Ada bonus proyek / Jeda biaya sekolah"
                      value={note}
                      onChange={(e) => updateYearNote(y, e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Amortization Outcome Cards */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Hasil Perhitungan Amortisasi Jadwal Fleksibel:
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>Tenor Berkurang Menjadi</span>
            </span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white mt-1 block">
              {(flexSim.bulanLunas / 12).toFixed(1)} Tahun ({flexSim.bulanLunas} Bulan)
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 block">
              {diffBulan > 0 ? `Lebih cepat ${diffBulan} bulan (${(diffBulan / 12).toFixed(1)} thn)` : 'Sesuai tenor normal'}
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />
              <span>Total Bunga Dihemat</span>
            </span>
            <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">
              {formatRupiah(hematBunga)}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Dari selisih bunga anuitas
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
              Total Extra Disetor
            </span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white mt-1 block">
              {formatRupiah(totalExtraDisetor)}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Akumulasi pembayaran pokok
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
