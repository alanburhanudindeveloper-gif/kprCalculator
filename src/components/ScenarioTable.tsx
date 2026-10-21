import React from 'react';
import { Table, Check } from 'lucide-react';
import { ScenarioItem } from '../types/kpr';
import { formatRupiah, formatBulanTahun } from '../utils/calculator';

interface ScenarioTableProps {
  scenarios: ScenarioItem[];
  currentExtraAnnual: number;
  onSelectExtra: (amount: number) => void;
}

export const ScenarioTable: React.FC<ScenarioTableProps> = ({
  scenarios,
  currentExtraAnnual,
  onSelectExtra,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Table className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Tabel Skenario Otomatis Extra Payment</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Dampak penambahan cicilan pokok per tahun terhadap tenor dan penghematan bunga bank
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="py-2.5 px-3">Extra Pokok / Tahun</th>
              <th className="py-2.5 px-3">Tenor Aktual</th>
              <th className="py-2.5 px-3">Lebih Cepat</th>
              <th className="py-2.5 px-3">Total Bunga</th>
              <th className="py-2.5 px-3 text-emerald-700 dark:text-emerald-400 font-extrabold">Hemat Bunga</th>
              <th className="py-2.5 px-3 text-center">Terapkan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium tabular-nums">
            {scenarios.map((item) => {
              const isSelected = item.extraAnnual === currentExtraAnnual;
              return (
                <tr
                  key={item.extraAnnual}
                  className={`transition-colors ${
                    isSelected
                      ? 'bg-blue-50/70 dark:bg-blue-950/50 font-semibold'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                    {formatRupiah(item.extraAnnual)}
                    {item.extraAnnual === 0 && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal ml-1">
                        (Baseline)
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                    {formatBulanTahun(item.bulanLunas)} ({item.bulanLunas} bln)
                  </td>
                  <td
                    className={`py-2.5 px-3 font-bold ${
                      item.penguranganBulan > 0
                        ? 'text-blue-700 dark:text-blue-400'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {item.penguranganBulan > 0
                      ? formatBulanTahun(item.penguranganBulan)
                      : '-'}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                    {formatRupiah(item.totalBunga)}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-emerald-700 dark:text-emerald-400">
                    {item.hematBunga > 0 ? formatRupiah(item.hematBunga) : '-'}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => onSelectExtra(item.extraAnnual)}
                      className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 active:scale-95'
                      }`}
                    >
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1">
                          <Check className="w-3 h-3" /> Aktif
                        </span>
                      ) : (
                        'Pilih'
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
