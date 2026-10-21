import { KprParameters, SimulationMode, PaymentInterval, SimulationResult, AmortizationRow, ScenarioItem } from '../types/kpr';

export const DEFAULT_SP3K_PARAMS: KprParameters = {
  plafon: 631000000,
  tenorBulan: 240,
  interestType: 'tiered', // default SP3K BCA: Fix Berjenjang 2.90% -> 6.99% -> 8.99%
  p1: {
    durasiBulan: 36,
    bungaTahunan: 0.029, // 2.90%
    cicilanBulanan: 3468007.54,
  },
  p2: {
    durasiBulan: 36,
    bungaTahunan: 0.0699, // 6.99%
    cicilanBulanan: 4682158.05,
  },
  p3: {
    durasiBulan: 168,
    bungaTahunan: 0.0899, // 8.99%
    cicilanBulanan: 5250632.77,
  },
  // Default values for other interest types
  singleFixedRate: 0.065, // 6.50% p.a.
  fixDurationMonths: 36, // 3 thn
  fixRate: 0.0388, // 3.88% p.a.
  floatingRate: 0.115, // 11.50% p.a.
  flatAnnualRate: 0.05, // 5.00% flat p.a.
};

/**
 * Formula PMT (Payment per period) standar aktuaria keuangan
 */
export function calculatePMT(rateMonthly: number, nMonths: number, principal: number): number {
  if (nMonths <= 0 || principal <= 0) return 0;
  if (rateMonthly === 0) return principal / nMonths;
  const factor = Math.pow(1 + rateMonthly, nMonths);
  return (principal * rateMonthly * factor) / (factor - 1);
}

/**
 * Format angka ke mata uang Rupiah Indonesia (Rp631.000.000)
 */
