import React from 'react';
import { SimulationResult, KprParameters, SimulationMode } from '../types/kpr';
import { formatRupiah, formatBulanTahun } from '../utils/calculator';

interface ComparisonTableProps {
  mode: SimulationMode;
  params: KprParameters;
  baseline: SimulationResult;
  simulated: SimulationResult;
  extraAnnual: number;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  mode,
  params,
  baseline,
  simulated,
  extraAnnual,
}) => {
  const diffBulan = Math.max(0, baseline.bulanLunas - simulated.bulanLunas);
  const hematBunga = Math.max(0, baseline.totalBunga - simulated.totalBunga);
  const netKeluarDiff = Math.max(0, baseline.totalPengeluaran - simulated.totalPengeluaran);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            Ringkasan Perbandingan: Tanpa Extra vs Dengan Extra
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {mode === 'A'
              ? 'Evaluasi percepatan pelunasan dan efisiensi biaya kredit KPR Anda'
              : 'Evaluasi dampak penurunan cicilan bulanan dengan mempertahankan tenor'}
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 rounded-lg self-start sm:self-auto">
          {diffBulan > 0
            ? `Pangkas ${formatBulanTahun(diffBulan)}`
            : hematBunga > 0
            ? `Hemat Bunga ${formatRupiah(hematBunga)}`
            : 'Baseline SP3K Normal'}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="py-2.5 px-3">Parameter Analisis</th>
              <th className="py-2.5 px-3">Tanpa Extra (Baseline SP3K)</th>
              <th className="py-2.5 px-3 bg-blue-50/70 dark:bg-blue-950/50 text-blue-900 dark:text-blue-300 font-extrabold">
                Dengan Extra Payment ({formatRupiah(extraAnnual)}/thn)
              </th>
              <th className="py-2.5 px-3 text-emerald-700 dark:text-emerald-400 font-extrabold">
                Selisih / Penghematan
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium tabular-nums">
            <tr>
              <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">Masa Pinjaman (Tenor)</td>
              <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                {params.tenorBulan / 12} Tahun ({params.tenorBulan} Bulan)
              </td>
              <td className="py-2.5 px-3 bg-blue-50/30 dark:bg-blue-950/30 text-blue-950 dark:text-blue-200 font-bold">
                {formatBulanTahun(simulated.bulanLunas)} ({simulated.bulanLunas} Bulan)
              </td>
              <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">
                {diffBulan > 0 ? `Lebih Cepat ${formatBulanTahun(diffBulan)}` : `Sama (${params.tenorBulan / 12} Tahun)`}
              </td>
            </tr>

            <tr>
              <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">Total Bunga Dibayar</td>
              <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{formatRupiah(baseline.totalBunga)}</td>
              <td className="py-2.5 px-3 bg-blue-50/30 dark:bg-blue-950/30 text-blue-950 dark:text-blue-200 font-bold">
                {formatRupiah(simulated.totalBunga)}
              </td>
              <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">
                {hematBunga > 0 ? `Hemat ${formatRupiah(hematBunga)}` : 'Rp0'}
              </td>
            </tr>

            <tr>
              <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">Total Pembayaran Pokok</td>
              <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{formatRupiah(params.plafon)}</td>
              <td className="py-2.5 px-3 bg-blue-50/30 dark:bg-blue-950/30 text-blue-950 dark:text-blue-200 font-bold">
                {formatRupiah(params.plafon)}
              </td>
              <td className="py-2.5 px-3 text-slate-400 dark:text-slate-500">Tetap (Sesuai Plafon Pinjaman)</td>
            </tr>

            <tr>
              <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">Total Extra Pokok Disetor</td>
              <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">Rp0</td>
              <td className="py-2.5 px-3 bg-blue-50/30 dark:bg-blue-950/30 text-blue-950 dark:text-blue-200 font-bold">
                {formatRupiah(simulated.totalExtra)}
              </td>
              <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">+{formatRupiah(simulated.totalExtra)}</td>
            </tr>

            {mode === 'B' && (
              <tr>
                <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">Cicilan Bulanan Terakhir</td>
                <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{formatRupiah(baseline.cicilanAkhir)}</td>
                <td className="py-2.5 px-3 bg-blue-50/30 dark:bg-blue-950/30 text-blue-950 dark:text-blue-200 font-bold">
                  {formatRupiah(simulated.cicilanAkhir)}
                </td>
                <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">
                  Turun {formatRupiah(baseline.cicilanAkhir - simulated.cicilanAkhir)}/bln
                </td>
              </tr>
            )}

            <tr className="bg-slate-50/70 dark:bg-slate-800/60 font-bold text-slate-800 dark:text-white">
              <td className="py-3 px-3">Total Seluruh Pengeluaran Kas (Pokok + Bunga + Extra)</td>
              <td className="py-3 px-3">{formatRupiah(baseline.totalPengeluaran)}</td>
              <td className="py-3 px-3 bg-blue-100/60 dark:bg-blue-900/40 text-blue-950 dark:text-blue-200 font-black">
                {formatRupiah(simulated.totalPengeluaran)}
              </td>
              <td className="py-3 px-3 text-emerald-700 dark:text-emerald-400 font-black">
                {netKeluarDiff > 0 ? `Net Penghematan Bersih ${formatRupiah(netKeluarDiff)}` : 'Rp0'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
