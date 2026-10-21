import React from 'react';
import { Clock3, Database, Cloud, RotateCcw } from 'lucide-react';
import { SimulationHistoryEntry } from '../services/localDb';
import { formatRupiah } from '../utils/calculator';

interface SimulationHistoryPanelProps {
  entries: SimulationHistoryEntry[];
  onRestore: (entry: SimulationHistoryEntry) => void;
  onSaveCurrent: () => void;
  cloudEnabled: boolean;
}

const formatDate = (value: number) => new Date(value).toLocaleString('id-ID', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export const SimulationHistoryPanel: React.FC<SimulationHistoryPanelProps> = ({
  entries,
  onRestore,
  onSaveCurrent,
  cloudEnabled,
}) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
            Riwayat Simulasi
          </p>
          <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">
            Simpan & restore data KPR
          </h3>
        </div>

        <button
          type="button"
          onClick={onSaveCurrent}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0060af] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#005296]"
        >
          <Database className="h-4 w-4" />
          Simpan simulasi saat ini
        </button>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        {cloudEnabled ? (
          <>
            <Cloud className="h-3.5 w-3.5 text-emerald-500" />
            <span>Cloud sync aktif via Supabase</span>
          </>
        ) : (
          <>
            <Database className="h-3.5 w-3.5 text-amber-500" />
            <span>Mode lokal hanya (browser storage)</span>
          </>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
          Belum ada riwayat simulasi. Klik tombol di atas untuk menyimpan konfigurasi saat ini.
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.id ?? `${entry.savedAt}-${entry.extraAnnual}-${entry.mode}`}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/60 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1 text-sm text-slate-700 dark:text-slate-200">
                <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
                  <Clock3 className="h-4 w-4 text-blue-500" />
                  <span>{entry.mode} · {formatRupiah(entry.extraAnnual)}/tahun</span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {formatDate(entry.savedAt)} · {entry.interval}x bayar/tahun
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Plafon {formatRupiah(entry.params.plafon)} · Tenor {entry.params.tenorBulan} bulan
                </div>
              </div>

              <button
                type="button"
                onClick={() => onRestore(entry)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:text-blue-300"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Restore data
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
