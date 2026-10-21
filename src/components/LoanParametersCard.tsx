import React, { useState } from 'react';
import { Landmark, Percent, Clock, RotateCcw, ChevronDown, Check, Sparkles, Plus, Minus, ArrowUpRight } from 'lucide-react';
import { KprParameters, InterestType } from '../types/kpr';
import {
  formatRupiah,
  parseRupiahInput,
  calculatePMT,
  isStrictBcaSp3kDefault,
  recalculateTierInstallments,
} from '../utils/calculator';

interface LoanParametersCardProps {
  params: KprParameters;
  onChangeParams: (newParams: KprParameters) => void;
  onResetDefaults: () => void;
}

const PLAFON_PRESETS = [
  { label: '250 Jt', value: 250_000_000 },
  { label: '500 Jt', value: 500_000_000 },
  { label: '631 Jt (SP3K BCA)', value: 631_000_000 },
  { label: '800 Jt', value: 800_000_000 },
  { label: '1 Milyar', value: 1_000_000_000 },
  { label: '1.5 M', value: 1_500_000_000 },
  { label: '2 M', value: 2_000_000_000 },
];

const TENOR_PRESETS = [
  { label: '5 Thn (60 bln)', value: 60 },
  { label: '10 Thn (120 bln)', value: 120 },
  { label: '15 Thn (180 bln)', value: 180 },
  { label: '20 Thn (SP3K BCA)', value: 240 },
  { label: '25 Thn (300 bln)', value: 300 },
];

