import React from 'react';
import { HelpCircle, Sparkles, ArrowRight } from 'lucide-react';
import { SimulationMode, KprParameters } from '../types/kpr';
import { formatRupiah } from '../utils/calculator';

interface HeroQuestionBannerProps {
  mode: SimulationMode;
  extraAnnual: number;
  bulanPangkas: number;
  bulanLunas: number;
  params?: KprParameters;
  onScrollToReverse: () => void;
}

export const HeroQuestionBanner: React.FC<HeroQuestionBannerProps> = ({
  mode,
  extraAnnual,
  bulanPangkas,
  bulanLunas,
  params,
  onScrollToReverse,
}) => {
  const formattedExtra = formatRupiah(extraAnnual);
  const pangkasTahun = (bulanPangkas / 12).toFixed(1).replace('.0', '');
  const lunasTahun = Math.floor(bulanLunas / 12);
  const lunasBulan = bulanLunas % 12;
  const originalTenorYears = params ? params.tenorBulan / 12 : 20;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-700/60">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-300">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Fokus Jawaban Simulasi Anda:</span>
          </div>

          {mode === 'A' ? (
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-snug">
              "Kalau saya membayar extra pokok{' '}
              <span className="text-amber-300 font-extrabold">{formattedExtra}</span> per tahun, KPR saya lunas{' '}
              {bulanPangkas > 0 ? (
                <span className="text-emerald-400 font-extrabold">
                  {pangkasTahun} tahun lebih cepat
                </span>
              ) : (
                <span className="text-slate-300 font-normal">tepat {originalTenorYears} tahun (tanpa extra)</span>
              )}
              {bulanPangkas > 0 && (
                <span className="text-slate-300 font-normal">
                  {' '}
                  (lunas di tahun ke-{lunasTahun} bulan {lunasBulan})
                </span>
              )}
              ."
            </h2>
          ) : (
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-snug">
              "Kalau saya menambah extra pokok{' '}
              <span className="text-amber-300 font-extrabold">{formattedExtra}</span> per tahun, sisa tenor tetap {originalTenorYears} tahun tetapi cicilan bulanan saya akan{' '}
              <span className="text-emerald-400 font-extrabold">terus diturunkan setiap recalculation</span>."
            </h2>
          )}

          <p className="text-xs text-slate-300 leading-relaxed pt-0.5">
            100% pembayaran ekstra ini langsung memangkas saldo pokok pinjaman, bukan bunga di muka atau administrasi.
          </p>
        </div>

        {mode === 'A' && (
          <div className="shrink-0 pt-2 md:pt-0">
            <button
              onClick={onScrollToReverse}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all border border-blue-400/40"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Hitung Kebalikan (Target Tenor)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
