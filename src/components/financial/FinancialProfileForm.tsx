import React from 'react';
import {
  Wallet,
  TrendingDown,
  CreditCard,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Plus,
} from 'lucide-react';
import { UserFinancialProfile } from '../../types/financialHealth';
import { formatRupiah } from '../../utils/calculator';

interface FinancialProfileFormProps {
  profile: UserFinancialProfile;
  onChangeProfile: (newProfile: UserFinancialProfile) => void;
  onReset: () => void;
}

export const FinancialProfileForm: React.FC<FinancialProfileFormProps> = ({
  profile,
  onChangeProfile,
  onReset,
}) => {
  const updateIncome = (field: keyof UserFinancialProfile['income'], value: any) => {
    onChangeProfile({
      ...profile,
      income: { ...profile.income, [field]: value },
    });
  };

  const updateExpense = (field: keyof UserFinancialProfile['expenses'], value: number) => {
    onChangeProfile({
      ...profile,
      expenses: { ...profile.expenses, [field]: value },
    });
  };

  const updateDebt = (field: keyof UserFinancialProfile['debts'], value: number) => {
    onChangeProfile({
      ...profile,
      debts: { ...profile.debts, [field]: value },
    });
  };

  const updateAsset = (field: keyof UserFinancialProfile['assets'], value: any) => {
    onChangeProfile({
      ...profile,
      assets: { ...profile.assets, [field]: value },
    });
  };

  const applyPreset = (presetName: 'single' | 'family' | 'high_income') => {
    if (presetName === 'single') {
      onChangeProfile({
        income: {
          gajiBersih: 14_000_000,
          penghasilanTambahan: 1_500_000,
          penghasilanPasangan: 0,
          bonusTahunan: 10_000_000,
          includeBonusInMonthly: false,
        },
        expenses: {
          makanRumahTangga: 3_500_000,
          transportasi: 1_000_000,
          listrikAirInternet: 800_000,
          pendidikan: 0,
          asuransiKesehatan: 600_000,
          anakKeluarga: 500_000,
          gayaHidup: 1_200_000,
          pengeluaranLainnya: 400_000,
        },
        debts: {
          cicilanKendaraan: 800_000,
          kartuKredit: 0,
          pinjamanPribadi: 0,
          paylater: 0,
          cicilanLainnya: 0,
        },
        assets: {
          tabunganCash: 15_000_000,
          danaDarurat: 30_000_000,
          investasiLikuid: 10_000_000,
          isEmergencyFundUsable: true,
        },
      });
    } else if (presetName === 'family') {
      onChangeProfile({
        income: {
          gajiBersih: 22_000_000,
          penghasilanTambahan: 3_000_000,
          penghasilanPasangan: 0,
          bonusTahunan: 20_000_000,
          includeBonusInMonthly: false,
        },
        expenses: {
          makanRumahTangga: 5_500_000,
          transportasi: 1_800_000,
          listrikAirInternet: 1_400_000,
          pendidikan: 1_200_000,
          asuransiKesehatan: 1_200_000,
          anakKeluarga: 1_500_000,
          gayaHidup: 1_500_000,
          pengeluaranLainnya: 600_000,
        },
        debts: {
          cicilanKendaraan: 1_500_000,
          kartuKredit: 0,
          pinjamanPribadi: 0,
          paylater: 0,
          cicilanLainnya: 0,
        },
        assets: {
          tabunganCash: 35_000_000,
          danaDarurat: 50_000_000,
          investasiLikuid: 30_000_000,
          isEmergencyFundUsable: true,
        },
      });
    } else if (presetName === 'high_income') {
      onChangeProfile({
        income: {
          gajiBersih: 35_000_000,
          penghasilanTambahan: 5_000_000,
          penghasilanPasangan: 12_000_000,
          bonusTahunan: 50_000_000,
          includeBonusInMonthly: false,
        },
        expenses: {
          makanRumahTangga: 8_000_000,
          transportasi: 3_000_000,
          listrikAirInternet: 2_500_000,
          pendidikan: 3_000_000,
          asuransiKesehatan: 2_500_000,
          anakKeluarga: 2_500_000,
          gayaHidup: 3_500_000,
          pengeluaranLainnya: 1_500_000,
        },
        debts: {
          cicilanKendaraan: 3_000_000,
          kartuKredit: 0,
          pinjamanPribadi: 0,
          paylater: 0,
          cicilanLainnya: 0,
        },
        assets: {
          tabunganCash: 80_000_000,
          danaDarurat: 120_000_000,
          investasiLikuid: 100_000_000,
          isEmergencyFundUsable: true,
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Presets Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl border border-blue-200/60 dark:border-blue-900/60 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            Contoh Profil Cepat:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => applyPreset('single')}
            className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg border border-slate-200 dark:border-slate-700 transition active:scale-95 cursor-pointer"
          >
            Lajang (14 Jt)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('family')}
            className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg border border-slate-200 dark:border-slate-700 transition active:scale-95 cursor-pointer"
          >
            Keluarga (25 Jt)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('high_income')}
            className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg border border-slate-200 dark:border-slate-700 transition active:scale-95 cursor-pointer"
          >
            Double Income (52 Jt)
          </button>
          <button
            type="button"
            onClick={onReset}
            className="px-2 py-1 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 transition cursor-pointer"
            title="Kembalikan ke profil bawaan"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SECTION 1: PENDAPATAN (INCOME) */}
        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3.5">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
            <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>1. Pendapatan Bersih Bulanan</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                Gaji / Penghasilan Bersih (Take Home Pay)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-semibold">Rp</span>
                <input
                  type="number"
                  step="500000"
                  value={profile.income.gajiBersih}
                  onChange={(e) => updateIncome('gajiBersih', Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-bold text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                Penghasilan Tambahan (Freelance / Bisnis Sampingan)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-semibold">Rp</span>
                <input
                  type="number"
                  step="250000"
                  value={profile.income.penghasilanTambahan}
                  onChange={(e) => updateIncome('penghasilanTambahan', Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                Penghasilan Pasangan (Opsional / Rumah Tangga)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-semibold">Rp</span>
                <input
                  type="number"
                  step="500000"
                  value={profile.income.penghasilanPasangan}
                  onChange={(e) => updateIncome('penghasilanPasangan', Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-600 dark:text-slate-300 font-medium">
                  Bonus Tahunan / THR (Opsional)
                </label>
                <label className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.income.includeBonusInMonthly}
                    onChange={(e) => updateIncome('includeBonusInMonthly', e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Bagi 12 ke bulanan</span>
                </label>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-semibold">Rp</span>
                <input
                  type="number"
                  step="1000000"
                  value={profile.income.bonusTahunan}
                  onChange={(e) => updateIncome('bonusTahunan', Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: UTANG LAINNYA (OTHER DEBTS) */}
        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3.5">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
            <CreditCard className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>2. Utang &amp; Cicilan Bulanan Selain KPR</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                Cicilan Kendaraan (Motor / Mobil)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-semibold">Rp</span>
                <input
                  type="number"
                  step="200000"
                  value={profile.debts.cicilanKendaraan}
                  onChange={(e) => updateDebt('cicilanKendaraan', Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Tagihan Kartu Kredit
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-semibold">Rp</span>
                  <input
                    type="number"
                    step="100000"
                    value={profile.debts.kartuKredit}
                    onChange={(e) => updateDebt('kartuKredit', Number(e.target.value))}
                    className="w-full pl-9 pr-2 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Paylater / Fintech
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-semibold">Rp</span>
                  <input
                    type="number"
                    step="100000"
                    value={profile.debts.paylater}
                    onChange={(e) => updateDebt('paylater', Number(e.target.value))}
                    className="w-full pl-9 pr-2 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Pinjaman Pribadi / KTA
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-semibold">Rp</span>
                  <input
                    type="number"
                    step="200000"
                    value={profile.debts.pinjamanPribadi}
                    onChange={(e) => updateDebt('pinjamanPribadi', Number(e.target.value))}
                    className="w-full pl-9 pr-2 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Cicilan Lainnya
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-semibold">Rp</span>
                  <input
                    type="number"
                    step="100000"
                    value={profile.debts.cicilanLainnya}
                    onChange={(e) => updateDebt('cicilanLainnya', Number(e.target.value))}
                    className="w-full pl-9 pr-2 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
              *Cicilan KPR dihitung otomatis dari simulator KPR yang sedang aktif.
            </p>
          </div>
        </div>

        {/* SECTION 3: PENGELUARAN RUTIN (EXPENSES) */}
        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3.5">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
            <TrendingDown className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>3. Pengeluaran Rutin Bulanan</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                Makan &amp; Kebutuhan Pokok
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-2.5 text-slate-400 font-semibold">Rp</span>
                <input
                  type="number"
                  step="200000"
                  value={profile.expenses.makanRumahTangga}
                  onChange={(e) => updateExpense('makanRumahTangga', Number(e.target.value))}
                  className="w-full pl-8 pr-2 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                Transportasi &amp; Bensin
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-2.5 text-slate-400 font-semibold">Rp</span>
                <input
                  type="number"
                  step="100000"
                  value={profile.expenses.transportasi}
                  onChange={(e) => updateExpense('transportasi', Number(e.target.value))}
                  className="w-full pl-8 pr-2 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                Listrik, Air &amp; Internet
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-2.5 text-slate-400 font-semibold">Rp</span>
                <input
                  type="number"
                  step="100000"
                  value={profile.expenses.listrikAirInternet}
                  onChange={(e) => updateExpense('listrikAirInternet', Number(e.target.value))}
                  className="w-full pl-8 pr-2 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                Pendidikan Anak / Kursus
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-2.5 text-slate-400 font-semibold">Rp</span>
                <input
                  type="number"
                  step="100000"
                  value={profile.expenses.pendidikan}
                  onChange={(e) => updateExpense('pendidikan', Number(e.target.value))}
                  className="w-full pl-8 pr-2 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                Asuransi &amp; Kesehatan
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-2.5 text-slate-400 font-semibold">Rp</span>
                <input
                  type="number"
                  step="100000"
                  value={profile.expenses.asuransiKesehatan}
                  onChange={(e) => updateExpense('asuransiKesehatan', Number(e.target.value))}
                  className="w-full pl-8 pr-2 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                Kebutuhan Keluarga / Ortu
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-2.5 text-slate-400 font-semibold">Rp</span>
                <input
                  type="number"
                  step="100000"
                  value={profile.expenses.anakKeluarga}
                  onChange={(e) => updateExpense('anakKeluarga', Number(e.target.value))}
                  className="w-full pl-8 pr-2 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                Gaya Hidup &amp; Hiburan
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-2.5 text-slate-400 font-semibold">Rp</span>
                <input
                  type="number"
                  step="100000"
                  value={profile.expenses.gayaHidup}
                  onChange={(e) => updateExpense('gayaHidup', Number(e.target.value))}
                  className="w-full pl-8 pr-2 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                Pengeluaran Rutin Lainnya
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-2.5 text-slate-400 font-semibold">Rp</span>
                <input
                  type="number"
                  step="100000"
                  value={profile.expenses.pengeluaranLainnya}
                  onChange={(e) => updateExpense('pengeluaranLainnya', Number(e.target.value))}
                  className="w-full pl-8 pr-2 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: KONDISI DANA & DANA DARURAT */}
        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3.5">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>4. Kondisi Dana &amp; Dana Darurat</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                Dana Darurat yang Dimiliki Saat Ini
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-semibold">Rp</span>
                <input
                  type="number"
                  step="1000000"
                  value={profile.assets.danaDarurat}
                  onChange={(e) => updateAsset('danaDarurat', Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-bold text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Pertanyaan Klarifikasi Dana Darurat Sesuai Brief */}
            <div className="p-2.5 bg-blue-100/50 dark:bg-blue-950/60 rounded-lg border border-blue-200 dark:border-blue-900/60">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.assets.isEmergencyFundUsable}
                  onChange={(e) => updateAsset('isEmergencyFundUsable', e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
                  <strong>Pertanyaan Keamanan:</strong> Apakah dana darurat ini memang bisa dicairkan segera (likuid) ketika terjadi kondisi darurat tanpa penalti besar?
                </span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Tabungan / Cash Siap Pakai
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-semibold">Rp</span>
                  <input
                    type="number"
                    step="1000000"
                    value={profile.assets.tabunganCash}
                    onChange={(e) => updateAsset('tabunganCash', Number(e.target.value))}
                    className="w-full pl-9 pr-2 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Investasi Likuid (Reksadana/Emas)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-semibold">Rp</span>
                  <input
                    type="number"
                    step="1000000"
                    value={profile.assets.investasiLikuid}
                    onChange={(e) => updateAsset('investasiLikuid', Number(e.target.value))}
                    className="w-full pl-9 pr-2 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
              *Aplikasi tidak otomatis menganggap seluruh investasi sebagai dana darurat untuk menjaga keamanan risiko likuiditas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