export const LoanParametersCard: React.FC<LoanParametersCardProps> = ({
  params,
  onChangeParams,
  onResetDefaults,
}) => {
  const [isTierEditorOpen, setIsTierEditorOpen] = useState(false);

  const handlePlafonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseRupiahInput(e.target.value);
    onChangeParams({ ...params, plafon: raw });
  };

  const adjustPlafon = (delta: number) => {
    const next = Math.max(50_000_000, params.plafon + delta);
    onChangeParams({ ...params, plafon: next });
  };

  const handleInterestTypeChange = (type: InterestType) => {
    onChangeParams({ ...params, interestType: type });
  };

  const isBcaDefault = isStrictBcaSp3kDefault(params);

  // Compute live installments for preview
  const singleFixedCicilan = calculatePMT(
    params.singleFixedRate / 12,
    params.tenorBulan,
    params.plafon
  );

  const floatingPromoCicilan = calculatePMT(
    params.fixRate / 12,
    params.tenorBulan,
    params.plafon
  );

  // Remaining balance estimate entering floating
  let balPromo = params.plafon;
  const rPromo = params.fixRate / 12;
  for (let i = 1; i <= params.fixDurationMonths; i++) {
    const interest = balPromo * rPromo;
    const principal = Math.min(balPromo, floatingPromoCicilan - interest);
    balPromo -= principal;
  }
  const floatingMarketCicilan = calculatePMT(
    params.floatingRate / 12,
    Math.max(1, params.tenorBulan - params.fixDurationMonths),
    balPromo
  );

  const flatMonthlyInterest = (params.plafon * params.flatAnnualRate) / 12;
  const flatMonthlyPrincipal = params.plafon / params.tenorBulan;
  const flatTotalCicilan = flatMonthlyPrincipal + flatMonthlyInterest;

  // Tiered preview
  const tierPreview = recalculateTierInstallments(
    params.plafon,
    params.tenorBulan,
    params.p1.bungaTahunan,
    params.p1.durasiBulan,
    params.p2.bungaTahunan,
    params.p2.durasiBulan,
    params.p3.bungaTahunan
  );

  const p1CicilanDisplay = isBcaDefault ? params.p1.cicilanBulanan : tierPreview.cicilan1;
  const p2CicilanDisplay = isBcaDefault ? params.p2.cicilanBulanan : tierPreview.cicilan2;
  const p3CicilanDisplay = isBcaDefault ? params.p3.cicilanBulanan : tierPreview.cicilan3;

  return (
    <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800 transition-colors space-y-5">
      {/* Header with Title and Reset Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                Variabel Pokok KPR & Suku Bunga
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                Multi-Kondisi
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ubah plafon kredit, durasi tenor, dan pilih tipe bunga (Fix Berjenjang SP3K, Fixed Tetap, Floating, atau Flat)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {!isBcaDefault ? (
            <button
              onClick={onResetDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-xl transition border border-rose-200 dark:border-rose-900/50 active:scale-95"
              title="Reset ke SP3K BCA Asli (Plafon Rp631 Jt, Fix Berjenjang 20 Thn)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Kembalikan ke Default SP3K</span>
            </button>
          ) : (
            <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Default SP3K BCA Aktif</span>
            </div>
          )}
        </div>
      </div>

      {/* Row 1: Pokok KPR & Tenor Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Plafon / Pokok KPR Input */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
              <span>Pokok KPR (Plafon Pinjaman)</span>
            </label>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-bold tabular-nums">
              {formatRupiah(params.plafon)}
            </span>
          </div>

          <div className="relative flex items-center">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-bold text-base select-none">
              Rp
            </div>
            <input
              type="text"
              value={params.plafon > 0 ? params.plafon.toLocaleString('id-ID') : '0'}
              onChange={handlePlafonChange}
              className="w-full pl-12 pr-28 py-2.5 text-xl font-black text-slate-900 dark:text-white bg-slate-50/80 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-500 rounded-xl focus:outline-none transition-all tabular-nums"
              placeholder="0"
            />
            {/* Quick step buttons */}
            <div className="absolute right-2 flex items-center gap-1">
              <button
                type="button"
                onClick={() => adjustPlafon(-50_000_000)}
                className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs transition"
                title="Kurang Rp50 Juta"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => adjustPlafon(50_000_000)}
                className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs transition"
                title="Tambah Rp50 Juta"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Plafon Presets */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {PLAFON_PRESETS.map((p) => {
              const isSelected = params.plafon === p.value;
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => onChangeParams({ ...params, plafon: p.value })}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tenor Awal Input */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Tenor Awal Pinjaman</span>
            </label>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-bold tabular-nums">
              {params.tenorBulan} Bulan ({params.tenorBulan / 12} Tahun)
            </span>
          </div>

          <div className="relative">
            <input
              type="number"
              min={12}
              max={360}
              step={12}
              value={params.tenorBulan}
              onChange={(e) =>
                onChangeParams({ ...params, tenorBulan: parseInt(e.target.value) || 240 })
              }
              className="w-full px-4 py-2.5 text-xl font-black text-slate-900 dark:text-white bg-slate-50/80 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-500 rounded-xl focus:outline-none transition-all tabular-nums"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 dark:text-slate-500 pointer-events-none">
              Bulan ({params.tenorBulan / 12} Thn)
            </div>
          </div>

          {/* Quick Tenor Presets */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {TENOR_PRESETS.map((t) => {
              const isSelected = params.tenorBulan === t.value;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => onChangeParams({ ...params, tenorBulan: t.value })}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 2: Struktur Suku Bunga Selection (Fix Berjenjang, Fixed Tetap, Floating, Flat) */}
      <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Pilih Struktur / Model Suku Bunga KPR</span>
          </label>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Klik salah satu model di bawah untuk mensimulasikan kondisi suku bunga
          </span>
        </div>

        {/* 4 Interactive Rate Type Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {/* Option 1: Fix Berjenjang (SP3K BCA) */}
          <button
            type="button"
            onClick={() => handleInterestTypeChange('tiered')}
            className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
              params.interestType === 'tiered'
                ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500 shadow-xs ring-2 ring-blue-500/20'
                : 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-900 dark:text-white">Fix Berjenjang</span>
                {params.interestType === 'tiered' && (
                  <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                )}
              </div>
              <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 block mt-0.5">
                SP3K BCA (Default)
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                3 Thn @ {(params.p1.bungaTahunan * 100).toFixed(2)}% &rarr; 3 Thn @ {(params.p2.bungaTahunan * 100).toFixed(2)}% &rarr; {(params.p3.bungaTahunan * 100).toFixed(2)}%
              </p>
            </div>
            <div className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 mt-2 flex items-center justify-between">
              <span>Bunga bertahap</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 font-bold">3 Periode</span>
            </div>
          </button>

          {/* Option 2: Fixed Sepanjang Tenor */}
          <button
            type="button"
            onClick={() => handleInterestTypeChange('single_fixed')}
            className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
              params.interestType === 'single_fixed'
                ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500 shadow-xs ring-2 ring-blue-500/20'
                : 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-900 dark:text-white">Fixed / Tetap</span>
                {params.interestType === 'single_fixed' && (
                  <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                )}
              </div>
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 block mt-0.5">
                {(params.singleFixedRate * 100).toFixed(2)}% p.a.
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                Satu suku bunga tetap sepanjang seluruh masa kredit (Anuitas)
              </p>
            </div>
            <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-2 flex items-center justify-between">
              <span>Cicilan flat</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 font-bold">Anuitas</span>
            </div>
          </button>

          {/* Option 3: Fix + Floating */}
          <button
            type="button"
            onClick={() => handleInterestTypeChange('floating')}
            className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
              params.interestType === 'floating'
                ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500 shadow-xs ring-2 ring-blue-500/20'
                : 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-900 dark:text-white">Fix + Floating</span>
                {params.interestType === 'floating' && (
                  <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                )}
              </div>
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 block mt-0.5">
                {(params.fixRate * 100).toFixed(2)}% &rarr; {(params.floatingRate * 100).toFixed(2)}%
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                Promo {params.fixDurationMonths / 12} Thn fix rendah, lalu floating suku bunga pasar
              </p>
            </div>
            <div className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 mt-2 flex items-center justify-between">
              <span>Promo & pasar</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 font-bold">Mengambang</span>
            </div>
          </button>

          {/* Option 4: Flat Murni Tradisional */}
          <button
            type="button"
            onClick={() => handleInterestTypeChange('flat')}
            className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
              params.interestType === 'flat'
                ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500 shadow-xs ring-2 ring-blue-500/20'
                : 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-900 dark:text-white">Bunga Flat Murni</span>
                {params.interestType === 'flat' && (
                  <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                )}
              </div>
              <span className="text-[11px] font-bold text-purple-700 dark:text-purple-400 block mt-0.5">
                {(params.flatAnnualRate * 100).toFixed(2)}% Flat p.a.
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                Bunga dihitung proporsional tetap dari pokok plafon awal
              </p>
            </div>
            <div className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 mt-2 flex items-center justify-between">
              <span>Pokok konstan</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 font-bold">Flat Pokok</span>
            </div>
          </button>
        </div>

        {/* Dynamic Controls based on selected Interest Type */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs space-y-3">
          {/* 1. TIERED (SP3K BCA) */}
          {params.interestType === 'tiered' && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-slate-800 dark:text-white text-xs block">
                    Struktur Suku Bunga Berjenjang (SP3K BCA)
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Cicilan otomatis dihitung presisi untuk ketiga periode suku bunga
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTierEditorOpen(!isTierEditorOpen)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer self-start sm:self-auto"
                >
                  <span>{isTierEditorOpen ? 'Sembunyikan Pengaturan Rate' : 'Ubah Bunga Periode 1, 2, 3'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isTierEditorOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* 3 Summary Cards for P1, P2, P3 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400">
                    <span>Periode 1 (Bln 1–{params.p1.durasiBulan})</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{params.p1.durasiBulan / 12} Tahun</span>
                  </div>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-sm font-black text-slate-900 dark:text-white tabular-nums">
                      {(params.p1.bungaTahunan * 100).toFixed(2)}% p.a.
                    </span>
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-400 tabular-nums">
                      {formatRupiah(p1CicilanDisplay)}/bln
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Bunga fixed tahap 1</div>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400">
                    <span>Periode 2 (Bln {params.p1.durasiBulan + 1}–{params.p1.durasiBulan + params.p2.durasiBulan})</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{params.p2.durasiBulan / 12} Tahun</span>
                  </div>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-sm font-black text-slate-900 dark:text-white tabular-nums">
                      {(params.p2.bungaTahunan * 100).toFixed(2)}% p.a.
                    </span>
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-400 tabular-nums">
                      {formatRupiah(p2CicilanDisplay)}/bln
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Bunga fixed tahap 2</div>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400">
                    <span>Periode 3 (Bln {params.p1.durasiBulan + params.p2.durasiBulan + 1}–{params.tenorBulan})</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{params.p3.durasiBulan / 12} Tahun</span>
                  </div>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-sm font-black text-slate-900 dark:text-white tabular-nums">
                      {(params.p3.bungaTahunan * 100).toFixed(2)}% p.a.
                    </span>
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-400 tabular-nums">
                      {formatRupiah(p3CicilanDisplay)}/bln
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Bunga fixed tahap 3 / pelunasan</div>
                </div>
              </div>

              {/* Collapsible Editor for Tier Rates */}
              {isTierEditorOpen && (
                <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-blue-200 dark:border-blue-900/50 space-y-3 animate-in fade-in duration-150">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800 dark:text-white">
                      Kustomisasi Suku Bunga Tiap Periode:
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onChangeParams({
                          ...params,
                          p1: { ...params.p1, bungaTahunan: 0.029 },
                          p2: { ...params.p2, bungaTahunan: 0.0699 },
                          p3: { ...params.p3, bungaTahunan: 0.0899 },
                        });
                      }}
                      className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Reset ke 2,90% / 6,99% / 8,99%
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Bunga Periode 1 (% p.a):
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={(params.p1.bungaTahunan * 100).toFixed(2)}
                        onChange={(e) =>
                          onChangeParams({
                            ...params,
                            p1: { ...params.p1, bungaTahunan: (parseFloat(e.target.value) || 0) / 100 },
                          })
                        }
                        className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-800 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Bunga Periode 2 (% p.a):
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={(params.p2.bungaTahunan * 100).toFixed(2)}
                        onChange={(e) =>
                          onChangeParams({
                            ...params,
                            p2: { ...params.p2, bungaTahunan: (parseFloat(e.target.value) || 0) / 100 },
                          })
                        }
                        className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-800 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Bunga Periode 3 (% p.a):
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={(params.p3.bungaTahunan * 100).toFixed(2)}
                        onChange={(e) =>
                          onChangeParams({
                            ...params,
                            p3: { ...params.p3, bungaTahunan: (parseFloat(e.target.value) || 0) / 100 },
                          })
                        }
                        className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. SINGLE FIXED (Tetap Sepanjang Tenor) */}
          {params.interestType === 'single_fixed' && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="font-bold text-slate-800 dark:text-white text-xs block">
                    Suku Bunga Fixed / Tetap Sepanjang Tenor:
                  </label>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Bunga dan cicilan bernilai flat anuitas dari bulan ke-1 hingga akhir kredit
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    {(params.singleFixedRate * 100).toFixed(2)}% p.a.
                  </span>
                  <div className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    Cicilan: {formatRupiah(singleFixedCicilan)}/bln
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <input
                  type="range"
                  min={2.0}
                  max={15.0}
                  step={0.1}
                  value={params.singleFixedRate * 100}
                  onChange={(e) =>
                    onChangeParams({
                      ...params,
                      singleFixedRate: parseFloat(e.target.value) / 100,
                    })
                  }
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>2.0%</span>
                  <span>5.0%</span>
                  <span>6.5% (Standar KPR)</span>
                  <span>8.5%</span>
                  <span>10.0%</span>
                  <span>15.0%</span>
                </div>
              </div>
            </div>
          )}

          {/* 3. FLOATING (Promo Fixed + Mengambang) */}
          {params.interestType === 'floating' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800 dark:text-white text-xs">
                  Simulasi KPR Promo Fixed lalu Suku Bunga Floating Pasar:
                </span>
                <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                  Lonjakan Cicilan: +{formatRupiah(floatingMarketCicilan - floatingPromoCicilan)}/bln
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Durasi Promo Fixed:
                  </label>
                  <select
                    value={params.fixDurationMonths}
                    onChange={(e) =>
                      onChangeParams({
                        ...params,
                        fixDurationMonths: parseInt(e.target.value) || 36,
                      })
                    }
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-800 dark:text-white"
                  >
                    <option value={12}>1 Tahun (12 Bulan)</option>
                    <option value={24}>2 Tahun (24 Bulan)</option>
                    <option value={36}>3 Tahun (36 Bulan)</option>
                    <option value={60}>5 Tahun (60 Bulan)</option>
                  </select>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Bunga Promo Fixed (% p.a):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={(params.fixRate * 100).toFixed(2)}
                    onChange={(e) =>
                      onChangeParams({
                        ...params,
                        fixRate: (parseFloat(e.target.value) || 0) / 100,
                      })
                    }
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-800 dark:text-white"
                  />
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold block mt-1">
                    Cicilan: {formatRupiah(floatingPromoCicilan)}/bln
                  </span>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Bunga Floating Pasar (% p.a):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={(params.floatingRate * 100).toFixed(2)}
                    onChange={(e) =>
                      onChangeParams({
                        ...params,
                        floatingRate: (parseFloat(e.target.value) || 0) / 100,
                      })
                    }
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold text-amber-600 dark:text-amber-400"
                  />
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold block mt-1">
                    Cicilan: {formatRupiah(floatingMarketCicilan)}/bln
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 4. FLAT MURNI */}
          {params.interestType === 'flat' && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="font-bold text-slate-800 dark:text-white text-xs block">
                    Suku Bunga Flat Murni Tahunan:
                  </label>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Bunga dihitung proporsional dari plafon awal pinjaman
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-purple-600 dark:text-purple-400 font-mono">
                    {(params.flatAnnualRate * 100).toFixed(2)}% Flat p.a.
                  </span>
                  <div className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                    Total: {formatRupiah(flatTotalCicilan)}/bln
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <input
                  type="range"
                  min={2.0}
                  max={12.0}
                  step={0.1}
                  value={params.flatAnnualRate * 100}
                  onChange={(e) =>
                    onChangeParams({
                      ...params,
                      flatAnnualRate: parseFloat(e.target.value) / 100,
                    })
                  }
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>2.0%</span>
                  <span>4.0%</span>
                  <span>5.0% (Standar Flat)</span>
                  <span>8.0%</span>
                  <span>10.0%</span>
                  <span>12.0%</span>
                </div>
              </div>

              <div className="p-2.5 bg-purple-50 dark:bg-purple-950/40 rounded-lg border border-purple-200 dark:border-purple-900/50 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-purple-900 dark:text-purple-200 gap-2">
                <div>
                  <span>Komposisi: </span>
                  <strong>Pokok: {formatRupiah(flatMonthlyPrincipal)}/bln</strong> +{' '}
                  <strong>Bunga: {formatRupiah(flatMonthlyInterest)}/bln</strong>
                </div>
                <div className="text-[10px] text-purple-700 dark:text-purple-300 italic">
                  *Setara bunga efektif ~{(params.flatAnnualRate * 1.83 * 100).toFixed(1)}% p.a.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
