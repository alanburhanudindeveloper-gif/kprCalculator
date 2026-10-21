import React, { useState } from 'react';
import {
  HeartPulse,
  Sliders,
  Sparkles,
  GitCompare,
  CalendarRange,
  UserCheck,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { UserFinancialProfile, FinancialAssessmentResult } from '../../types/financialHealth';
import { KprParameters, SimulationMode, PaymentInterval, SimulationResult } from '../../types/kpr';
import { assessFinancialHealth } from '../../utils/financialAdvisor';
import { FinancialProfileForm } from './FinancialProfileForm';
import { FinancialDashboardOverview } from './FinancialDashboardOverview';
import { RecommendedScenariosSection } from './RecommendedScenariosSection';
import { WhatIfInteractiveSlider } from './WhatIfInteractiveSlider';
import { ScenarioComparisonCard } from './ScenarioComparisonCard';
import { FlexibleYearlyScheduleCard } from './FlexibleYearlyScheduleCard';
import { formatRupiah } from '../../utils/calculator';

interface FinancialHealthAdvisorCardProps {
  profile: UserFinancialProfile;
  onChangeProfile: (newProfile: UserFinancialProfile) => void;
  onResetProfile: () => void;
  kprParams: KprParameters;
  extraAnnual: number;
  interval: PaymentInterval;
  mode: SimulationMode;
  baseline: SimulationResult;
  simulated: SimulationResult;
  onApplyExtra: (amount: number) => void;
}

type ActiveAdvisorTab =
  | 'overview'
  | 'scenarios'
  | 'whatif'
  | 'comparison'
  | 'flexible'
  | 'profile';

export const FinancialHealthAdvisorCard: React.FC<FinancialHealthAdvisorCardProps> = ({
  profile,
  onChangeProfile,
  onResetProfile,
  kprParams,
  extraAnnual,
  interval,
  mode,
  baseline,
  simulated,
  onApplyExtra,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveAdvisorTab>('overview');
  const [isProfileFormOpen, setIsProfileFormOpen] = useState(false);

  // Jalankan asesmen deterministik
  const assessment: FinancialAssessmentResult = assessFinancialHealth({
    profile,
    kprParams,
    extraAnnualTarget: extraAnnual,
    interval,
    mode,
    baseline,
    simulated,
  });

  return (
    <section
      id="financial-advisor-section"
      aria-label="Fitur Financial Health dan Extra Payment Advisor"
      className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-6 transition-colors"
    >
      {/* HEADER UTAMA */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-extrabold text-[11px] uppercase tracking-wider">
              <HeartPulse className="w-3.5 h-3.5" />
              Fitur Baru: Financial Health Advisor
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
              Keseimbangan Tenor &amp; Likuiditas Kas
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Cek Kemampuan Finansial &amp; Advisor Extra Payment
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            &ldquo;Extra payment KPR seharusnya mempercepat pelunasan tanpa membuat kondisi keuangan Anda menjadi rapuh.&rdquo;
            Cari tahu apakah target pelunasan Anda realistis berdasarkan cash flow, dana darurat, dan utang lainnya.
          </p>
        </div>

        {/* Quick Profile Toggle Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveTab('profile');
              setIsProfileFormOpen(!isProfileFormOpen);
            }}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition cursor-pointer active:scale-95"
          >
            <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Ubah Profil Keuangan</span>
            {isProfileFormOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* SUB-NAV TABS */}
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-slate-100 dark:border-slate-800 text-xs">
        <button
          type="button"
          onClick={() => {
            setActiveTab('overview');
            setIsProfileFormOpen(false);
          }}
          className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'overview' && !isProfileFormOpen
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <HeartPulse className="w-3.5 h-3.5" />
          <span>Dashboard &amp; Skor</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('scenarios');
            setIsProfileFormOpen(false);
          }}
          className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'scenarios' && !isProfileFormOpen
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>3 Skenario Rekomendasi</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('whatif');
            setIsProfileFormOpen(false);
          }}
          className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'whatif' && !isProfileFormOpen
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>What-If Slider</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('comparison');
            setIsProfileFormOpen(false);
          }}
          className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'comparison' && !isProfileFormOpen
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <GitCompare className="w-3.5 h-3.5" />
          <span>Bandingkan Trade-off</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('flexible');
            setIsProfileFormOpen(false);
          }}
          className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'flexible' && !isProfileFormOpen
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <CalendarRange className="w-3.5 h-3.5" />
          <span>Jadwal Fleksibel</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('profile');
            setIsProfileFormOpen(true);
          }}
          className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'profile' || isProfileFormOpen
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Form Data Profil</span>
        </button>
      </div>

      {/* ACTIVE TAB CONTENT */}
      <div className="pt-1">
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === 'overview' && !isProfileFormOpen && (
          <FinancialDashboardOverview
            assessment={assessment}
            onApplyRecommended={() => onApplyExtra(assessment.recommendedExtraAnnual)}
            onOpenWhatIf={() => setActiveTab('whatif')}
          />
        )}

        {/* TAB 2: 3 RECOMMENDED SCENARIOS */}
        {activeTab === 'scenarios' && !isProfileFormOpen && (
          <RecommendedScenariosSection
            scenarios={assessment.scenarios}
            activeExtraAnnual={extraAnnual}
            onSelectScenario={(amt) => onApplyExtra(amt)}
          />
        )}

        {/* TAB 3: WHAT-IF SLIDER */}
        {activeTab === 'whatif' && !isProfileFormOpen && (
          <WhatIfInteractiveSlider
            profile={profile}
            kprParams={kprParams}
            interval={interval}
            mode={mode}
            baseline={baseline}
            simulated={simulated}
            currentExtraAnnual={extraAnnual}
            onApplyExtra={(amt) => onApplyExtra(amt)}
          />
        )}

        {/* TAB 4: TRADE-OFF COMPARISON */}
        {activeTab === 'comparison' && !isProfileFormOpen && (
          <ScenarioComparisonCard
            profile={profile}
            kprParams={kprParams}
            interval={interval}
            mode={mode}
            baseline={baseline}
            currentExtraAnnual={extraAnnual}
            recommendedExtraAnnual={assessment.recommendedExtraAnnual}
            onApplyScenario={(amt) => onApplyExtra(amt)}
          />
        )}

        {/* TAB 5: FLEXIBLE YEARLY SCHEDULE */}
        {activeTab === 'flexible' && !isProfileFormOpen && (
          <FlexibleYearlyScheduleCard
            kprParams={kprParams}
            interval={interval}
            mode={mode}
            baseline={baseline}
          />
        )}

        {/* TAB 6: PROFILE FORM (OR TOGGLED FORM) */}
        {(activeTab === 'profile' || isProfileFormOpen) && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Input Data Finansial Pribadi &amp; Rumah Tangga
              </span>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('overview');
                  setIsProfileFormOpen(false);
                }}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Selesai &amp; Lihat Analisis &rarr;
              </button>
            </div>

            <FinancialProfileForm
              profile={profile}
              onChangeProfile={onChangeProfile}
              onReset={onResetProfile}
            />
          </div>
        )}
      </div>

      {/* EDUCATIONAL DISCLAIMER (REQUIREMENT #18) */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <div>
          <strong>Disclaimer Finansial:</strong> Analisis ini merupakan simulasi edukatif berbasis rumus keuangan deterministik dari data yang Anda masukkan, bukan nasihat perencana keuangan berlisensi. Kondisi finansial setiap orang berbeda. Selalu pertimbangkan kebutuhan hidup, dana darurat, cicilan utang lain, instrumen investasi, serta ketentuan perbankan sebelum melakukan pelunasan pokok KPR dipercepat.
        </div>
      </div>
    </section>
  );
};
