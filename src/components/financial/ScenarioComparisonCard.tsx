import React, { useState } from 'react';
import {
  GitCompare,
  TrendingDown,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Scale,
  MinusCircle,
  PlusCircle,
} from 'lucide-react';
import { UserFinancialProfile } from '../../types/financialHealth';
import { KprParameters, SimulationMode, PaymentInterval, SimulationResult } from '../../types/kpr';
import { assessFinancialHealth } from '../../utils/financialAdvisor';
import { formatRupiah, runAmortizationSimulation } from '../../utils/calculator';

interface ScenarioComparisonCardProps {
  profile: UserFinancialProfile;
  kprParams: KprParameters;
  interval: PaymentInterval;
  mode: SimulationMode;
  baseline: SimulationResult;
  currentExtraAnnual: number;
  recommendedExtraAnnual: number;
  onApplyScenario: (amount: number) => void;
}

export const ScenarioComparisonCard: React.FC<ScenarioComparisonCardProps> = ({
  profile,
  kprParams,
  interval,
  mode,
  baseline,
  currentExtraAnnual,
  recommendedExtraAnnual,
  onApplyScenario,
}) => {
  const [optionA, setOptionA] = useState<number>(
    currentExtraAnnual > 0 ? currentExtraAnnual : 24_000_000
  );
  const [optionB, setOptionB] = useState<number>(
    recommendedExtraAnnual > 0 ? recommendedExtraAnnual : 48_000_000
  );

  // Simulasi opsi A
  const simA = runAmortizationSimulation(kprParams, optionA, interval, mode);
  const assessA = assessFinancialHealth({
    profile,
    kprParams,
    extraAnnualTarget: optionA,
    interval,
    mode,
    baseline,
    simulated: simA,
  });

  // Simulasi opsi B
  const simB = runAmortizationSimulation(kprParams, optionB, interval, mode);
  const assessB = assessFinancialHealth({
    profile,
    kprParams,
    extraAnnualTarget: optionB,
    interval,
    mode,
    baseline,
    simulated: simB,
  });

  const diffTenorBulan = Math.abs(simA.bulanLunas - simB.bulanLunas);
  const diffHematBunga = Math.abs(
    baseline.totalBunga - simB.totalBunga - (baseline.totalBunga - simA.totalBunga)
  );
  const diffBuffer = Math.abs(assessA.remainingBuffer - assessB.remainingBuffer);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-6">
      <div>
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Mode Perbandingan &amp; Analisis Trade-off (Benefit vs Cost)</span>
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Bandingkan dua target nominal untuk melihat apakah tambahan beban cash flow sebanding dengan percepatan pelunasan.
        </p>
      </div>

      {/* Inputs Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>Skenario Pilihan A:</span>
            <span className="text-blue-600 dark:text-blue-400 font-extrabold">{formatRupiah(optionA)}/thn</span>
          </label>
          <select
            value={optionA}
            onChange={(e) => setOptionA(Number(e.target.value))}
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
          >
            <option value={12_000_000}>Rp12 Juta / tahun (Rp1 Jt/bln)</option>
            <option value={24_000_000}>Rp24 Juta / tahun (Rp2 Jt/bln)</option>
            <option value={36_000_000}>Rp36 Juta / tahun (Rp3 Jt/bln)</option>
            <option value={48_000_000}>Rp48 Juta / tahun (Rp4 Jt/bln)</option>
            <option value={60_000_000}>Rp60 Juta / tahun (Rp5 Jt/bln)</option>
            <option value={72_000_000}>Rp72 Juta / tahun (Rp6 Jt/bln)</option>
            <option value={96_000_000}>Rp96 Juta / tahun (Rp8 Jt/bln)</option>
            <option value={120_000_000}>Rp120 Juta / tahun (Rp10 Jt/bln)</option>
          </select>
        </div>

        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>Skenario Pilihan B:</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{formatRupiah(optionB)}/thn</span>
          </label>
          <select
            value={optionB}
            onChange={(e) => setOptionB(Number(e.target.value))}
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
          >
            <option value={12_000_000}>Rp12 Juta / tahun (Rp1 Jt/bln)</option>
            <option value={24_000_000}>Rp24 Juta / tahun (Rp2 Jt/bln)</option>
            <option value={36_000_000}>Rp36 Juta / tahun (Rp3 Jt/bln)</option>
            <option value={48_000_000}>Rp48 Juta / tahun (Rp4 Jt/bln)</option>
            <option value={60_000_000}>Rp60 Juta / tahun (Rp5 Jt/bln)</option>
            <option value={72_000_000}>Rp72 Juta / tahun (Rp6 Jt/bln)</option>
            <option value={96_000_000}>Rp96 Juta / tahun (Rp8 Jt/bln)</option>
            <option value={120_000_000}>Rp120 Juta / tahun (Rp10 Jt/bln)</option>
          </select>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              <th className="py-2.5 px-3 font-semibold">Parameter Evaluasi</th>
              <th className="py-2.5 px-3 font-bold text-blue-600 dark:text-blue-400 text-right">
                Pilihan A ({formatRupiah(optionA)}/thn)
              </th>
              <th className="py-2.5 px-3 font-bold text-indigo-600 dark:text-indigo-400 text-right">
                Pilihan B ({formatRupiah(optionB)}/thn)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            <tr>
              <td className="py-2 px-3 text-slate-600 dark:text-slate-300">Estimasi Tenor Lunas</td>
              <td className="py-2 px-3 text-right font-bold text-slate-800 dark:text-white">
                {(simA.bulanLunas / 12).toFixed(1)} Tahun ({simA.bulanLunas} bln)
              </td>
              <td className="py-2 px-3 text-right font-bold text-slate-800 dark:text-white">
                {(simB.bulanLunas / 12).toFixed(1)} Tahun ({simB.bulanLunas} bln)
              </td>
            </tr>
            <tr>
              <td className="py-2 px-3 text-slate-600 dark:text-slate-300">Total Bunga Dihemat</td>
              <td className="py-2 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                {formatRupiah(Math.max(0, baseline.totalBunga - simA.totalBunga))}
              </td>
              <td className="py-2 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                {formatRupiah(Math.max(0, baseline.totalBunga - simB.totalBunga))}
              </td>
            </tr>
            <tr>
              <td className="py-2 px-3 text-slate-600 dark:text-slate-300">Beban Bulanan Setara</td>
              <td className="py-2 px-3 text-right font-semibold text-slate-800 dark:text-slate-200">
                {formatRupiah(assessA.extraMonthlyEquivalent)} / bulan
              </td>
              <td className="py-2 px-3 text-right font-semibold text-slate-800 dark:text-slate-200">
                {formatRupiah(assessB.extraMonthlyEquivalent)} / bulan
              </td>
            </tr>
            <tr>
              <td className="py-2 px-3 text-slate-600 dark:text-slate-300">Sisa Buffer Kas Bulanan</td>
              <td
                className={`py-2 px-3 text-right font-bold ${
                  assessA.remainingBuffer >= 1_000_000
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-amber-600 dark:text-amber-400'
                }`}
              >
                {formatRupiah(assessA.remainingBuffer)} / bulan
              </td>
              <td
                className={`py-2 px-3 text-right font-bold ${
                  assessB.remainingBuffer >= 1_000_000
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-amber-600 dark:text-amber-400'
                }`}
              >
                {formatRupiah(assessB.remainingBuffer)} / bulan
              </td>
            </tr>
            <tr>
              <td className="py-2 px-3 text-slate-600 dark:text-slate-300">Status Kesehatan Finansial</td>
              <td className="py-2 px-3 text-right">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    assessA.healthStatus === 'healthy'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : assessA.healthStatus === 'caution'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}
                >
                  {assessA.healthStatus === 'healthy' ? '🟢 SEHAT' : assessA.healthStatus === 'caution' ? '🟡 PERLU DIPERTIMBANGKAN' : '🔴 AGRESIF'}
                </span>
              </td>
              <td className="py-2 px-3 text-right">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    assessB.healthStatus === 'healthy'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : assessB.healthStatus === 'caution'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}
                >
                  {assessB.healthStatus === 'healthy' ? '🟢 SEHAT' : assessB.healthStatus === 'caution' ? '🟡 PERLU DIPERTIMBANGKAN' : '🔴 AGRESIF'}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* EDUCATIONAL TRADE-OFF CARD (BENEFIT VS COST) */}
      <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white">
          <Scale className="w-4 h-4 text-amber-500" />
          <span>Dua Sisi Keputusan: Benefit vs. Cost / Trade-off</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Benefit Column */}
          <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200/50 dark:border-emerald-900/50 space-y-1.5">
            <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Keuntungan (Benefit)</span>
            </span>
            <ul className="list-disc list-inside text-[11px] text-slate-600 dark:text-slate-300 space-y-1 leading-snug">
              <li>KPR lunas bertahun-tahun lebih awal</li>
              <li>Beban bunga bank berkurang ratusan juta rupiah</li>
              <li>Bebas dari beban psikologis utang jangka panjang</li>
              <li>Aset rumah lunas 100% lebih cepat</li>
            </ul>
          </div>

          {/* Cost / Risk Column */}
          <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-lg border border-amber-200/50 dark:border-amber-900/50 space-y-1.5">
            <span className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1">
              <MinusCircle className="w-3.5 h-3.5" />
              <span>Konsekuensi &amp; Risiko (Trade-off)</span>
            </span>
            <ul className="list-disc list-inside text-[11px] text-slate-600 dark:text-slate-300 space-y-1 leading-snug">
              <li>Uang tunai kas berkurang (likuiditas menurun)</li>
              <li>Bantalan dana darurat berpotensi terkikis</li>
              <li>Fleksibilitas terbatas saat ada pengeluaran mendadak</li>
              <li>Opportunity cost (uang tidak diinvestasikan ke instrumen lain)</li>
            </ul>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 italic leading-relaxed">
          &ldquo;Hemat bunga&rdquo; tidak otomatis berarti &ldquo;keputusan finansial terbaik&rdquo; jika mengorbankan keamanan kas sehari-hari. Pilihlah nominal yang membuat Anda tenang tidur di malam hari tanpa khawatir kas darurat.
        </p>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
        <button
          type="button"
          onClick={() => onApplyScenario(optionA)}
          className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition cursor-pointer active:scale-98 flex items-center justify-center gap-1.5"
        >
          <span>Terapkan Pilihan A ({formatRupiah(optionA)}/thn)</span>
        </button>
        <button
          type="button"
          onClick={() => onApplyScenario(optionB)}
          className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition cursor-pointer active:scale-98 flex items-center justify-center gap-1.5"
        >
          <span>Terapkan Pilihan B ({formatRupiah(optionB)}/thn)</span>
        </button>
      </div>
    </div>
  );
};
