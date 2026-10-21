export type SimulationMode = 'A' | 'B';

export type PaymentInterval = 1 | 6 | 12;

export type InterestType = 'tiered' | 'single_fixed' | 'floating' | 'flat';

export interface TierPeriod {
  startMonth: number;
  endMonth: number;
  durasiBulan: number;
  bungaTahunan: number; // e.g. 0.0290 for 2.90%
  cicilanBulanan: number; // e.g. 3468007.54
  label: string;
}

export interface KprParameters {
  plafon: number;
  tenorBulan: number;
  interestType: InterestType; // 'tiered' | 'single_fixed' | 'floating' | 'flat'
  
  // 1. Fix Berjenjang (SP3K BCA Default)
  p1: {
    durasiBulan: number;
    bungaTahunan: number;
    cicilanBulanan: number;
  };
  p2: {
    durasiBulan: number;
    bungaTahunan: number;
    cicilanBulanan: number;
  };
  p3: {
    durasiBulan: number;
    bungaTahunan: number;
    cicilanBulanan: number;
  };

  // 2. Fixed Sepanjang Tenor (Flat Anuitas / Single Fixed Rate)
  singleFixedRate: number; // e.g. 0.065 (6.5%)

  // 3. Fix + Floating (Promo Tetap lalu Mengambang)
  fixDurationMonths: number; // e.g. 36 (3 tahun)
  fixRate: number; // e.g. 0.0388 (3.88%)
  floatingRate: number; // e.g. 0.115 (11.50%)

  // 4. Flat Murni Tradisional (Bunga dari plafon awal)
  flatAnnualRate: number; // e.g. 0.05 (5.0%)
}

export interface AmortizationRow {
  bulan: number;
  tahun: number;
  periodeNama: string;
  sukuBungaPersen: number;
  saldoAwal: number;
  cicilanBulanan: number;
  bungaBulan: number;
  pokokBulan: number;
  extraPayment: number;
  totalPokokBayar: number;
  saldoAkhir: number;
  isExtraMonth: boolean;
  isMilestone: boolean;
  isPelunasan: boolean;
}

export interface SimulationResult {
  mode: SimulationMode;
  bulanLunas: number;
  totalBunga: number;
  totalPokok: number;
  totalExtra: number;
  totalPengeluaran: number;
  cicilanAwal: number;
  cicilanAkhir: number;
  schedule: AmortizationRow[];
}

export interface ScenarioItem {
  extraAnnual: number;
  bulanLunas: number;
  penguranganBulan: number;
  totalBunga: number;
  hematBunga: number;
  totalExtra: number;
  totalPengeluaran: number;
}
