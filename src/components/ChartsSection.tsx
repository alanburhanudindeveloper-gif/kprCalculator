import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, ChartConfiguration } from 'chart.js/auto';
import { LineChart, BarChart3, TrendingDown } from 'lucide-react';
import { SimulationResult, KprParameters, SimulationMode } from '../types/kpr';
import { formatRupiah, runAmortizationSimulation } from '../utils/calculator';

interface ChartsSectionProps {
  params: KprParameters;
  baseline: SimulationResult;
  simulated: SimulationResult;
  mode: SimulationMode;
  isDarkMode?: boolean;
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({
  params,
  baseline,
  simulated,
  mode,
  isDarkMode = false,
}) => {
  const canvasRef1 = useRef<HTMLCanvasElement | null>(null);
  const canvasRef2 = useRef<HTMLCanvasElement | null>(null);
  const canvasRef3 = useRef<HTMLCanvasElement | null>(null);

  const chartInst1 = useRef<ChartJS | null>(null);
  const chartInst2 = useRef<ChartJS | null>(null);
  const chartInst3 = useRef<ChartJS | null>(null);

  const gridColor = isDarkMode ? '#1e293b' : '#f1f5f9';
  const textColor = isDarkMode ? '#94a3b8' : '#64748b';
  const legendColor = isDarkMode ? '#e2e8f0' : '#334155';
  const tooltipBg = isDarkMode ? '#0f172a' : '#1e293b';

  useEffect(() => {
    // 1. DATA GRAPH 1: Saldo Pokok vs Waktu
    if (canvasRef1.current) {
      if (chartInst1.current) chartInst1.current.destroy();

      const maxYears = params.tenorBulan / 12;
      const labelsYear: string[] = [];
      const basePoints: number[] = [];
      const simPoints: number[] = [];

      for (let y = 0; y <= maxYears; y++) {
        labelsYear.push(`Thn ${y}`);
        const m = y * 12;

        if (m === 0) {
          basePoints.push(params.plafon);
          simPoints.push(params.plafon);
        } else {
          const bItem = baseline.schedule.find((x) => x.bulan === m);
          basePoints.push(bItem ? bItem.saldoAkhir : 0);

          const sItem = simulated.schedule.find((x) => x.bulan === m);
          simPoints.push(sItem ? sItem.saldoAkhir : 0);
        }
      }

      const config1: ChartConfiguration<'line'> = {
        type: 'line',
        data: {
          labels: labelsYear,
          datasets: [
            {
              label: 'Tanpa Extra (SP3K)',
              data: basePoints,
              borderColor: isDarkMode ? '#64748b' : '#94a3b8',
              backgroundColor: isDarkMode
                ? 'rgba(100, 116, 139, 0.08)'
                : 'rgba(148, 163, 184, 0.08)',
              borderDash: [5, 5],
              borderWidth: 2,
              pointRadius: 2,
              tension: 0.2,
            },
            {
              label: 'Dengan Extra Payment',
              data: simPoints,
              borderColor: isDarkMode ? '#38bdf8' : '#0060af',
              backgroundColor: isDarkMode
                ? 'rgba(56, 189, 248, 0.15)'
                : 'rgba(0, 96, 175, 0.12)',
              fill: true,
              borderWidth: 2.5,
              pointRadius: 3,
              tension: 0.2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                boxWidth: 12,
                color: legendColor,
                font: { size: 11, family: 'Plus Jakarta Sans' },
              },
            },
            tooltip: {
              backgroundColor: tooltipBg,
              titleColor: '#ffffff',
              bodyColor: '#e2e8f0',
              callbacks: {
                label: (ctx) => `${ctx.dataset.label}: ${formatRupiah(ctx.parsed.y ?? 0)}`,
              },
            },
          },
          scales: {
            y: {
              ticks: {
                color: textColor,
                callback: (val) => `Rp ${(Number(val) / 1_000_000).toFixed(0)} Jt`,
                font: { size: 10 },
              },
              grid: { color: gridColor },
            },
            x: {
              grid: { display: false },
              ticks: { color: textColor, font: { size: 10 } },
            },
          },
        },
      };

      chartInst1.current = new ChartJS(canvasRef1.current, config1);
    }

    // 2. DATA GRAPH 2 & 3: Multi-scenario analysis
    const testAmounts = [0, 5_000_000, 10_000_000, 20_000_000, 30_000_000, 50_000_000, 75_000_000, 100_000_000];
    const testLabels = testAmounts.map((a) => (a === 0 ? 'Rp0' : `${a / 1_000_000}Jt`));

    const bungaData: number[] = [];
    const tenorData: number[] = [];

    testAmounts.forEach((amt) => {
      const res = runAmortizationSimulation(params, amt, 12, mode);
      bungaData.push(res.totalBunga);
      tenorData.push(res.bulanLunas / 12);
    });

    // Graph 2: Bar Chart Total Bunga vs Extra
    if (canvasRef2.current) {
      if (chartInst2.current) chartInst2.current.destroy();

      const config2: ChartConfiguration<'bar'> = {
        type: 'bar',
        data: {
          labels: testLabels,
          datasets: [
            {
              label: 'Total Bunga Dibayar (Rp)',
              data: bungaData,
              backgroundColor: isDarkMode ? '#10b981' : '#059669',
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: tooltipBg,
              titleColor: '#ffffff',
              bodyColor: '#e2e8f0',
              callbacks: {
                label: (ctx) => `Total Bunga: ${formatRupiah(ctx.parsed.y ?? 0)}`,
              },
            },
          },
          scales: {
            y: {
              ticks: {
                color: textColor,
                callback: (val) => `${(Number(val) / 1_000_000).toFixed(0)} Jt`,
                font: { size: 10 },
              },
              grid: { color: gridColor },
            },
            x: {
              grid: { display: false },
              ticks: { color: textColor, font: { size: 10 } },
            },
          },
        },
      };

      chartInst2.current = new ChartJS(canvasRef2.current, config2);
    }

    // Graph 3: Line Chart Tenor vs Extra
    if (canvasRef3.current) {
      if (chartInst3.current) chartInst3.current.destroy();

      const config3: ChartConfiguration<'line'> = {
        type: 'line',
        data: {
          labels: testLabels,
          datasets: [
            {
              label: 'Masa Tenor (Tahun)',
              data: tenorData,
              borderColor: isDarkMode ? '#a78bfa' : '#8b5cf6',
              backgroundColor: isDarkMode
                ? 'rgba(167, 139, 250, 0.2)'
                : 'rgba(139, 92, 246, 0.15)',
              fill: true,
              borderWidth: 2.5,
              pointRadius: 4,
              pointBackgroundColor: isDarkMode ? '#a78bfa' : '#8b5cf6',
              tension: 0.2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: tooltipBg,
              titleColor: '#ffffff',
              bodyColor: '#e2e8f0',
              callbacks: {
                label: (ctx) => `Tenor Aktual: ${(ctx.parsed.y ?? 0).toFixed(1)} Tahun`,
              },
            },
          },
          scales: {
            y: {
              min: 0,
              max: Math.ceil(params.tenorBulan / 12) + 2,
              ticks: {
                color: textColor,
                callback: (val) => `${val} Thn`,
                font: { size: 10 },
              },
              grid: { color: gridColor },
            },
            x: {
              grid: { display: false },
              ticks: { color: textColor, font: { size: 10 } },
            },
          },
        },
      };

      chartInst3.current = new ChartJS(canvasRef3.current, config3);
    }

    return () => {
      if (chartInst1.current) chartInst1.current.destroy();
      if (chartInst2.current) chartInst2.current.destroy();
      if (chartInst3.current) chartInst3.current.destroy();
    };
  }, [params, baseline, simulated, mode, isDarkMode, gridColor, textColor, legendColor, tooltipBg]);

