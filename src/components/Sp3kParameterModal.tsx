import React from 'react';
import { X, RotateCcw, Check, SlidersHorizontal, Sun, Moon } from 'lucide-react';
import { KprParameters } from '../types/kpr';
import { DEFAULT_SP3K_PARAMS, formatRupiah } from '../utils/calculator';

interface Sp3kParameterModalProps {
  isOpen: boolean;
  params: KprParameters;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onClose: () => void;
  onSave: (newParams: KprParameters) => void;
  onReset: () => void;
}

export const Sp3kParameterModal: React.FC<Sp3kParameterModalProps> = ({
  isOpen,
  params,
  isDarkMode,
  onToggleDarkMode,
  onClose,
  onSave,
  onReset,
}) => {
  const [formData, setFormData] = React.useState<KprParameters>(params);

  React.useEffect(() => {
    setFormData(params);
  }, [params, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden my-8 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                Pengaturan Parameter SP3K BCA
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ubah plafon kredit, durasi tenor, suku bunga berjenjang, dan tema tampilan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Theme Option in Settings */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center shadow-xs text-slate-700 dark:text-slate-200">
                {isDarkMode ? <Moon className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-white block">
                  Tema Tampilan Aplikasi
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isDarkMode ? 'Saat ini aktif: Mode Gelap (Dark Mode)' : 'Saat ini aktif: Mode Terang (Light Mode)'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onToggleDarkMode}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                isDarkMode
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
              }`}
            >
              {isDarkMode ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
            </button>
          </div>

          {/* Main Loan Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Plafon Kredit (Rupiah)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-bold text-xs">
                  Rp
                </span>
                <input
                  type="number"
                  value={formData.plafon}
                  onChange={(e) =>
                    setFormData({ ...formData, plafon: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full pl-9 pr-3 py-2 text-sm font-bold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl focus:border-blue-600 focus:outline-none"
                />
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                {formatRupiah(formData.plafon)}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tenor Awal Pinjaman (Bulan)
              </label>
              <input
                type="number"
                value={formData.tenorBulan}
                onChange={(e) =>
                  setFormData({ ...formData, tenorBulan: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 text-sm font-bold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl focus:border-blue-600 focus:outline-none"
              />
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                Setara {(formData.tenorBulan / 12).toFixed(1)} Tahun
              </span>
            </div>
          </div>

          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            Struktur 3 Periode Suku Bunga SP3K BCA
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Periode 1 */}
            <div className="p-3.5 bg-blue-50/50 dark:bg-slate-800/60 rounded-xl border border-blue-200/60 dark:border-slate-700 space-y-2">
              <span className="text-xs font-bold text-blue-800 dark:text-blue-400 block">
                Periode 1 (Bulan 1–36)
              </span>
              <div>
                <label className="text-[11px] text-slate-600 dark:text-slate-400 font-medium block mb-0.5">
                  Durasi (Bulan)
                </label>
                <input
                  type="number"
                  value={formData.p1.durasiBulan}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      p1: { ...formData.p1, durasiBulan: parseInt(e.target.value) || 0 },
                    })
                  }
                  className="w-full px-2.5 py-1.5 text-xs font-bold border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-600 dark:text-slate-400 font-medium block mb-0.5">
                  Bunga (% per tahun)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={(formData.p1.bungaTahunan * 100).toFixed(2)}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      p1: {
                        ...formData.p1,
                        bungaTahunan: (parseFloat(e.target.value) || 0) / 100,
                      },
                    })
                  }
                  className="w-full px-2.5 py-1.5 text-xs font-bold border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-600 dark:text-slate-400 font-medium block mb-0.5">
                  Cicilan SP3K (Rp)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.p1.cicilanBulanan}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      p1: {
                        ...formData.p1,
                        cicilanBulanan: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-2.5 py-1.5 text-xs font-bold border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Periode 2 */}
            <div className="p-3.5 bg-blue-50/50 dark:bg-slate-800/60 rounded-xl border border-blue-200/60 dark:border-slate-700 space-y-2">
              <span className="text-xs font-bold text-blue-800 dark:text-blue-400 block">
                Periode 2 (Bulan 37–72)
              </span>
              <div>
                <label className="text-[11px] text-slate-600 dark:text-slate-400 font-medium block mb-0.5">
                  Durasi (Bulan)
                </label>
                <input
                  type="number"
                  value={formData.p2.durasiBulan}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      p2: { ...formData.p2, durasiBulan: parseInt(e.target.value) || 0 },
                    })
                  }
                  className="w-full px-2.5 py-1.5 text-xs font-bold border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-600 dark:text-slate-400 font-medium block mb-0.5">
                  Bunga (% per tahun)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={(formData.p2.bungaTahunan * 100).toFixed(2)}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      p2: {
                        ...formData.p2,
                        bungaTahunan: (parseFloat(e.target.value) || 0) / 100,
                      },
                    })
                  }
                  className="w-full px-2.5 py-1.5 text-xs font-bold border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-600 dark:text-slate-400 font-medium block mb-0.5">
                  Cicilan SP3K (Rp)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.p2.cicilanBulanan}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      p2: {
                        ...formData.p2,
                        cicilanBulanan: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-2.5 py-1.5 text-xs font-bold border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Periode 3 */}
            <div className="p-3.5 bg-blue-50/50 dark:bg-slate-800/60 rounded-xl border border-blue-200/60 dark:border-slate-700 space-y-2">
              <span className="text-xs font-bold text-blue-800 dark:text-blue-400 block">
                Periode 3 (Bulan 73–240)
              </span>
              <div>
                <label className="text-[11px] text-slate-600 dark:text-slate-400 font-medium block mb-0.5">
                  Durasi (Bulan)
                </label>
                <input
                  type="number"
                  value={formData.p3.durasiBulan}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      p3: { ...formData.p3, durasiBulan: parseInt(e.target.value) || 0 },
                    })
                  }
                  className="w-full px-2.5 py-1.5 text-xs font-bold border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-600 dark:text-slate-400 font-medium block mb-0.5">
                  Bunga (% per tahun)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={(formData.p3.bungaTahunan * 100).toFixed(2)}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      p3: {
                        ...formData.p3,
                        bungaTahunan: (parseFloat(e.target.value) || 0) / 100,
                      },
                    })
                  }
                  className="w-full px-2.5 py-1.5 text-xs font-bold border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-600 dark:text-slate-400 font-medium block mb-0.5">
                  Cicilan SP3K (Rp)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.p3.cicilanBulanan}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      p3: {
                        ...formData.p3,
                        cicilanBulanan: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-2.5 py-1.5 text-xs font-bold border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setFormData(DEFAULT_SP3K_PARAMS);
                onReset();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset ke Default SP3K</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold bg-[#0060af] dark:bg-blue-600 hover:bg-[#004c8c] dark:hover:bg-blue-500 text-white rounded-xl shadow-xs transition"
              >
                <Check className="w-4 h-4" />
                <span>Simpan & Terapkan</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
