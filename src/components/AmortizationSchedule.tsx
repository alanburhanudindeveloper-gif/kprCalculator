import React, { useState, useId } from 'react';
import { ChevronDown, Download, Filter, Calendar, FileDown } from 'lucide-react';
import { AmortizationRow } from '../types/kpr';
import { formatRupiah } from '../utils/calculator';

interface AmortizationScheduleProps {
  schedule: AmortizationRow[];
  totalMonths: number;
  onExportPdf?: () => void;
}

export const AmortizationSchedule: React.FC<AmortizationScheduleProps> = ({
  schedule,
  totalMonths,
  onExportPdf,
}) => {
  const filterYearId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>('ALL');

  const maxYear = Math.ceil(totalMonths / 12);
  const yearOptions: number[] = [];
  for (let y = 1; y <= maxYear; y++) {
    yearOptions.push(y);
  }

  const filteredSchedule = schedule.filter((row) => {
    if (selectedYear === 'ALL') return true;
    return row.tahun === Number(selectedYear);
  });

  const exportToCSV = () => {
    const headers = [
      'Bulan',
      'Tahun',
      'Periode',
      'Suku Bunga (%)',
      'Saldo Awal (Rp)',
      'Cicilan Bulanan (Rp)',
      'Bunga (Rp)',
      'Pokok dari Cicilan (Rp)',
      'Extra Payment (Rp)',
      'Total Pokok Dibayar (Rp)',
      'Saldo Akhir (Rp)',
    ];

    const rows = schedule.map((r) => [
      r.bulan,
      r.tahun,
      `"${r.periodeNama}"`,
      r.sukuBungaPersen,
      Math.round(r.saldoAwal),
      Math.round(r.cicilanBulanan),
      Math.round(r.bungaBulan),
      Math.round(r.pokokBulan),
      Math.round(r.extraPayment),
      Math.round(r.totalPokokBayar),
      Math.round(r.saldoAkhir),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Amortisasi_KPR_SP3K_BCA_${schedule.length}_Bulan.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Tabel Amortisasi Bulanan Presisi</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Detail perhitungan matematis bulan demi bulan hingga saldo mencapai Rp0 ({schedule.length} bulan)
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onExportPdf && (
            <button
              onClick={onExportPdf}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 rounded-xl transition shadow-xs"
              title="Download Dokumen Hasil Simulasi dalam Format PDF"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>
          )}

          {isOpen && (
            <button
              onClick={exportToCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 text-slate-700 dark:text-slate-300 rounded-xl transition"
              title="Download Jadwal Amortisasi ke Excel / CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold bg-[#0060af] dark:bg-blue-600 hover:bg-[#004c8c] dark:hover:bg-blue-500 active:scale-95 text-white rounded-xl shadow-xs transition"
          >
            <span>{isOpen ? 'Tutup Tabel Amortisasi' : 'Lihat Amortisasi Lengkap'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* Controls & Legend */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl text-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <label htmlFor={filterYearId} className="font-semibold text-slate-700 dark:text-slate-300">Filter Tampilan:</label>
              <select
                id={filterYearId}
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-600"
              >
                <option value="ALL">Semua Bulan (Bulan 1 s/d {schedule.length})</option>
                {yearOptions.map((y) => (
                  <option key={y} value={y.toString()}>
                    Tahun ke-{y} (Bln {(y - 1) * 12 + 1} - {Math.min(y * 12, schedule.length)})
                  </option>
                ))}
              </select>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-slate-600 dark:text-slate-400">
              <span className="inline-flex items-center gap-1 font-medium">
                <span className="w-2.5 h-2.5 rounded bg-emerald-100 dark:bg-emerald-950 border border-emerald-400"></span>
                <span>Extra Payment</span>
              </span>
              <span className="inline-flex items-center gap-1 font-medium">
                <span className="w-2.5 h-2.5 rounded bg-amber-100 dark:bg-amber-950 border border-amber-400"></span>
                <span>Milestone Bunga (Bln 36/72)</span>
              </span>
              <span className="inline-flex items-center gap-1 font-medium">
                <span className="w-2.5 h-2.5 rounded bg-purple-100 dark:bg-purple-950 border border-purple-400"></span>
                <span>Bulan Pelunasan</span>
              </span>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto max-h-[480px] overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl custom-scrollbar">
            <table className="w-full text-[11px] sm:text-xs text-left border-collapse">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 sticky top-0 z-10 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-2.5 px-2.5 text-center">Bln</th>
                  <th className="py-2.5 px-2">Thn</th>
                  <th className="py-2.5 px-2">Periode</th>
                  <th className="py-2.5 px-2">Bunga</th>
                  <th className="py-2.5 px-2.5">Saldo Awal</th>
                  <th className="py-2.5 px-2.5">Cicilan</th>
                  <th className="py-2.5 px-2.5 text-rose-600 dark:text-rose-400">Bunga</th>
                  <th className="py-2.5 px-2.5 text-blue-700 dark:text-blue-400">Pokok</th>
                  <th className="py-2.5 px-2.5 text-emerald-700 dark:text-emerald-400 font-extrabold">Extra Pokok</th>
                  <th className="py-2.5 px-2.5 font-bold text-slate-900 dark:text-white">Total Pokok</th>
                  <th className="py-2.5 px-2.5">Saldo Akhir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium tabular-nums">
                {filteredSchedule.map((row) => {
                  let rowStyle = 'hover:bg-slate-50 dark:hover:bg-slate-800/50';
                  if (row.isPelunasan) {
                    rowStyle = 'bg-purple-50/90 dark:bg-purple-950/40 font-bold text-purple-950 dark:text-purple-200';
                  } else if (row.isExtraMonth) {
                    rowStyle = 'bg-emerald-50/80 dark:bg-emerald-950/40 font-semibold';
                  } else if (row.isMilestone) {
                    rowStyle = 'bg-amber-50/70 dark:bg-amber-950/40';
                  }

                  return (
                    <tr key={row.bulan} className={`transition-colors ${rowStyle}`}>
                      <td className="py-2 px-2.5 text-center text-slate-700 dark:text-slate-300 font-bold">
                        {row.bulan}
                      </td>
                      <td className="py-2 px-2 text-slate-500 dark:text-slate-400">
                        Thn {row.tahun}
                      </td>
                      <td className="py-2 px-2">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                          {row.periodeNama}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                        {row.sukuBungaPersen}%
                      </td>
                      <td className="py-2 px-2.5 text-slate-700 dark:text-slate-300">
                        {formatRupiah(row.saldoAwal)}
                      </td>
                      <td className="py-2 px-2.5 text-slate-800 dark:text-white font-semibold">
                        {formatRupiah(row.cicilanBulanan)}
                      </td>
                      <td className="py-2 px-2.5 text-rose-600 dark:text-rose-400">
                        {formatRupiah(row.bungaBulan)}
                      </td>
                      <td className="py-2 px-2.5 text-blue-700 dark:text-blue-400">
                        {formatRupiah(row.pokokBulan)}
                      </td>
                      <td className="py-2 px-2.5 text-emerald-700 dark:text-emerald-400 font-extrabold">
                        {row.extraPayment > 0 ? formatRupiah(row.extraPayment) : '-'}
                      </td>
                      <td className="py-2 px-2.5 font-bold text-slate-900 dark:text-white">
                        {formatRupiah(row.totalPokokBayar)}
                      </td>
                      <td
                        className={`py-2 px-2.5 font-bold ${
                          row.saldoAkhir <= 0
                            ? 'text-purple-700 dark:text-purple-400 font-black'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {formatRupiah(row.saldoAkhir)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
