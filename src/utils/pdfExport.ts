import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { KprParameters, SimulationMode, PaymentInterval, SimulationResult } from '../types/kpr';
import { UserFinancialProfile } from '../types/financialHealth';
import { assessFinancialHealth } from './financialAdvisor';
import { formatRupiah, formatBulanTahun } from './calculator';

interface ExportPdfOptions {
  params: KprParameters;
  extraAnnual: number;
  interval: PaymentInterval;
  mode: SimulationMode;
  baseline: SimulationResult;
  simulated: SimulationResult;
  profile?: UserFinancialProfile;
}

export function exportKprSimulationToPdf({
  params,
  extraAnnual,
  interval,
  mode,
  baseline,
  simulated,
  profile,
}: ExportPdfOptions) {
  // Buat dokumen PDF A4 Portrait
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const diffBulan = Math.max(0, baseline.bulanLunas - simulated.bulanLunas);
  const hematBunga = Math.max(0, baseline.totalBunga - simulated.totalBunga);
  const netHemat = Math.max(0, baseline.totalPengeluaran - simulated.totalPengeluaran);

  let intervalStr = 'Setiap Tahun (Akhir Bulan 12, 24, dst.)';
  if (interval === 6) intervalStr = 'Setiap 6 Bulan';
  if (interval === 1) intervalStr = 'Setiap Bulan';

  // --- HEADER SECTION (BCA Blue theme) ---
  doc.setFillColor(0, 96, 175); // BCA Blue #0060AF
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('KPR EXTRA PAYMENT SIMULATOR', 14, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Laporan Hasil Simulasi Amortisasi & Percepatan Pelunasan (SP3K BCA)', 14, 18);

  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  doc.setFontSize(8);
  doc.text(`Tanggal Cetak: ${dateStr}`, pageWidth - 14, 18, { align: 'right' });

  let startY = 35;

  // --- EXECUTIVE SUMMARY CARDS ---
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('1. RINGKASAN EKSEKUTIF SIMULASI', 14, startY);

  startY += 5;

  // Draw summary boxes (4 metric boxes)
  const boxWidth = (pageWidth - 28 - 9) / 4;
  const boxHeight = 19;

  const metrics = [
    {
      label: 'Plafon Pinjaman',
      val: formatRupiah(params.plafon),
      sub: `${params.tenorBulan / 12} Thn (${params.tenorBulan} Bln)`,
    },
    {
      label: 'Extra Pokok / Tahun',
      val: formatRupiah(extraAnnual),
      sub: intervalStr.split('(')[0].trim(),
    },
    {
      label: mode === 'A' ? 'Masa Tenor Baru' : 'Cicilan Terakhir',
      val: mode === 'A' ? formatBulanTahun(simulated.bulanLunas) : formatRupiah(simulated.cicilanAkhir),
      sub: mode === 'A' ? `Pangkas ${formatBulanTahun(diffBulan)}` : 'Tenor Tetap 20 Thn',
    },
    {
      label: 'Estimasi Hemat Bunga',
      val: formatRupiah(hematBunga),
      sub: `Net Kas: ${formatRupiah(netHemat)}`,
    },
  ];

  metrics.forEach((m, idx) => {
    const x = 14 + idx * (boxWidth + 3);
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.roundedRect(x, startY, boxWidth, boxHeight, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(m.label.toUpperCase(), x + 3, startY + 5);

    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(m.val, x + 3, startY + 11);

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(16, 185, 129); // emerald-600
    doc.text(m.sub, x + 3, startY + 16);
  });

  startY += boxHeight + 8;

  // --- PERBANDINGAN BERDAMPINGAN (TABLE) ---
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('2. PERBANDINGAN: TANPA EXTRA VS DENGAN EXTRA PAYMENT', 14, startY);

  const comparisonRows = [
    [
      'Masa Kredit (Tenor)',
      `${params.tenorBulan / 12} Tahun (${params.tenorBulan} Bulan)`,
      `${formatBulanTahun(simulated.bulanLunas)} (${simulated.bulanLunas} Bulan)`,
      diffBulan > 0 ? `Lebih Cepat ${formatBulanTahun(diffBulan)}` : 'Sama (20 Tahun)',
    ],
    [
      'Total Bunga Dibayar',
      formatRupiah(baseline.totalBunga),
      formatRupiah(simulated.totalBunga),
      hematBunga > 0 ? `Hemat ${formatRupiah(hematBunga)}` : 'Rp0',
    ],
    [
      'Total Pembayaran Pokok',
      formatRupiah(params.plafon),
      formatRupiah(params.plafon),
      'Tetap (Sesuai Plafon)',
    ],
    [
      'Total Extra Pokok Disetor',
      'Rp0',
      formatRupiah(simulated.totalExtra),
      `+${formatRupiah(simulated.totalExtra)}`,
    ],
    [
      'Total Seluruh Kas Keluar',
      formatRupiah(baseline.totalPengeluaran),
      formatRupiah(simulated.totalPengeluaran),
      netHemat > 0 ? `Net Penghematan ${formatRupiah(netHemat)}` : 'Rp0',
    ],
  ];

  autoTable(doc, {
    startY: startY + 3,
    head: [
      [
        'Parameter Evaluasi',
        'Tanpa Extra (SP3K)',
        `Dengan Extra (${formatRupiah(extraAnnual)}/thn)`,
        'Selisih Keuntungan',
      ],
    ],
    body: comparisonRows,
    theme: 'grid',
    headStyles: {
      fillColor: [0, 96, 175],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
    },
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 14, right: 14 },
  });

  let currentY = (doc as any).lastAutoTable.finalY + 8;

  // --- PARAMETER SUKU BUNGA KPR ---
  let structureTitle = '3. STRUKTUR SUKU BUNGA & CICILAN (Fix Berjenjang SP3K BCA)';
  let structureHeaders = ['Periode', 'Jangka Waktu', 'Suku Bunga (% p.a)', 'Cicilan Bulanan', 'Keterangan'];
  let structureRows: string[][] = [];

  if (params.interestType === 'single_fixed') {
    structureTitle = '3. STRUKTUR SUKU BUNGA & CICILAN (Fixed Sepanjang Tenor)';
    structureHeaders = ['Deskripsi', 'Tenor', 'Suku Bunga (% p.a)', 'Cicilan Bulanan', 'Skema'];
    structureRows = [
      [
        'Fixed Anuitas Tetap',
        `${params.tenorBulan / 12} Tahun (${params.tenorBulan} Bulan)`,
        `${(params.singleFixedRate * 100).toFixed(2)}% p.a.`,
        formatRupiah(simulated.cicilanAwal),
        'Cicilan sama rata dari bulan 1 sampai lunas',
      ],
    ];
  } else if (params.interestType === 'floating') {
    structureTitle = '3. STRUKTUR SUKU BUNGA & CICILAN (Promo Fixed + Floating)';
    structureHeaders = ['Tahap', 'Jangka Waktu', 'Suku Bunga (% p.a)', 'Cicilan Bulanan', 'Keterangan'];
    structureRows = [
      [
        'Promo Fixed',
        `Bulan 1 s/d ${params.fixDurationMonths} (${params.fixDurationMonths / 12} Thn)`,
        `${(params.fixRate * 100).toFixed(2)}% p.a.`,
        formatRupiah(simulated.cicilanAwal),
        'Suku bunga promo awal',
      ],
      [
        'Floating Pasar',
        `Bulan ${params.fixDurationMonths + 1} s/d ${params.tenorBulan}`,
        `${(params.floatingRate * 100).toFixed(2)}% p.a.`,
        'Mengikuti pasar & sisa pokok',
        'Mengambang sesuai suku bunga acuan bank',
      ],
    ];
  } else if (params.interestType === 'flat') {
    structureTitle = '3. STRUKTUR SUKU BUNGA & CICILAN (Bunga Flat Murni)';
    structureHeaders = ['Komponen', 'Nominal / Persentase', 'Keterangan'];
    const pBulan = params.plafon / params.tenorBulan;
    const bBulan = (params.plafon * params.flatAnnualRate) / 12;
    structureRows = [
      ['Suku Bunga Flat', `${(params.flatAnnualRate * 100).toFixed(2)}% flat p.a.`, `Setara bunga efektif ~${(params.flatAnnualRate * 1.83 * 100).toFixed(1)}% p.a.`],
      ['Angsuran Pokok Bulanan', formatRupiah(pBulan), 'Plafon / Tenor (Konstan)'],
      ['Angsuran Bunga Bulanan', formatRupiah(bBulan), 'Dihitung tetap dari plafon awal pinjaman'],
      ['Total Cicilan Bulanan', formatRupiah(pBulan + bBulan), 'Pokok + Bunga tetap setiap bulan'],
    ];
  } else {
    // Tiered
    structureRows = [
      [
        'Periode 1',
        `Bulan 1 s/d ${params.p1.durasiBulan} (${params.p1.durasiBulan / 12} Thn)`,
        `${(params.p1.bungaTahunan * 100).toFixed(2)}% p.a.`,
        formatRupiah(params.p1.cicilanBulanan),
        'Fixed Tahap 1',
      ],
      [
        'Periode 2',
        `Bulan ${params.p1.durasiBulan + 1} s/d ${params.p1.durasiBulan + params.p2.durasiBulan} (${params.p2.durasiBulan / 12} Thn)`,
        `${(params.p2.bungaTahunan * 100).toFixed(2)}% p.a.`,
        formatRupiah(params.p2.cicilanBulanan),
        'Fixed Tahap 2',
      ],
      [
        'Periode 3',
        `Bulan ${params.p1.durasiBulan + params.p2.durasiBulan + 1} s/d ${params.tenorBulan} (${params.p3.durasiBulan / 12} Thn)`,
        `${(params.p3.bungaTahunan * 100).toFixed(2)}% p.a.`,
        formatRupiah(params.p3.cicilanBulanan),
        'Fixed Tahap 3 / Pelunasan',
      ],
    ];
  }

  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(structureTitle, 14, currentY);

  autoTable(doc, {
    startY: currentY + 3,
    head: [structureHeaders],
    body: structureRows,
    theme: 'grid',
    headStyles: {
      fillColor: [51, 65, 85], // slate-700
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
    },
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    margin: { left: 14, right: 14 },
  });

  // --- HALAMAN FINANCIAL HEALTH ASSESSMENT (JIKA PROFILE TERSEDIA) ---
  if (profile) {
    const assess = assessFinancialHealth({
      profile,
      kprParams: params,
      extraAnnualTarget: extraAnnual,
      interval,
      mode,
      baseline,
      simulated,
    });

    doc.addPage();

    // Header Financial Health (Emerald theme)
    doc.setFillColor(16, 185, 129);
    doc.rect(0, 0, pageWidth, 22, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('FINANCIAL HEALTH & CAPACITY ASSESSMENT', 14, 10);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Evaluasi Kelayakan Extra Payment, Cash Flow Bulanan & Rekomendasi Alokasi Berkelanjutan', 14, 16);

    let healthY = 28;

    // 1. Health Status Banner
    const isHealthy = assess.healthStatus === 'healthy';
    const isCaution = assess.healthStatus === 'caution';
    const bannerColor = isHealthy ? [209, 250, 229] : isCaution ? [254, 243, 199] : [255, 228, 230];
    const bannerTextColor = isHealthy ? [6, 95, 70] : isCaution ? [146, 64, 14] : [159, 18, 57];

    doc.setFillColor(bannerColor[0], bannerColor[1], bannerColor[2]);
    doc.roundedRect(14, healthY, pageWidth - 28, 18, 3, 3, 'F');
    doc.setTextColor(bannerTextColor[0], bannerTextColor[1], bannerTextColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    const statusLabel = isHealthy ? 'STATUS: SEHAT (RELEVAN & AMAN)' : isCaution ? 'STATUS: PERLU DIPERTIMBANGKAN' : 'STATUS: TERLALU AGRESIF / BERISIKO';
    doc.text(`${statusLabel} · Skor Finansial: ${assess.healthScore}/100`, 18, healthY + 7);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(doc.splitTextToSize(assess.healthExplanation, pageWidth - 36), 18, healthY + 12);

    healthY += 24;

    // 2. Cash Flow Waterfall & Rincian Kapasitas
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('1. STRUKTUR CASH FLOW & SISA BUFFER BULANAN', 14, healthY);

    const cashFlowRows = [
      ['Total Penghasilan Bersih Bulanan', formatRupiah(assess.totalIncome), 'Take-home pay & penghasilan tambahan'],
      ['Pengeluaran Rutin Bulanan', `-${formatRupiah(assess.totalExpenses)}`, 'Kebutuhan pokok, utilitas, transportasi'],
      ['Cicilan KPR Berjalan', `-${formatRupiah(assess.cicilanKprCurrent)}`, 'Kewajiban angsuran KPR aktif'],
      ['Cicilan / Utang Lain (Non-KPR)', `-${formatRupiah(assess.totalOtherDebts)}`, 'Kendaraan, kartu kredit, pinjaman'],
      ['= Disposable Income (Surplus Kas)', formatRupiah(assess.disposableIncome), 'Kapasitas kas sebelum extra payment'],
      ['Target Extra Payment Anda', `${formatRupiah(extraAnnual)}/thn (Setara ${formatRupiah(assess.extraMonthlyEquivalent)}/bln)`, 'Alokasi yang sedang disimulasikan'],
      ['= Sisa Financial Buffer Bulanan', `${formatRupiah(assess.remainingBuffer)}/bln`, assess.remainingBuffer >= 1_500_000 ? 'Kategori: Aman' : 'Kategori: Ketat/Waspada'],
      ['Cakupan Dana Darurat', `±${assess.emergencyFundMonths.toFixed(1)} Bulan Pengeluaran`, `Kategori: ${assess.emergencyCategory.toUpperCase()}`],
      ['Rasio Total Cicilan Utang (DTI)', `${(assess.dtiRatio * 100).toFixed(0)}% dari Penghasilan`, assess.dtiRatio <= 0.4 ? 'Ambang batas aman perbankan' : 'Beban utang tinggi (>40%)'],
    ];

    autoTable(doc, {
      startY: healthY + 3,
      head: [['Indikator Keuangan', 'Nilai Nominal', 'Keterangan Evaluasi']],
      body: cashFlowRows,
      theme: 'grid',
      headStyles: {
        fillColor: [30, 41, 59],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 7.5,
      },
      styles: {
        fontSize: 7.5,
        cellPadding: 1.6,
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 65 },
        1: { halign: 'right', fontStyle: 'bold', cellWidth: 55 },
        2: { cellWidth: 'auto' },
      },
      didParseCell: (data) => {
        if (data.row.index === 4) {
          data.cell.styles.fillColor = [238, 242, 255];
        } else if (data.row.index === 6) {
          data.cell.styles.fillColor = assess.remainingBuffer >= 1_000_000 ? [209, 250, 229] : [254, 243, 199];
        }
      },
      margin: { left: 14, right: 14 },
    });

    healthY = (doc as any).lastAutoTable.finalY + 8;

    // 3. Rekomendasi Seimbang & Alasan
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('2. REKOMENDASI ALOKASI SEIMBANG (OPTIMAL RANGE)', 14, healthY);

    healthY += 4;
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(14, healthY, pageWidth - 28, 18, 2, 2, 'F');
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(`Target Rekomendasi Seimbang: ${formatRupiah(assess.recommendedExtraAnnual)} / tahun (Setara ${formatRupiah(assess.recommendedExtraAnnual / 12)} / bulan)`, 18, healthY + 6);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(doc.splitTextToSize(`Mengapa angka ini direkomendasikan? ${assess.whyRecommended}`, pageWidth - 36), 18, healthY + 11);

    healthY += 23;

    // 4. Tabel 3 Skenario Rekomendasi
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('3. PERBANDINGAN 3 SKENARIO REKOMENDASI KPR', 14, healthY);

    const scenarioRows = [
      [
        'Konservatif',
        `${formatRupiah(assess.scenarios.conservative.extraAnnual)}/thn`,
        `${assess.scenarios.conservative.estimasiTenorTahun} Thn (${assess.scenarios.conservative.estimasiTenorBulan} Bln)`,
        formatRupiah(assess.scenarios.conservative.hematBunga),
        `${formatRupiah(assess.scenarios.conservative.remainingBuffer)}/bln`,
        'Rendah (Likuiditas Maksimal)',
      ],
      [
        'Seimbang (Recommended)',
        `${formatRupiah(assess.scenarios.recommended.extraAnnual)}/thn`,
        `${assess.scenarios.recommended.estimasiTenorTahun} Thn (${assess.scenarios.recommended.estimasiTenorBulan} Bln)`,
        formatRupiah(assess.scenarios.recommended.hematBunga),
        `${formatRupiah(assess.scenarios.recommended.remainingBuffer)}/bln`,
        'Sedang (Trade-off Optimal)',
      ],
      [
        'Agresif',
        `${formatRupiah(assess.scenarios.aggressive.extraAnnual)}/thn`,
        `${assess.scenarios.aggressive.estimasiTenorTahun} Thn (${assess.scenarios.aggressive.estimasiTenorBulan} Bln)`,
        formatRupiah(assess.scenarios.aggressive.hematBunga),
        `${formatRupiah(assess.scenarios.aggressive.remainingBuffer)}/bln`,
        'Tinggi (Buffer Sangat Ketat)',
      ],
    ];

    autoTable(doc, {
      startY: healthY + 3,
      head: [['Skenario', 'Extra/Tahun', 'Tenor Baru', 'Hemat Bunga', 'Sisa Buffer Kas', 'Dampak Cash Flow']],
      body: scenarioRows,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 96, 175],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 7.5,
        halign: 'center',
      },
      styles: {
        fontSize: 7.5,
        cellPadding: 1.8,
      },
      columnStyles: {
        0: { fontStyle: 'bold' },
        1: { halign: 'right' },
        2: { halign: 'center' },
        3: { halign: 'right', fontStyle: 'bold', textColor: [16, 185, 129] },
        4: { halign: 'right', fontStyle: 'bold' },
        5: { halign: 'center' },
      },
      margin: { left: 14, right: 14 },
    });

    healthY = (doc as any).lastAutoTable.finalY + 6;

    // 5. Catatan Edukasi & Prinsip Berkelanjutan
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(
      '*Prinsip Finansial: "KPR cepat lunas itu bagus, tapi jangan sampai membuat kondisi keuangan harian menjadi rapuh." Keputusan extra payment bersifat dinamis dan dapat disesuaikan setiap tahun sesuai situasi riil keluarga Anda.',
      14,
      healthY,
      { maxWidth: pageWidth - 28 }
    );
  }

  // --- HALAMAN BARU: JADWAL TABEL AMORTISASI BULANAN ---
  doc.addPage();

  doc.setFillColor(0, 96, 175);
  doc.rect(0, 0, pageWidth, 16, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('5. JADWAL TABEL AMORTISASI BULANAN LENGKAP (Bulan 1 s/d Lunas)', 14, 11);

  const amortHeaders = [
    'Bln',
    'Thn',
    'Rate',
    'Saldo Awal',
    'Cicilan',
    'Bunga',
    'Pokok Cicilan',
    'Extra Pokok',
    'Total Pokok',
    'Saldo Akhir',
  ];

  const amortRows = simulated.schedule.map((r) => [
    r.bulan,
    `Thn ${r.tahun}`,
    `${r.sukuBungaPersen}%`,
    formatRupiah(r.saldoAwal),
    formatRupiah(r.cicilanBulanan),
    formatRupiah(r.bungaBulan),
    formatRupiah(r.pokokBulan),
    r.extraPayment > 0 ? formatRupiah(r.extraPayment) : '-',
    formatRupiah(r.totalPokokBayar),
    formatRupiah(r.saldoAkhir),
  ]);

  autoTable(doc, {
    startY: 22,
    head: [amortHeaders],
    body: amortRows,
    theme: 'striped',
    headStyles: {
      fillColor: [0, 96, 175],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7,
      halign: 'center',
    },
    styles: {
      fontSize: 6.5,
      cellPadding: 1.2,
      font: 'helvetica',
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { halign: 'center', cellWidth: 12 },
      2: { halign: 'center', cellWidth: 12 },
      3: { halign: 'right' },
      4: { halign: 'right' },
      5: { halign: 'right', textColor: [225, 29, 72] }, // rose-600
      6: { halign: 'right', textColor: [2, 132, 199] }, // blue-600
      7: { halign: 'right', fontStyle: 'bold', textColor: [16, 185, 129] }, // emerald-600
      8: { halign: 'right', fontStyle: 'bold' },
      9: { halign: 'right', fontStyle: 'bold' },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    didParseCell: (data) => {
      // Highlight milestone row bulan 36 & 72, dan bulan extra
      const rowIndex = data.row.index;
      const rowItem = simulated.schedule[rowIndex];
      if (rowItem) {
        if (rowItem.isPelunasan) {
          data.cell.styles.fillColor = [243, 232, 255]; // purple-100
          data.cell.styles.fontStyle = 'bold';
        } else if (rowItem.isExtraMonth && data.column.index === 7) {
          data.cell.styles.fillColor = [209, 250, 229]; // emerald-100
        } else if (rowItem.isMilestone && data.column.index <= 2) {
          data.cell.styles.fillColor = [254, 243, 199]; // amber-100
        }
      }
    },
    margin: { left: 10, right: 10 },
  });

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(
      `KPR Extra Payment Simulator - Model SP3K BCA | Halaman ${i} dari ${totalPages}`,
      14,
      doc.internal.pageSize.getHeight() - 6
    );
    doc.text(
      '*Simulasi ini adalah perhitungan aktuaria matematis murni. Ketentuan pelunasan dipercepat mengikuti akad kredit bank.',
      pageWidth - 14,
      doc.internal.pageSize.getHeight() - 6,
      { align: 'right' }
    );
  }

  // Trigger download
  const sanitizedFilename = `Simulasi_KPR_BCA_${formatRupiah(params.plafon).replace(/[^0-9]/g, '')}_Extra_${formatRupiah(extraAnnual).replace(/[^0-9]/g, '')}.pdf`;
  doc.save(sanitizedFilename);
}
