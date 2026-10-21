export interface IncomeProfile {
  gajiBersih: number; // Take-home pay bulanan
  penghasilanTambahan: number; // Side hustle / freelance per bulan
  penghasilanPasangan: number; // Gaji pasangan jika joint income
  bonusTahunan: number; // Bonus tahunan / THR (di-amortisasi per bulan jika diaktifkan)
  includeBonusInMonthly: boolean;
}

export interface ExpenseProfile {
  makanRumahTangga: number;
  transportasi: number;
  listrikAirInternet: number;
  pendidikan: number;
  asuransiKesehatan: number;
  anakKeluarga: number;
  gayaHidup: number;
  pengeluaranLainnya: number;
}

export interface DebtProfile {
  cicilanKendaraan: number;
  kartuKredit: number;
  pinjamanPribadi: number;
  paylater: number;
  cicilanLainnya: number;
}

export interface AssetsProfile {
  tabunganCash: number;
  danaDarurat: number;
  investasiLikuid: number;
  isEmergencyFundUsable: boolean; // Konfirmasi apakah dana darurat bisa diakses segera
}

export interface UserFinancialProfile {
  income: IncomeProfile;
  expenses: ExpenseProfile;
  debts: DebtProfile;
  assets: AssetsProfile;
}

export type HealthStatusLevel = 'healthy' | 'caution' | 'aggressive';
export type EmergencyCategory = 'low' | 'moderate' | 'strong';

export interface RecommendedScenario {
  id: 'conservative' | 'recommended' | 'aggressive';
  title: string;
  tagline: string;
  extraAnnual: number;
  extraMonthlyEquivalent: number;
  remainingBuffer: number;
  bufferPercentage: number;
  estimasiTenorBulan: number;
  estimasiTenorTahun: number;
  hematBunga: number;
  cashFlowImpact: 'Rendah' | 'Sedang' | 'Tinggi';
  status: HealthStatusLevel;
  description: string;
}

export interface FinancialAssessmentResult {
  // Cashflow Totals
  totalIncome: number;
  totalExpenses: number;
  totalOtherDebts: number;
  cicilanKprCurrent: number;
  totalKewajibanBulanan: number; // expenses + kpr + other debts
  disposableIncome: number; // Surplus sebelum extra payment

  // Extra Payment Impact
  extraAnnualTarget: number;
  extraMonthlyEquivalent: number;
  remainingBuffer: number; // disposableIncome - extraMonthlyEquivalent
  bufferRatio: number; // remainingBuffer / disposableIncome (0 - 1)
  extraShareOfSurplus: number; // extraMonthlyEquivalent / disposableIncome

  // Debt to Income
  totalMonthlyDebt: number; // kpr + other debts
  dtiRatio: number; // totalMonthlyDebt / totalIncome

  // Emergency Fund
  effectiveEmergencyFund: number;
  emergencyFundMonths: number; // danaDarurat / totalKewajibanBulanan
  emergencyCategory: EmergencyCategory;

  // Overall Health Score & Assessment
  healthScore: number; // 0 - 100
  healthStatus: HealthStatusLevel;
  healthHeadline: string;
  healthExplanation: string;
  insights: string[];
  warnings: string[];

  // Deterministic Recommendation Range
  recommendedExtraAnnual: number;
  recommendedRange: {
    min: number;
    max: number;
  };
  whyRecommended: string;

  // 3 Deterministic Scenarios
  scenarios: {
    conservative: RecommendedScenario;
    recommended: RecommendedScenario;
    aggressive: RecommendedScenario;
  };
}

export interface FlexibleYearItem {
  tahun: number;
  nominalExtra: number;
  keterangan: string;
}