  return (
    <div className="space-y-4">
      {/* Graph 1: Saldo Pokok vs Waktu */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              <LineChart className="w-3.5 h-3.5" />
              <span>Grafik 1</span>
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white mt-0.5">
              Penurunan Saldo Pokok vs Waktu
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Garis biru memperlihatkan percepatan pemotongan pokok utang Anda dibandingkan jadwal normal SP3K
            </p>
          </div>
        </div>
        <div className="w-full h-64 sm:h-72">
          <canvas ref={canvasRef1} />
        </div>
      </div>

      {/* Grid of Graph 2 & 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Graph 2 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Grafik 2</span>
          </div>
          <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-white">
            Total Bunga vs Extra Payment
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            Beban bunga bank anjlok secara drastis seiring kenaikan nominal extra pokok tahunan
          </p>
          <div className="w-full h-52 sm:h-56">
            <canvas ref={canvasRef2} />
          </div>
        </div>

        {/* Graph 3 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Grafik 3</span>
          </div>
          <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-white">
            Masa Tenor KPR (Tahun) vs Extra Payment
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            Waktu cicilan menyusut dari {params.tenorBulan / 12} tahun menjadi jauh lebih singkat
          </p>
          <div className="w-full h-52 sm:h-56">
            <canvas ref={canvasRef3} />
          </div>
        </div>
      </div>
    </div>
  );
};
