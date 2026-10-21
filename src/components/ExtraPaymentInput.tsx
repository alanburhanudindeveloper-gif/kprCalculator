import React from 'react';
import { Calendar, Wallet, Check } from 'lucide-react';
import { PaymentInterval } from '../types/kpr';
import { formatRupiah, parseRupiahInput } from '../utils/calculator';

interface ExtraPaymentInputProps {
  extraAnnual: number;
  interval: PaymentInterval;
  onChangeExtra: (amount: number) => void;
  onChangeInterval: (interval: PaymentInterval) => void;
}

const PRESET_AMOUNTS = [
  { label: 'Rp0', value: 0 },
  { label: '5 Jt', value: 5_000_000 },
  { label: '10 Jt', value: 10_000_000 },
  { label: '20 Jt', value: 20_000_000 },
  { label: '30 Jt', value: 30_000_000 },
  { label: '50 Jt', value: 5_0000_000 },
  { label: '100 Jt', value: 100_000_000 },
];

export const ExtraPaymentInput: React.FC<ExtraPaymentInputProps> = ({
  extraAnnual,
  interval,
  onChangeExtra,
  onChangeInterval,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawNum = parseRupiahInput(e.target.value);
    onChangeExtra(rawNum);
  };

  const formattedDisplay = extraAnnual > 0 ? extraAnnual.toLocaleString('id-ID') : '0';

  let intervalTextDesc = '';
  if (interval === 12) {
    intervalTextDesc = `Dibayarkan 1x di akhir tahun (Bulan ke-12, 24, 36...) sebesar ${formatRupiah(extraAnnual)}`;
  } else if (interval === 6) {
    intervalTextDesc = `Dibayarkan 2x per tahun (Bulan ke-6, 12, 18...) masing-masing sebesar ${formatRupiah(extraAnnual / 2)}`;
  } else {
    intervalTextDesc = `Dibagi rata setiap bulan (12x per tahun) sebesar ${formatRupiah(extraAnnual / 12)}/bulan`;
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800 transition-colors space-y-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        {/* Main Number Input */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Extra Pembayaran Pokok per Tahun</span>
            </label>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
              (100% memotong sisa pokok utang)
            </span>
          </div>

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-bold text-lg select-none">
              Rp
            </div>
            <input
              type="text"
              value={formattedDisplay}
              onChange={handleInputChange}
              className="w-full pl-12 pr-4 py-3 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white bg-slate-50/80 dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-950 border-2 border-slate-200 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950 rounded-xl focus:outline-none transition-all tabular-nums"
              placeholder="0"
            />
          </div>
        </div>

        {/* Interval Dropdown */}
        <div className="w-full md:w-72">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Frekuensi Setor Extra</span>
          </label>
          <div className="relative">
            <select
              value={interval}
              onChange={(e) => onChangeInterval(Number(e.target.value) as PaymentInterval)}
              className="w-full py-3.5 px-4 bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 focus:border-blue-600 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-all cursor-pointer"
            >
              <option value={12}>Setiap Tahun (Akhir Thn: Bln 12, 24...) - Default</option>
              <option value={6}>Setiap 6 Bulan (Bln 6, 12, 18, 24...)</option>
              <option value={1}>Setiap Bulan (Dibagi rata 12 bln)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Preset Chips */}
      <div className="pt-1 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">Pilihan Cepat:</span>
          {PRESET_AMOUNTS.map((preset) => {
            const isSelected = extraAnnual === preset.value;
            return (
              <button
                key={preset.value}
                type="button"
                onClick={() => onChangeExtra(preset.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {isSelected && <Check className="w-3 h-3" />}
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>

        <div className="text-[11px] text-slate-500 dark:text-slate-400 italic">
          {intervalTextDesc}
        </div>
      </div>
    </div>
  );
};