export function formatRupiah(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return 'Rp0';
  const rounded = Math.round(amount);
  return 'Rp' + rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Format angka singkat dalam jutaan / milyaran untuk grafik & ringkasan
 */
export function formatRupiahSingkat(amount: number): string {
  if (isNaN(amount)) return 'Rp0';
  if (Math.abs(amount) >= 1_000_000_000) {
    return 'Rp' + (amount / 1_000_000_000).toFixed(2).replace('.', ',') + ' M';
  }
  if (Math.abs(amount) >= 1_000_000) {
    return 'Rp' + (amount / 1_000_000).toFixed(1).replace('.', ',') + ' Jt';
  }
  return formatRupiah(amount);
}

/**
 * Parse string Rupiah ke number murni
 */
export function parseRupiahInput(val: string): number {
  if (!val) return 0;
  const cleaned = val.toString().replace(/[^0-9]/g, '');
  return cleaned === '' ? 0 : parseFloat(cleaned);
}

/**
 * Format durasi bulan ke bentuk "X Tahun Y Bulan"
 */
export function formatBulanTahun(totalBulan: number): string {
  if (!totalBulan || totalBulan <= 0) return '0 Bulan';
  const thn = Math.floor(totalBulan / 12);
  const bln = totalBulan % 12;
  const parts: string[] = [];
  if (thn > 0) parts.push(`${thn} Tahun`);
  if (bln > 0) parts.push(`${bln} Bulan`);
  return parts.join(' ');
}

export function isStrictBcaSp3kDefault(params: KprParameters): boolean {
  return (
    params.plafon === 631000000 &&
    params.tenorBulan === 240 &&
    params.interestType === 'tiered' &&
    Math.abs(params.p1.bungaTahunan - 0.029) < 0.0001 &&
    Math.abs(params.p2.bungaTahunan - 0.0699) < 0.0001 &&
    Math.abs(params.p3.bungaTahunan - 0.0899) < 0.0001 &&
    params.p1.durasiBulan === 36 &&
    params.p2.durasiBulan === 36
  );
}

export function recalculateTierInstallments(
  plafon: number,
  tenorBulan: number,
  p1Rate: number,
  p1Duration: number,
  p2Rate: number,
  p2Duration: number,
  p3Rate: number
) {
  const cicilan1 = calculatePMT(p1Rate / 12, tenorBulan, plafon);

  let bal = plafon;
  const r1 = p1Rate / 12;
  for (let i = 1; i <= p1Duration; i++) {
    const interest = bal * r1;
    const principal = Math.min(bal, cicilan1 - interest);
    bal -= principal;
  }

  const remainingAfterP1 = Math.max(1, tenorBulan - p1Duration);
  const cicilan2 = calculatePMT(p2Rate / 12, remainingAfterP1, bal);

  const r2 = p2Rate / 12;
  for (let i = 1; i <= p2Duration; i++) {
    const interest = bal * r2;
    const principal = Math.min(bal, cicilan2 - interest);
    bal -= principal;
  }

  const remainingAfterP2 = Math.max(1, tenorBulan - p1Duration - p2Duration);
  const cicilan3 = calculatePMT(p3Rate / 12, remainingAfterP2, bal);

  return { cicilan1, cicilan2, cicilan3 };
}

/**
 * Engine Amortisasi Bulanan Presisi yang Mendukung:
 * 1. Fix Berjenjang (SP3K BCA)
 * 2. Fixed Sepanjang Tenor (Flat Anuitas)
 * 3. Fix + Floating (Promo Tetap lalu Mengambang)
 * 4. Flat Murni Tradisional
 */
export function runAmortizationSimulation(
  params: KprParameters,
  extraAnnual: number,
  interval: PaymentInterval,
  mode: SimulationMode,
  customAnnualSchedule?: Record<number, number>
): SimulationResult {
  let saldo = params.plafon;
  const schedule: AmortizationRow[] = [];
  let totalBunga = 0;
  let totalPokok = 0;
  let totalExtra = 0;
  let totalReguler = 0;

  // Tentukan nominal per interval
  let extraPerCycle = 0;
  if (interval === 1) {
    extraPerCycle = extraAnnual / 12;
  } else if (interval === 6) {
    extraPerCycle = extraAnnual / 2;
  } else {
    extraPerCycle = extraAnnual;
  }

  let currentCicilanModeB: number | null = null;
  const isDefaultTiered = isStrictBcaSp3kDefault(params);

  const p1End = params.p1.durasiBulan;
  const p2End = p1End + params.p2.durasiBulan;

  // Initial calculation helper for non-tiered types
  let floatingInstallment: number | null = null;

  for (let m = 1; m <= params.tenorBulan; m++) {
    if (saldo <= 0.0001) break;

    const saldoAwal = saldo;
    let rateAnnual = 0;
    let defaultCicilan = 0;
    let periodeNama = '';
    let isRateMilestone = false;

    // --- Tentukan Rate & Cicilan berdasarkan interestType ---
    if (params.interestType === 'single_fixed') {
      rateAnnual = params.singleFixedRate;
      periodeNama = 'Fixed Tetap';
      const rateMonthly = rateAnnual / 12;
      defaultCicilan = calculatePMT(rateMonthly, params.tenorBulan, params.plafon);
    } else if (params.interestType === 'floating') {
      if (m <= params.fixDurationMonths) {
        rateAnnual = params.fixRate;
        periodeNama = 'Fixed Promo';
        const rateMonthly = rateAnnual / 12;
        defaultCicilan = calculatePMT(rateMonthly, params.tenorBulan, params.plafon);
      } else {
        rateAnnual = params.floatingRate;
        periodeNama = 'Floating';
        isRateMilestone = (m === params.fixDurationMonths + 1);
        const rateMonthly = rateAnnual / 12;
        const remainingMonths = params.tenorBulan - m + 1;
        // In standard banking, recalculate PMT when entering floating
        if (isRateMilestone || floatingInstallment === null) {
          floatingInstallment = calculatePMT(rateMonthly, remainingMonths, saldoAwal);
        }
        defaultCicilan = floatingInstallment;
      }
    } else if (params.interestType === 'flat') {
      rateAnnual = params.flatAnnualRate;
      periodeNama = 'Flat Murni';
      // In traditional flat loan:
      // Monthly interest is fixed from original principal: Plafon * Rate / 12
      // Monthly principal = Plafon / Tenor
      const monthlyInterestFlat = (params.plafon * params.flatAnnualRate) / 12;
      const monthlyPrincipalFlat = params.plafon / params.tenorBulan;
      defaultCicilan = monthlyPrincipalFlat + monthlyInterestFlat;
    } else {
      // Tiered (SP3K BCA atau Custom Berjenjang)
      if (m <= p1End) {
        rateAnnual = params.p1.bungaTahunan;
        defaultCicilan = isDefaultTiered
          ? params.p1.cicilanBulanan
          : calculatePMT(rateAnnual / 12, params.tenorBulan, params.plafon);
        periodeNama = 'P1 (Fixed)';
      } else if (m <= p2End) {
        rateAnnual = params.p2.bungaTahunan;
        defaultCicilan = isDefaultTiered
          ? params.p2.cicilanBulanan
          : calculatePMT(rateAnnual / 12, Math.max(1, params.tenorBulan - p1End), saldoAwal);
        periodeNama = 'P2 (Fixed)';
        isRateMilestone = (m === p1End + 1);
      } else {
        rateAnnual = params.p3.bungaTahunan;
        defaultCicilan = isDefaultTiered
          ? params.p3.cicilanBulanan
          : calculatePMT(rateAnnual / 12, Math.max(1, params.tenorBulan - p2End), saldoAwal);
        periodeNama = 'P3 (Fixed)';
        isRateMilestone = (m === p2End + 1);
      }
    }

    const rateMonthly = rateAnnual / 12;

    // --- MODE B: Recalculate Cicilan setiap kali pokok berkurang atau rate berganti ---
    if (mode === 'B' && params.interestType !== 'flat') {
      if (m === 1 || isRateMilestone || currentCicilanModeB === null) {
        const remainingMonths = params.tenorBulan - m + 1;
        currentCicilanModeB = calculatePMT(rateMonthly, remainingMonths, saldoAwal);
      }
    }

    const targetCicilan = (mode === 'B' && params.interestType !== 'flat')
      ? (currentCicilanModeB ?? defaultCicilan)
      : defaultCicilan;

    let bungaBulan = 0;
    let pokokBulan = 0;
    let cicilanActual = targetCicilan;

    if (params.interestType === 'flat') {
      // Flat rate formula
      bungaBulan = (params.plafon * params.flatAnnualRate) / 12;
      const plannedPokok = params.plafon / params.tenorBulan;
      if (saldoAwal < plannedPokok) {
        pokokBulan = saldoAwal;
        cicilanActual = pokokBulan + bungaBulan;
        saldo = 0;
      } else {
        pokokBulan = plannedPokok;
        saldo = saldoAwal - pokokBulan;
      }
    } else {
      // Anuitas / Efektif Formula (Standard Banking)
      bungaBulan = saldoAwal * rateMonthly;
      if (saldoAwal + bungaBulan < targetCicilan) {
        pokokBulan = saldoAwal;
        cicilanActual = pokokBulan + bungaBulan;
        saldo = 0;
      } else {
        pokokBulan = targetCicilan - bungaBulan;
        saldo = saldoAwal - pokokBulan;
      }
    }

    // Jadwal Extra Payment
    let isExtraMonth = false;
    if (interval === 1) {
      isExtraMonth = true;
    } else if (m % interval === 0) {
      isExtraMonth = true;
    }

    const currentYear = Math.ceil(m / 12);
    let targetExtraThisCycle = extraPerCycle;
    if (customAnnualSchedule && customAnnualSchedule[currentYear] !== undefined) {
      const yearNominal = customAnnualSchedule[currentYear];
      if (interval === 1) {
        targetExtraThisCycle = yearNominal / 12;
      } else if (interval === 6) {
        targetExtraThisCycle = yearNominal / 2;
      } else {
        targetExtraThisCycle = yearNominal;
      }
    }

    let actualExtra = 0;
    if (isExtraMonth && saldo > 0 && targetExtraThisCycle > 0) {
      if (saldo < targetExtraThisCycle) {
        actualExtra = saldo;
        saldo = 0;
      } else {
        actualExtra = targetExtraThisCycle;
        saldo -= actualExtra;
      }

      // Mode B: jika ada extra payment, recalculate cicilan untuk sisa tenor berikutnya
      if (mode === 'B' && saldo > 0 && m < params.tenorBulan && params.interestType !== 'flat') {
        const remainingMonthsAfterExtra = params.tenorBulan - m;
        currentCicilanModeB = calculatePMT(rateMonthly, remainingMonthsAfterExtra, saldo);
      }
    }

    totalBunga += bungaBulan;
    totalPokok += pokokBulan;
    totalExtra += actualExtra;
    totalReguler += cicilanActual;

    const isLunas = saldo <= 0.0001;

    schedule.push({
      bulan: m,
      tahun: Math.ceil(m / 12),
      periodeNama,
      sukuBungaPersen: Number((rateAnnual * 100).toFixed(2)),
      saldoAwal,
      cicilanBulanan: cicilanActual,
      bungaBulan,
      pokokBulan,
      extraPayment: actualExtra,
      totalPokokBayar: pokokBulan + actualExtra,
      saldoAkhir: Math.max(0, saldo),
      isExtraMonth: actualExtra > 0,
      isMilestone: isRateMilestone || m === 36 || m === 72,
      isPelunasan: isLunas,
    });

    if (isLunas) break;
  }

  return {
    mode,
    bulanLunas: schedule.length,
    totalBunga,
    totalPokok,
    totalExtra,
    totalPengeluaran: totalReguler + totalExtra,
    cicilanAwal: schedule.length > 0 ? schedule[0].cicilanBulanan : 0,
    cicilanAkhir: schedule.length > 0 ? schedule[schedule.length - 1].cicilanBulanan : 0,
    schedule,
  };
}

/**
 * Reverse Numerical Search (Binary Search):
 * Mencari nominal extra payment tahunan yang menghasilkan target pemotongan tenor X tahun
 */
export function findExtraForTargetYears(
  params: KprParameters,
  targetPangkasYears: number,
  interval: PaymentInterval = 12
): {
  extraAnnualNeeded: number;
  targetBulan: number;
  testResult: SimulationResult;
} {
  const maxTenorMonths = params.tenorBulan;
  const targetMonths = Math.max(12, maxTenorMonths - targetPangkasYears * 12);

  let low = 0;
  let high = Math.max(500_000_000, params.plafon);
  let best = high;

  for (let i = 0; i < 40; i++) {
    const mid = (low + high) / 2;
    const sim = runAmortizationSimulation(params, mid, interval, 'A');

    if (sim.bulanLunas <= targetMonths) {
      best = mid;
      high = mid; // cari yang lebih hemat tapi tetap mencapai target
    } else {
      low = mid;
    }
  }

  // Bulatkan ke ratusan ribu rupiah terdekat untuk kenyamanan user
  const roundedExtra = Math.round(best / 100_000) * 100_000;
  const finalSim = runAmortizationSimulation(params, roundedExtra, interval, 'A');

  return {
    extraAnnualNeeded: roundedExtra,
    targetBulan: targetMonths,
    testResult: finalSim,
  };
}

/**
 * Generate Scenario Table Data untuk preset extra payment
 */
export function generateScenarioItems(
  params: KprParameters,
  interval: PaymentInterval,
  mode: SimulationMode,
  baseline: SimulationResult
): ScenarioItem[] {
  const presets = [0, 5_000_000, 10_000_000, 15_000_000, 20_000_000, 25_000_000, 30_000_000, 40_000_000, 50_000_000, 75_000_000, 100_000_000];

  return presets.map((amt) => {
    const sim = runAmortizationSimulation(params, amt, interval, mode);
    const pangkas = Math.max(0, baseline.bulanLunas - sim.bulanLunas);
    const hematBunga = Math.max(0, baseline.totalBunga - sim.totalBunga);

    return {
      extraAnnual: amt,
      bulanLunas: sim.bulanLunas,
      penguranganBulan: pangkas,
      totalBunga: sim.totalBunga,
      hematBunga,
      totalExtra: sim.totalExtra,
      totalPengeluaran: sim.totalPengeluaran,
    };
  });
}
