import {
  UserFinancialProfile,
  FinancialAssessmentResult,
  RecommendedScenario,
  HealthStatusLevel,
  EmergencyCategory,
} from '../types/financialHealth';
import { KprParameters, SimulationMode, PaymentInterval, SimulationResult } from '../types/kpr';
import { runAmortizationSimulation, formatRupiah } from './calculator';

export const DEFAULT_FINANCIAL_PROFILE: UserFinancialProfile = {
  income: {
    gajiBersih: 18_000_000,
    penghasilanTambahan: 2_000_000,
    penghasilanPasangan: 0,
    bonusTahunan: 15_000_000,
    includeBonusInMonthly: false,
  },
  expenses: {
    makanRumahTangga: 4_500_000,
    transportasi: 1_200_000,
    listrikAirInternet: 1_100_000,
    pendidikan: 500_000,
    asuransiKesehatan: 800_000,
    anakKeluarga: 500_000,
    gayaHidup: 1_200_000,
    pengeluaranLainnya: 500_000,
  },
  debts: {
    cicilanKendaraan: 1_200_000,
    kartuKredit: 0,
    pinjamanPribadi: 0,
    paylater: 0,
    cicilanLainnya: 0,
  },
  assets: {
    tabunganCash: 25_000_000,
    danaDarurat: 45_000_000,
    investasiLikuid: 20_000_000,
    isEmergencyFundUsable: true,
  },
};

/**
 * Hitung total pendapatan bulanan
 */
export function calculateTotalIncome(income: UserFinancialProfile['income']): number {
  const base = (income.gajiBersih || 0) + (income.penghasilanTambahan || 0) + (income.penghasilanPasangan || 0);
  const bonusMonthly = income.includeBonusInMonthly ? (income.bonusTahunan || 0) / 12 : 0;
  return base + bonusMonthly;
}

/**
 * Hitung total pengeluaran rutin bulanan
 */
export function calculateTotalExpenses(expenses: UserFinancialProfile['expenses']): number {
  return (
    (expenses.makanRumahTangga || 0) +
    (expenses.transportasi || 0) +
    (expenses.listrikAirInternet || 0) +
    (expenses.pendidikan || 0) +
    (expenses.asuransiKesehatan || 0) +
    (expenses.anakKeluarga || 0) +
    (expenses.gayaHidup || 0) +
    (expenses.pengeluaranLainnya || 0)
  );
}

/**
 * Hitung total kewajiban utang non-KPR per bulan
 */
export function calculateTotalOtherDebts(debts: UserFinancialProfile['debts']): number {
  return (
    (debts.cicilanKendaraan || 0) +
    (debts.kartuKredit || 0) +
    (debts.pinjamanPribadi || 0) +
    (debts.paylater || 0) +
    (debts.cicilanLainnya || 0)
  );
}

/**
 * Evaluasi kesehatan keuangan dan kapasitas extra payment KPR
 * Menggunakan deterministic financial logic & actuarial amortization.
 */
