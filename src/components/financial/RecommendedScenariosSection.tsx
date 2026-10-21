import React from 'react';
import {
  ShieldCheck,
  Zap,
  Leaf,
  CheckCircle2,
  Clock,
  TrendingDown,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { RecommendedScenario } from '../../types/financialHealth';
import { formatRupiah } from '../../utils/calculator';

interface RecommendedScenariosSectionProps {
  scenarios: {
    conservative: RecommendedScenario;
    recommended: RecommendedScenario;
    aggressive: RecommendedScenario;
  };
  activeExtraAnnual: number;
  onSelectScenario: (amount: number) => void;
}

export const RecommendedScenariosSection: React.FC<RecommendedScenariosSectionProps> = ({
  scenarios,
  activeExtraAnnual,
  onSelectScenario,
}) => {
  const scenarioList = [
    {
      ...scenarios.conservative,
      icon: Leaf,
      color: 'emerald',
      badge: 'Aman & Fleksibel',
      isHighlight: false,
    },
    {
      ...scenarios.recommended,
      icon: Sparkles,
      color: 'blue',
      badge: 'Paling Seimbang (Recommended)',
      isHighlight: true,
    },
    {
      ...scenarios.aggressive,
      icon: Zap,
      color: 'amber',
      badge: 'Percepatan Maksimal',
      isHighlight: false,
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>3 Skenario Rekomendasi Berdasarkan Profil Finansial</span>
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Setiap skenario dihitung menggunakan kalkulasi aktuaria amortisasi aktual terhadap sisa pokok KPR Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenarioList.map((sc) => {
          const isSelected = activeExtraAnnual === sc.extraAnnual;
          const Icon = sc.icon;

          return (
            <div
              key={sc.id}
              className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                sc.isHighlight
                  ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 shadow-sm ring-1 ring-blue-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              } ${isSelected ? 'ring-2 ring-blue-600 dark:ring-blue-400' : ''}`}
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      sc.isHighlight
                        ? 'bg-blue-600 text-white'
                        : sc.id === 'conservative'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{sc.badge}</span>
                  </span>

                  {isSelected && (
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Aktif</span>
                    </span>
                  )}
                </div>

                <div>
                  <h5 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {sc.title}
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {sc.tagline}
                  </p>
                </div>

                {/* Extra Amount */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Alokasi Extra Payment:
                  </span>
                  <div className="text-lg font-black text-slate-900 dark:text-white">
                    {formatRupiah(sc.extraAnnual)} <span className="text-xs font-normal text-slate-500">/tahun</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Setara {formatRupiah(sc.extraMonthlyEquivalent)} / bulan
                  </div>
                </div>

                {/* Amortization Metrics */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>Estimasi Tenor Baru:</span>
                    </span>
                    <span className="font-bold text-slate-800 dark:text-white">
                      {sc.estimasiTenorTahun} Tahun ({sc.estimasiTenorBulan} Bln)
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <TrendingDown className="w-3 h-3 text-emerald-500" />
                      <span>Hemat Bunga KPR:</span>
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {formatRupiah(sc.hematBunga)}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">Sisa Buffer Bulanan:</span>
                    <span className="font-bold text-slate-800 dark:text-white">
                      {formatRupiah(sc.remainingBuffer)}/bln
                    </span>
                  </div>

                  <div className="flex justify-between py-1">
                    <span className="text-slate-500 dark:text-slate-400">Dampak Beban Cashflow:</span>
                    <span
                      className={`font-bold ${
                        sc.cashFlowImpact === 'Rendah'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : sc.cashFlowImpact === 'Sedang'
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {sc.cashFlowImpact}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed italic">
                  &ldquo;{sc.description}&rdquo;
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => onSelectScenario(sc.extraAnnual)}
                  className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-98 ${
                    isSelected
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white'
                      : sc.isHighlight
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white'
                  }`}
                >
                  <span>{isSelected ? 'Skenario Terpilih' : 'Terapkan Skenario Ini'}</span>
                  {!isSelected && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
