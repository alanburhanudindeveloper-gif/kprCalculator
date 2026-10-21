import React from 'react';
import { X, ArrowRight, AlertTriangle, CheckCircle2, HelpCircle, Landmark, ShieldCheck } from 'lucide-react';

interface RefinancingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RefinancingGuideModal: React.FC<RefinancingGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden my-8 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                Extra Payment vs Refinancing (Take Over KPR)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Apakah rate bunga tetap sama saat pelunasan ekstra atau refinancing?
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

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          {/* Quick Answer Banner */}
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/40 space-y-1.5">
            <div className="flex items-center gap-2 font-extrabold text-amber-950 dark:text-amber-200 text-sm">
              <HelpCircle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
              <span>Jawaban Langsung:</span>
            </div>
            <p className="text-amber-900 dark:text-amber-200">
              <strong>Tergantung apa yang Anda maksud:</strong>
            </p>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-amber-950 dark:text-amber-200">
              <li>
                <strong>Jika Extra Payment di BCA (yang kita simulasikan):</strong> Ya, <strong>RATE TETAP SAMA</strong> persis sesuai SP3K (2,90% &rarr; 6,99% &rarr; 8,99%). Anda tidak mengubah akad, hanya mempercepat setor pokok.
              </li>
              <li>
                <strong>Jika Refinancing / Take Over ke Bank Lain:</strong> <strong>RATE LAMA HANGUS</strong>. Bank baru akan memberikan suku bunga baru sesuai promo mereka saat itu.
              </li>
            </ul>
          </div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Opsi 1: Extra Payment di BCA */}
            <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-900/40 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-blue-900 dark:text-blue-300 text-xs">
                <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>1. Extra Payment di BCA (Simulator Ini)</span>
              </div>
              <ul className="space-y-1.5 text-[11px]">
                <li className="flex items-start gap-1">
                  <span className="text-emerald-600 font-bold">&bull;</span>
                  <span><strong>Suku Bunga:</strong> Tetap mengikat SP3K (2,90% thn 1-3, 6,99% thn 4-6, 8,99% thn 7-20).</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-emerald-600 font-bold">&bull;</span>
                  <span><strong>Biaya Proses:</strong> Rp0 (tidak ada biaya notaris, appraisal, atau provisi ulang).</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-emerald-600 font-bold">&bull;</span>
                  <span><strong>Dampak:</strong> Pokok utang langsung terpangkas, bunga mengecil, KPR lunas bertahun-tahun lebih cepat.</span>
                </li>
              </ul>
            </div>

            {/* Opsi 2: Refinancing / Take Over */}
            <div className="p-4 bg-purple-50/50 dark:bg-purple-950/20 rounded-xl border border-purple-200 dark:border-purple-900/40 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-purple-900 dark:text-purple-300 text-xs">
                <AlertTriangle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>2. Refinancing / Take Over ke Bank Lain</span>
              </div>
              <ul className="space-y-1.5 text-[11px]">
                <li className="flex items-start gap-1">
                  <span className="text-rose-600 font-bold">&bull;</span>
                  <span><strong>Suku Bunga:</strong> Mengikuti promo baru bank baru (rate SP3K lama tidak berlaku).</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-rose-600 font-bold">&bull;</span>
                  <span><strong>Biaya Penalti:</strong> Kena penalti pelunasan dipercepat di BCA lama jika masih dalam lock-in (biasanya 2%–3% dari pokok).</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-rose-600 font-bold">&bull;</span>
                  <span><strong>Biaya Akad Baru:</strong> Wajib bayar provisi baru, biaya appraisal, notaris (APHT/SKMHT), dan asuransi jiwa baru.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Strategic Advice */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2">
            <span className="font-bold text-slate-800 dark:text-white block">
              Saran Strategis untuk KPR SP3K BCA Anda:
            </span>
            <p className="text-[11px] leading-relaxed">
              1. <strong>Tahun 1–3 (Bunga 2,90%):</strong> Rate ini <strong>sangat murah</strong> dan hampir mustahil dikalahkan oleh bank lain. Jangan pernah refinancing di periode ini karena akan rugi penalti dan biaya notaris baru.
            </p>
            <p className="text-[11px] leading-relaxed">
              2. <strong>Tahun 4–6 (Bunga 6,99%):</strong> Masih sangat kompetitif untuk ukuran bunga KPR fixed.
            </p>
            <p className="text-[11px] leading-relaxed">
              3. <strong>Strategi Terbaik:</strong> Lakukan <strong>Extra Payment pokok sebanyak mungkin di tahun 1 s/d 6</strong> menggunakan simulasi ini. Dengan memotong pokok saat bunga masih 2,90% dan 6,99%, saat masuk tahun ke-7 (bunga 8,99%), sisa utang Anda sudah sangat kecil dan bunga bank tidak lagi terasa berat!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-[#0060af] hover:bg-[#004c8c] text-white rounded-xl shadow-xs transition"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