export function assessFinancialHealth({
  profile,
  kprParams,
  extraAnnualTarget,
  interval,
  mode,
  baseline,
  simulated,
}: {
  profile: UserFinancialProfile;
  kprParams: KprParameters;
  extraAnnualTarget: number;
  interval: PaymentInterval;
  mode: SimulationMode;
  baseline: SimulationResult;
  simulated: SimulationResult;
}): FinancialAssessmentResult {
  const totalIncome = calculateTotalIncome(profile.income);
  const totalExpenses = calculateTotalExpenses(profile.expenses);
  const totalOtherDebts = calculateTotalOtherDebts(profile.debts);

  // Cicilan KPR saat ini (gunakan cicilan aktual periode berjalan dari schedule)
  const cicilanKprCurrent =
    simulated.schedule[0]?.cicilanBulanan ||
    baseline.schedule[0]?.cicilanBulanan ||
    (kprParams.interestType === 'tiered' ? kprParams.p1.cicilanBulanan : 4_500_000);

  // Pengeluaran wajib bulanan (kebutuhan dasar + seluruh utang)
  const totalKewajibanBulanan = totalExpenses + cicilanKprCurrent + totalOtherDebts;

  // Disposable income (Surplus cash flow sebelum extra payment)
  const disposableIncome = totalIncome - totalKewajibanBulanan;

  // Beban bulanan setara dari extra payment tahunan
  const extraMonthlyEquivalent = extraAnnualTarget / 12;

  // Sisa buffer bulanan setelah extra payment
  const remainingBuffer = disposableIncome - extraMonthlyEquivalent;
  const bufferRatio = disposableIncome > 0 ? remainingBuffer / disposableIncome : 0;
  const extraShareOfSurplus = disposableIncome > 0 ? extraMonthlyEquivalent / disposableIncome : 1;

  // Debt to income ratio (Total cicilan utang / Total pendapatan)
  const totalMonthlyDebt = cicilanKprCurrent + totalOtherDebts;
  const dtiRatio = totalIncome > 0 ? totalMonthlyDebt / totalIncome : 0;

  // Emergency Fund Coverage (Bulan pengeluaran wajib)
  const effectiveEmergencyFund = profile.assets.isEmergencyFundUsable
    ? profile.assets.danaDarurat || 0
    : (profile.assets.danaDarurat || 0) * 0.5; // Jika tidak likuid, hitung konservatif

  const emergencyFundMonths =
    totalKewajibanBulanan > 0 ? effectiveEmergencyFund / totalKewajibanBulanan : 0;

  let emergencyCategory: EmergencyCategory = 'moderate';
  if (emergencyFundMonths < 3) {
    emergencyCategory = 'low';
  } else if (emergencyFundMonths > 6) {
    emergencyCategory = 'strong';
  }

  // --- DETERMINISTIC SCORING & HEALTH STATUS ---
  let healthStatus: HealthStatusLevel = 'healthy';
  let healthScore = 80;
  const insights: string[] = [];
  const warnings: string[] = [];

  if (disposableIncome <= 0) {
    healthStatus = 'aggressive';
    healthScore = 25;
    warnings.push(
      'Cash flow bulanan Anda saat ini sedang defisit atau pas-pasan sebelum memperhitungkan extra payment.'
    );
  } else if (remainingBuffer < 0) {
    healthStatus = 'aggressive';
    healthScore = 35;
    warnings.push(
      `Target extra payment (${formatRupiah(extraAnnualTarget)}/thn setara ${formatRupiah(extraMonthlyEquivalent)}/bln) melebihi surplus kas bulanan Anda (${formatRupiah(disposableIncome)}/bln).`
    );
  } else if (extraShareOfSurplus > 0.75 || remainingBuffer < 1_000_000) {
    healthStatus = 'aggressive';
    healthScore = 48;
    warnings.push(
      'Extra payment menggunakan lebih dari 75% surplus kas Anda. Buffer bulanan menjadi sangat tipis jika terjadi pengeluaran tak terduga.'
    );
  } else if (extraShareOfSurplus > 0.5 || emergencyCategory === 'low') {
    healthStatus = 'caution';
    healthScore = 65;
    if (emergencyCategory === 'low') {
      warnings.push(
        `Dana darurat Anda saat ini baru mencakup ±${emergencyFundMonths.toFixed(1)} bulan pengeluaran. Disarankan memperkuat dana darurat hingga minimal 3 bulan sebelum memperbesar extra payment KPR.`
      );
    } else {
      insights.push(
        'Target extra payment cukup agresif namun masih menyisakan buffer. Tetap pantau pengeluaran gaya hidup.'
      );
    }
  } else {
    healthStatus = 'healthy';
    healthScore = emergencyCategory === 'strong' ? 92 : 82;
    insights.push(
      'Target extra payment Anda berada dalam kapasitas cash flow yang sehat dan menyisakan ruang fleksibilitas yang aman.'
    );
  }

  if (dtiRatio > 0.45) {
    warnings.push(
      `Rasio total cicilan utang Anda mencapai ${(dtiRatio * 100).toFixed(0)}% dari penghasilan (ambang batas aman perbankan adalah 30-40%). Prioritaskan melunasi utang konsumtif berbunga tinggi.`
    );
  }

  // --- REKOMENDASI EXTRA PAYMENT OTOMATIS (OPTIMAL RANGE) ---
  const positiveSurplus = Math.max(0, disposableIncome);
  let targetSurplusShare = 0.45; // Default recommended: 45% of surplus

  let whyRecommended = '';
  if (emergencyCategory === 'low') {
    targetSurplusShare = 0.25;
    whyRecommended =
      'Karena dana darurat Anda masih di bawah 3 bulan pengeluaran, rekomendasi dibatasi pada ~25% surplus kas agar sebagian besar surplus dapat dialokasikan untuk membangun bantalan darurat terlebih dahulu.';
  } else if (emergencyCategory === 'strong') {
    targetSurplusShare = dtiRatio > 0.4 ? 0.35 : 0.55;
    whyRecommended =
      'Dengan dana darurat yang kuat (>6 bulan pengeluaran) dan cash flow positif, Anda dapat mengalokasikan hingga ~50-55% surplus untuk mempercepat pelunasan KPR tanpa mengorbankan keamanan finansial.';
  } else {
    targetSurplusShare = 0.42;
    whyRecommended =
      'Kondisi keuangan Anda relatif seimbang. Alokasi ~40-45% surplus kas memberikan titik temu optimal antara pemotongan pokok KPR dan ketersediaan dana cadangan operasional bulanan.';
  }

  // Bulatkan ke kelipatan Rp500.000 terdekat per bulan
  const recMonthly = Math.round((positiveSurplus * targetSurplusShare) / 500_000) * 500_000;
  const recommendedExtraAnnual = Math.max(0, recMonthly * 12);

  const minRange = Math.max(0, Math.round((positiveSurplus * (targetSurplusShare - 0.12)) / 500_000) * 500_000 * 12);
  const maxRange = Math.max(0, Math.round((positiveSurplus * (targetSurplusShare + 0.12)) / 500_000) * 500_000 * 12);

  // --- GENERATE 3 DETERMINISTIC SCENARIOS ---
  // 1. Konservatif (~25% surplus)
  const consExtraAnnual = Math.max(0, Math.round((positiveSurplus * 0.22) / 500_000) * 500_000 * 12);
  const consSim = runAmortizationSimulation(kprParams, consExtraAnnual, interval, mode);
  const consBuffer = disposableIncome - consExtraAnnual / 12;

  const scenarioConservative: RecommendedScenario = {
    id: 'conservative',
    title: 'Konservatif',
    tagline: 'Prioritas Likuiditas & Fleksibilitas',
    extraAnnual: consExtraAnnual,
    extraMonthlyEquivalent: consExtraAnnual / 12,
    remainingBuffer: consBuffer,
    bufferPercentage: disposableIncome > 0 ? (consBuffer / disposableIncome) * 100 : 0,
    estimasiTenorBulan: consSim.bulanLunas,
    estimasiTenorTahun: Number((consSim.bulanLunas / 12).toFixed(1)),
    hematBunga: Math.max(0, baseline.totalBunga - consSim.totalBunga),
    cashFlowImpact: 'Rendah',
    status: 'healthy',
    description: 'Menyisakan buffer kas bulanan yang sangat lega untuk tabungan, investasi, dan gaya hidup.',
  };

  // 2. Seimbang / Recommended
  const recSim = runAmortizationSimulation(kprParams, recommendedExtraAnnual, interval, mode);
  const recBuffer = disposableIncome - recommendedExtraAnnual / 12;

  const scenarioRecommended: RecommendedScenario = {
    id: 'recommended',
    title: 'Seimbang (Recommended)',
    tagline: 'Trade-off Optimal Tenor & Cash Flow',
    extraAnnual: recommendedExtraAnnual,
    extraMonthlyEquivalent: recommendedExtraAnnual / 12,
    remainingBuffer: recBuffer,
    bufferPercentage: disposableIncome > 0 ? (recBuffer / disposableIncome) * 100 : 0,
    estimasiTenorBulan: recSim.bulanLunas,
    estimasiTenorTahun: Number((recSim.bulanLunas / 12).toFixed(1)),
    hematBunga: Math.max(0, baseline.totalBunga - recSim.totalBunga),
    cashFlowImpact: 'Sedang',
    status: 'healthy',
    description: 'Titik keseimbangan terbaik antara percepatan bebas utang KPR dan kenyamanan kas harian.',
  };

  // 3. Agresif (~70% surplus)
  const aggExtraAnnual = Math.max(0, Math.round((positiveSurplus * 0.7) / 500_000) * 500_000 * 12);
  const aggSim = runAmortizationSimulation(kprParams, aggExtraAnnual, interval, mode);
  const aggBuffer = disposableIncome - aggExtraAnnual / 12;

  const scenarioAggressive: RecommendedScenario = {
    id: 'aggressive',
    title: 'Agresif',
    tagline: 'Percepatan Maksimal Bebas KPR',
    extraAnnual: aggExtraAnnual,
    extraMonthlyEquivalent: aggExtraAnnual / 12,
    remainingBuffer: aggBuffer,
    bufferPercentage: disposableIncome > 0 ? (aggBuffer / disposableIncome) * 100 : 0,
    estimasiTenorBulan: aggSim.bulanLunas,
    estimasiTenorTahun: Number((aggSim.bulanLunas / 12).toFixed(1)),
    hematBunga: Math.max(0, baseline.totalBunga - aggSim.totalBunga),
    cashFlowImpact: 'Tinggi',
    status: aggBuffer < 1_000_000 ? 'aggressive' : 'caution',
    description: 'Pelunasan KPR paling cepat dengan konsekuensi sisa kas bulanan menjadi sangat ketat.',
  };

  let healthHeadline = 'Kondisi Keuangan Sehat';
  let healthExplanation =
    'Target extra payment KPR Anda masih berada dalam kapasitas finansial yang relatif aman dan berkelanjutan.';

  if (healthStatus === 'caution') {
    healthHeadline = 'Perlu Dipertimbangkan';
    healthExplanation =
      'Target extra payment cukup agresif. Perhatikan kecukupan dana darurat dan jaga fleksibilitas cash flow bulanan.';
  } else if (healthStatus === 'aggressive') {
    healthHeadline = 'Terlalu Agresif / Berisiko';
    healthExplanation =
      'Target extra payment berpotensi membuat cash flow terlalu ketat atau menguras cadangan darurat Anda.';
  }

  return {
    totalIncome,
    totalExpenses,
    totalOtherDebts,
    cicilanKprCurrent,
    totalKewajibanBulanan,
    disposableIncome,
    extraAnnualTarget,
    extraMonthlyEquivalent,
    remainingBuffer,
    bufferRatio,
    extraShareOfSurplus,
    totalMonthlyDebt,
    dtiRatio,
    effectiveEmergencyFund,
    emergencyFundMonths,
    emergencyCategory,
    healthScore,
    healthStatus,
    healthHeadline,
    healthExplanation,
    insights,
    warnings,
    recommendedExtraAnnual,
    recommendedRange: {
      min: minRange,
      max: maxRange,
    },
    whyRecommended,
    scenarios: {
      conservative: scenarioConservative,
      recommended: scenarioRecommended,
      aggressive: scenarioAggressive,
    },
  };
}
