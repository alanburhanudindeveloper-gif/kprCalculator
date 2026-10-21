import React, { useState } from 'react';
import {
  BookOpen,
  HelpCircle,
  ChevronDown,
  TrendingDown,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Calculator,
  ArrowUpRight,
  Landmark,
  Percent,
} from 'lucide-react';

export interface FaqItem {
  question: string;
  answer: string;
}

export const KPR_FAQS: FaqItem[] = [
  {
    question: 'Apa itu extra payment pokok KPR dan bagaimana cara kerjanya?',
    answer:
      'Extra payment pokok adalah pembayaran tambahan di luar cicilan bulanan reguler yang 100% dialokasikan langsung untuk mengurangi sisa pokok utang pinjaman KPR Anda. Karena beban bunga bulanan dihitung dari persentase sisa pokok utang (Bunga = Sisa Pokok × Suku Bunga / 12), berkurangnya saldo pokok secara langsung menurunkan porsi bunga yang harus dibayarkan ke bank pada bulan-bulan berikutnya.',
  },
  {
    question: 'Apakah pembayaran ekstra dapat memperpendek masa tenor KPR?',
    answer:
      'Ya! Pada Mode Pangkas Tenor (Mode A), jika Anda tetap membayar cicilan bulanan sesuai jadwal SP3K sementara pokok utang terus dipotong oleh setoran ekstra, saldo pokok akan menyentuh angka Rp0 jauh sebelum tenor 20 tahun berakhir. Misalnya pada KPR BCA Rp631 Juta, pembayaran ekstra Rp20 Juta per tahun dapat memangkas tenor hingga lebih dari 6 tahun lebih cepat dan menghemat puluhan hingga ratusan juta rupiah bunga.',
  },
  {
    question: 'Bagaimana cara kerja recalculation penurunan cicilan (Mode B)?',
    answer:
      'Pada Mode Recalculation Cicilan (Mode B), Anda memilih mempertahankan jangka waktu kredit tetap (misalnya 20 tahun), namun meminta bank menghitung ulang cicilan bulanan baru berdasarkan sisa pokok yang lebih kecil. Hasilnya, angsuran bulanan Anda akan terus menurun secara bertahap sehingga cash flow bulanan keluarga menjadi jauh lebih longgar.',
  },
  {
    question: 'Kapan waktu terbaik untuk melakukan pembayaran ekstra pokok KPR?',
    answer:
      'Waktu terbaik secara finansial adalah seawal mungkin, terutama pada 3–5 tahun pertama masa kredit KPR. Pada tahun-tahun awal, komposisi cicilan bulanan didominasi oleh bunga bank (hingga 70%–80%), sedangkan porsi pokok sangat kecil. Dengan memangkas pokok sejak dini, efek perlipatan bunga majemuk berkurang drastis sepanjang sisa tenor.',
  },
  {
    question: 'Apa perbedaan suku bunga Fix Berjenjang, Fixed, Floating, dan Flat?',
    answer:
      'Fix Berjenjang (seperti SP3K BCA) memiliki beberapa periode bunga tetap bertahap (misal 3 tahun 2,90%, 3 tahun 6,99%, 14 tahun 8,99%). Fixed Tetap mengunci suku bunga sama sepanjang tenor (anuitas). Floating adalah suku bunga mengambang yang mengikuti suku bunga acuan pasar setelah masa promo habis. Sedangkan Flat adalah bunga di mana nominal bunga dihitung konstan dari plafon awal, yang setara dengan suku bunga efektif/anuitas hampir dua kali lipat lebih tinggi.',
  },
  {
    question: 'Apakah bank mengenakan penalti pelunasan sebagian dipercepat?',
    answer:
      'Kebijakan penalti bervariasi antar bank. Beberapa bank memberlakukan penalti (umumnya 1%–3% dari nominal pokok yang dilunasi) jika pelunasan dilakukan pada masa fixed promo, sementara bank lain menggratiskan pelunasan sebagian atau membebaskan penalti setelah melewati periode tertentu. Pastikan memeriksa klausul perjanjian kredit atau SP3K Anda sebelum menyetor.',
  },
];

