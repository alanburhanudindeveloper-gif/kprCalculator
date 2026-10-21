import React from 'react';
import { AlertCircle, FileText } from 'lucide-react';
import { SimulationMode } from '../types/kpr';

interface DisclaimerProps {
  mode: SimulationMode;
}

export const Disclaimer: React.FC<DisclaimerProps> = ({ mode }) => {
  return (
    <div className="bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 sm:p-5 text-xs text-amber-950 dark:text-amber-200 leading-relaxed space-y-2 shadow-xs transition-colors">
      <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300">
        <AlertCircle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
        <span>Catatan Penting & Disclaimer Resmi:</span>
      </div>
      <p className="text-amber-900/90 dark:text-amber-200/90">
        "Simulasi ini merupakan perhitungan matematis berdasarkan data SP3K dan asumsi yang dipilih pengguna. Hasil aktual dapat berbeda karena metode pembulatan, tanggal pembayaran, biaya/penalti pelunasan dipercepat, ketentuan akad, serta kebijakan bank mengenai partial prepayment dan recalculation angsuran."
      </p>
      <div className="pt-1 text-[11px] text-amber-800 dark:text-amber-300 space-y-1">
        <div className="flex items-start gap-1.5">
          <FileText className="w-3.5 h-3.5 mt-0.5 text-amber-700 dark:text-amber-400 shrink-0" />
          <span>
            <strong>Aturan Pelunasan Dipercepat BCA:</strong> Pastikan memeriksa klausul lock-in period dalam perjanjian kredit SP3K Anda (beberapa program mengenakan penalti 1%–3% jika pelunasan dilakukan selama masa suku bunga fixed).
          </span>
        </div>
        {mode === 'B' && (
          <div className="flex items-start gap-1.5">
            <FileText className="w-3.5 h-3.5 mt-0.5 text-amber-700 dark:text-amber-400 shrink-0" />
            <span>
              <strong>Khusus Mode B (Recalculation):</strong> Penurunan cicilan dengan mempertahankan sisa tenor membutuhkan persetujuan bank dan penerbitan adendum/jadwal angsuran baru dari BCA.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