export const KprSeoContentSection: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <article className="space-y-10 pt-6">
      {/* SECTION 1: EDUKASI UTAMA & SEARCH INTENT FULFILLMENT */}
      <section
        id="panduan-pelunasan"
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs transition-colors space-y-8"
        aria-labelledby="heading-panduan"
      >
        <header className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-900/40">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Panduan Finansial KPR Indonesia</span>
          </div>
          <h2
            id="heading-panduan"
            className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight"
          >
            Panduan Lengkap Simulasi Pelunasan KPR &amp; Cara Memangkas Tenor
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl">
            Pahami bagaimana setoran ekstra pokok mampu menghemat ratusan juta rupiah beban bunga bank
            dan melunasi rumah idaman Anda bertahun-tahun lebih cepat melalui model amortisasi presisi.
          </p>
        </header>

        {/* 3 Pillars Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Apa itu Kalkulator Pelunasan KPR?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Kalkulator pelunasan KPR adalah instrumen aktuaria yang menghitung jadwal amortisasi
              bulanan pinjaman rumah. Berbeda dengan rumus pembagian sederhana, kalkulator ini
              memperhitungkan penurunan saldo pokok aktual, suku bunga efektif, dan percepatan waktu
              pelunasan secara matematis.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Pengaruh Pembayaran Ekstra Pokok
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Setiap rupiah pembayaran ekstra langsung memotong <strong>100% pokok utang</strong>, bukan
              bunga di muka atau administrasi. Saat pokok menyusut, bunga bulan berikutnya otomatis
              mengecil, sehingga porsi cicilan yang memotong pokok menjadi semakin besar setiap bulannya.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Pangkas Tenor vs Turunkan Cicilan
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Anda memiliki dua opsi strategi: <strong>Mode A (Pangkas Tenor)</strong> untuk bebas utang
              lebih cepat dengan penghematan bunga terbesar, atau <strong>Mode B (Recalculation Cicilan)</strong>{' '}
              untuk menjaga tenor tetap namun menurunkan besaran cicilan bulanan agar cash flow lebih rileks.
            </p>
          </div>
        </div>

        {/* Detailed Explanation on Amortization & Case Study */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          {/* Left: Deep Dive Math */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Landmark className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Bagaimana Cara Bank Menghitung Bunga KPR?</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Di Indonesia, sebagian besar KPR bank umum (BCA, Mandiri, BRI, BNI, CIMB Niaga, Permata)
              menggunakan metode <strong>Anuitas Efektif</strong>. Pada sistem ini, cicilan bulanan
              terdiri dari dua komponen:
            </p>
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono space-y-1.5">
              <div className="text-slate-700 dark:text-slate-300">
                1. <strong>Bunga Bulan Ini</strong> = Saldo Pokok Awal × (Suku Bunga Tahunan / 12)
              </div>
              <div className="text-slate-700 dark:text-slate-300">
                2. <strong>Pokok dari Cicilan</strong> = Cicilan Bulanan - Bunga Bulan Ini
              </div>
              <div className="text-emerald-700 dark:text-emerald-400 font-bold">
                3. <strong>Saldo Akhir</strong> = Saldo Pokok - Pokok Cicilan - Extra Payment
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Karena suku bunga dikalikan dengan saldo pokok yang tersisa, penyetoran ekstra di akhir
              tahun (misalnya bulan ke-12 atau ke-24) langsung memotong pokok dalam jumlah besar. Di
              bulan ke-13, bunga bank langsung turun, dan proporsi pokok yang dipotong cicilan reguler
              otomatis melonjak naik!
            </p>
          </div>

          {/* Right: BCA SP3K Case Study Box */}
          <div className="bg-gradient-to-br from-blue-900/10 to-slate-900/10 dark:from-blue-950/40 dark:to-slate-900/40 p-5 rounded-2xl border border-blue-200 dark:border-blue-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                Studi Kasus SP3K BCA
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200">
                Plafon Rp631 Juta · 20 Tahun
              </span>
            </div>

            <h4 className="text-sm font-bold text-slate-800 dark:text-white">
              Simulasi Extra Payment Rp20.000.000 / Tahun
            </h4>

            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Tenor Awal 20 Tahun (240 bulan)</strong> terpangkas menjadi{' '}
                  <strong className="text-blue-600 dark:text-blue-400">sekitar 13 Tahun</strong> (lunas 6–7 tahun lebih cepat).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Hemat Bunga:</strong> Menghemat lebih dari{' '}
                  <strong className="text-emerald-600 dark:text-emerald-400">Rp200 Juta</strong> biaya bunga yang tidak perlu dibayarkan ke bank.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Aman dari Floating Tinggi:</strong> Pinjaman lunas sebelum menghadapi
                  fluktuasi suku bunga mengambang yang tidak menentu.
                </span>
              </li>
            </ul>

            <div className="pt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => scrollToSection('kalkulator-section')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition shadow-xs cursor-pointer"
              >
                <span>Coba Hitung KPR Anda Sekarang</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('skenario-section')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition border border-slate-300 dark:border-slate-700 cursor-pointer"
              >
                <span>Lihat Tabel Skenario Nominal</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table Comparison: Jenis Suku Bunga KPR */}
        <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Percent className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Karakteristik 4 Jenis Bunga KPR yang Didukung Aplikasi Ini</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                  <th className="py-2.5 px-3 font-bold">Jenis Bunga</th>
                  <th className="py-2.5 px-3 font-bold">Metode Perhitungan</th>
                  <th className="py-2.5 px-3 font-bold">Kelebihan</th>
                  <th className="py-2.5 px-3 font-bold">Hal yang Perlu Diwaspadai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-800 dark:text-white">Fix Berjenjang (SP3K)</td>
                  <td className="py-2.5 px-3">Bunga tetap dalam beberapa tahap (misal 3 thn + 3 thn + 14 thn)</td>
                  <td className="py-2.5 px-3">Kepastian cicilan jangka panjang tanpa risiko lonjakan floating mendadak</td>
                  <td className="py-2.5 px-3">Cicilan melonjak secara terencana di bulan ke-37 dan ke-73</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-800 dark:text-white">Fixed / Tetap Sepanjang Tenor</td>
                  <td className="py-2.5 px-3">Satu tingkat bunga tetap dari bulan 1 sampai lunas (Anuitas)</td>
                  <td className="py-2.5 px-3">Sangat tenang dan mudah mengatur budgeting keuangan bulanan</td>
                  <td className="py-2.5 px-3">Biasanya suku bunga yang ditawarkan bank lebih tinggi daripada bunga promo</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-800 dark:text-white">Fix + Floating</td>
                  <td className="py-2.5 px-3">Promo fixed 1–5 tahun, selanjutnya floating mengikuti suku bunga pasar</td>
                  <td className="py-2.5 px-3">Cicilan sangat ringan di masa-masa awal menempati rumah</td>
                  <td className="py-2.5 px-3">Cicilan dapat melonjak 30%–60% saat memasuki masa bunga floating</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-800 dark:text-white">Bunga Flat Murni</td>
                  <td className="py-2.5 px-3">Bunga dihitung konstan dari plafon awal pinjaman</td>
                  <td className="py-2.5 px-3">Rumus sederhana: pokok dan bunga selalu sama setiap bulan</td>
                  <td className="py-2.5 px-3">Bunga flat 5% sebenarnya setara bunga efektif ~9.15% (jauh lebih mahal)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 2: INTERACTIVE FAQ WITH SCHEMA COMPLIANCE */}
      <section
        id="faq-kpr"
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs transition-colors space-y-6"
        aria-labelledby="heading-faq"
      >
        <header className="space-y-1.5 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-900/40">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Pertanyaan yang Sering Diajukan</span>
          </div>
          <h2
            id="heading-faq"
            className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight"
          >
            Tanya Jawab Seputar Pelunasan KPR (FAQ)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Jawaban lengkap seputar perhitungan pelunasan KPR, trik pembayaran ekstra, dan aturan perbankan.
          </p>
        </header>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {KPR_FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/80 transition cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white pr-2">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-150">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: INTERNAL JUMP LINKS & BREADCRUMBS */}
      <nav
        aria-label="Navigasi Fitur KPR"
        className="bg-slate-100/80 dark:bg-slate-900/80 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs flex flex-wrap items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
          <span className="font-bold text-slate-700 dark:text-slate-200">Navigasi Halaman:</span>
          <span>·</span>
          <span>Kalkulator KPR</span>
          <span>&gt;</span>
          <span>Simulasi Extra Payment</span>
          <span>&gt;</span>
          <span>Amortisasi SP3K</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href="#kalkulator-section"
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 font-bold hover:underline border border-slate-200 dark:border-slate-700"
          >
            Kalkulator Pokok
          </a>
          <a
            href="#skenario-section"
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 font-bold hover:underline border border-slate-200 dark:border-slate-700"
          >
            Tabel Skenario
          </a>
          <a
            href="#amortisasi-section"
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 font-bold hover:underline border border-slate-200 dark:border-slate-700"
          >
            Jadwal Amortisasi
          </a>
          <a
            href="#faq-kpr"
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 font-bold hover:underline border border-slate-200 dark:border-slate-700"
          >
            FAQ KPR
          </a>
        </div>
      </nav>
    </article>
  );
};
