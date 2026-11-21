import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Zap,
  Download,
  Calculator,
  FileText,
  HelpCircle,
  ArrowRight,
  Calendar,
} from "lucide-react";
import { getTariffsUseCase, getLegislationsUseCase } from "@/application";
import { getStorageUrl } from "@/infrastructure";

export const metadata: Metadata = {
  title: "ອັດຕາຄ່າກະແສໄຟຟ້າທາງການ | ລັດວິສາຫະກິດໄຟຟ້າລາວ (EDL)",
  description:
    "ໂຄງສ້າງອັດຕາຄ່າກະແສໄຟຟ້າ ລັດວິສາຫະກິດໄຟຟ້າລາວ ແຍກຕາມແຕ່ລະປະເພດການຊົມໃຊ້ ພ້ອມດາວໂຫຼດເອກະສານດຳລັດທາງການ (PDF).",
};

const FAQS = [
  {
    q: "ການຄິດໄລ່ຄ່າໄຟຟ້າແບບຂັ້ນໄດກ້າວໜ້າ 8 ຂັ້ນ (Progressive Tiers) ຄິດໄລ່ແນວໃດ?",
    a: "ຕາມແຈ້ງການເລກທີ 1916/ຟຟລ.ຝທຜ, ການຄິດໄລ່ຄ່າໄຟຟ້າປະເພດທີ່ຢູ່ອາໄສໄດ້ແບ່ງອອກເປັນ 8 ຂັ້ນບັນໄດ. ການຄິດໄລ່ແມ່ນແຍກຕາມຈຳນວນໜ່ວຍໃນແຕ່ລະຂັ້ນ ບໍ່ແມ່ນເອົາໜ່ວຍທັງໝົດໄປຄູນກັບອັດຕາຂັ້ນສູງສຸດ. ຕົວຢ່າງ: ໃຊ້ໄຟ 200 ໜ່ວຍ (ປີ 2026) ຈະຄິດ 25 ໜ່ວຍທຳອິດ (0-25) ທີ່ 355 ກີບ = 8,875 ກີບ; 125 ໜ່ວຍຕໍ່ມາ (26-150) ທີ່ 422 ກີບ = 52,750 ກີບ; ແລະ 50 ໜ່ວຍທີ່ເຫຼືອ (151-200) ທີ່ 999 ກີບ = 49,950 ກີບ ແລ້ວນຳມາບວກລວມກັນ.",
  },
  {
    q: "ນະໂຍບາຍສ່ວນຫຼຸດຊ່ວງລະດູຮ້ອນ (5%) ມີເງື່ອນໄຂແນວໃດ?",
    a: "ໃນຊ່ວງລະດູຮ້ອນ (ເດືອນ ມີນາ ຫາ ພຶດສະພາ), ຄົວເຮືອນທີ່ຊົມໃຊ້ໄຟຟ້າບໍ່ເກີນ 300 kWh ຕໍ່ເດືອນ ຈະໄດ້ຮັບສ່ວນຫຼຸດຄ່າພະລັງງານໄຟຟ້າ 5% ອັດຕະໂນມັດ ເພື່ອຫຼຸດຜ່ອນພາລະລາຍຈ່າຍຂອງປະຊາຊົນ.",
  },
  {
    q: "ອາກອນມູນຄ່າເພີ່ມ (VAT) ຄິດໄລ່ເທົ່າໃດ?",
    a: "ອາກອນມູນຄ່າເພີ່ມແມ່ນ 10% (0.10) ຕາມກົດໝາຍວ່າດ້ວຍສ່ວຍສາອາກອນສະບັບປັບປຸງໃໝ່ຂອງ ສປປ ລາວ ໂດຍຄິດໄລ່ຈາກຍອດລວມຂອງຄ່າພະລັງງານໄຟຟ້າ (ຫຼັງຫັກສ່ວນຫຼຸດ ຖ້າມີ).",
  },
  {
    q: "ເປັນຫຍັງໃນລະດູຮ້ອນຄ່າໄຟຟ້າຈຶ່ງສູງຂຶ້ນ ທັງທີ່ໃຊ້ເຄື່ອງໃຊ້ເທົ່າເດີມ?",
    a: "ເນື່ອງຈາກອຸນຫະພູມພາຍນອກສູງຂຶ້ນ (38°C - 42°C) ເຮັດໃຫ້ເຄື່ອງປັບອາກາດ ແລະ ຕູ້ເຢັນ ຕ້ອງເຮັດວຽກໜັກຂຶ້ນຫຼາຍເທົ່າເພື່ອກົດອຸນຫະພູມລົງ ຈຶ່ງກິນກະແສໄຟຟ້າຫຼາຍຂຶ້ນໂດຍອັດຕະໂນມັດ ແລະ ອາດເຮັດໃຫ້ໜ່ວຍໄຟຟ້າຂ້າມໄປຕົກຢູ່ຂັ້ນໄດທີ່ມີລາຄາສູງກວ່າ.",
  },
];

export default async function TariffsPage() {
  const [apiTariffs, legislations] = await Promise.all([
    getTariffsUseCase(),
    getLegislationsUseCase(),
  ]);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "ອັບເດດລ່າສຸດ";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-[#2329c1] transition-colors">
            ໜ້າຫຼັກ
          </Link>
          <span>/</span>
          <span>ການບໍລິການ</span>
          <span>/</span>
          <span className="text-[#2329c1] font-semibold">ອັດຕາຄ່າກະແສໄຟຟ້າ</span>
        </nav>

        {/* Page Hero Header */}
        <div className="rounded-3xl bg-gradient-to-r from-[#2329c1] via-[#1b209e] to-[#101357] p-6 sm:p-10 lg:p-12 text-white relative overflow-hidden shadow-xl mb-10 sm:mb-12">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-amber-300 text-xs font-semibold mb-4 border border-white/15 backdrop-blur-sm">
              <Zap className="w-3.5 h-3.5" />
              <span>ໂຄງສ້າງລາຄາທາງການ (Official EDL Electricity Tariffs)</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              ອັດຕາຄ່າກະແສໄຟຟ້າ ລັດວິສາຫະກິດໄຟຟ້າລາວ
            </h1>
            <p className="mt-3 text-sm sm:text-base text-blue-100 leading-relaxed">
              ຂໍ້ມູນອັດຕາຄ່າກະແສໄຟຟ້າປະຈຸບັນ ທີ່ໄດ້ຮັບການອະນຸມັດຈາກລັດຖະບານ ແຫ່ງ ສປປ ລາວ,
              ແຍກຕາມແຕ່ລະປະເພດການຊົມໃຊ້ ເພື່ອຄວາມໂປ່ງໃສ ແລະ ຖືກຕ້ອງຕາມລະບຽບການ.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/services/tariff-calculator"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-400 text-slate-900 font-bold text-xs hover:bg-amber-300 transition-all shadow-md active:scale-95"
              >
                <Calculator className="w-4 h-4" />
                <span>ທົດລອງຄຳນວນຄ່າໄຟ ແລະ ຈຳລອງແຜນປະຢັດໄຟ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Official Tariff Notices from EDL Database */}
        <div className="mb-10 sm:mb-12 bg-white rounded-3xl p-4 sm:p-8 border border-slate-200/80 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2329c1] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  ແຈ້ງການອັດຕາຄ່າໄຟຟ້າທາງການ ຈາກຖານຂໍ້ມູນ EDL
                </h2>
                <p className="text-xs text-slate-500">
                  ດາວໂຫຼດເອກະສານປະກາດອັດຕາລາຄາ ແລະ ເອກະສານອ້າງອີງ
                </p>
              </div>
            </div>
            <span className="self-start sm:self-auto text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-[#2329c1] shrink-0">
              {apiTariffs.length} ລາຍການ
            </span>
          </div>

          {apiTariffs.length === 0 ? (
            <p className="text-sm text-slate-600 py-6 text-center">
              ຍັງບໍ່ມີຂໍ້ມູນປະກາດອັດຕາຄ່າໄຟຟ້າໃນຂະນະນີ້
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {apiTariffs.map((tariff) => (
                <div
                  key={tariff.id}
                  className="rounded-2xl border border-slate-200 p-5 bg-slate-50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#2329c1] text-white text-[10px] font-bold">
                        {tariff.tariffType}
                      </span>
                      <span className="text-[11px] text-slate-600">
                        {formatDate(tariff.effectiveDate)}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mb-2">
                      {tariff.title}
                    </h3>

                    {tariff.imageUrl && (
                      <div className="w-full h-40 rounded-xl overflow-hidden mb-3 bg-white border border-slate-200">
                        <img
                          src={getStorageUrl(tariff.imageUrl)}
                          alt={tariff.title}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-200">
                    {tariff.pdfUrl ? (
                      <a
                        href={getStorageUrl(tariff.pdfUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2 px-3 rounded-xl bg-[#2329c1] hover:bg-[#1a1f9e] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>ດາວໂຫຼດເອກະສານ (PDF)</span>
                      </a>
                    ) : (
                      <div className="text-center text-xs text-slate-600 py-1 font-medium">
                        ມີຜົນບັງຄັບໃຊ້ແລ້ວ
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Official Decree Downloads Section */}
        <div className="mb-10 sm:mb-12 bg-slate-900 text-white rounded-3xl p-5 sm:p-8 relative overflow-hidden shadow-xl">
          <div className="flex items-start sm:items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                ດາວໂຫຼດເອກະສານດຳລັດ ແລະ ແຈ້ງການທາງການ (PDF)
              </h3>
              <p className="text-xs text-slate-400">
                ເອກະສານອ້າງອີງທາງກົດໝາຍກ່ຽວກັບໂຄງສ້າງລາຄາ ແລະ ອັດຕາຄ່າກະແສໄຟຟ້າແຫ່ງຊາດ
              </p>
            </div>
          </div>

          {legislations.length === 0 ? (
            <p className="text-sm text-slate-400 py-4 text-center">
              ຍັງບໍ່ມີເອກະສານດຳລັດເຜີຍແຜ່ໃນຂະນະນີ້
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {legislations.map((leg) => (
                <div
                  key={leg.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between hover:bg-white/10 transition-colors"
                >
                  <div>
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                      {leg.documentNumber || "ເອກະສານທາງການ"}
                    </span>
                    <h4 className="text-xs sm:text-sm font-semibold text-white mt-2 leading-snug">
                      {leg.title}
                    </h4>
                    <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(leg.issueDate)}</span>
                      <span>•</span>
                      <span>PDF</span>
                    </div>
                  </div>

                  {leg.fileUrl ? (
                    <a
                      href={getStorageUrl(leg.fileUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 w-full py-2 rounded-xl bg-white/15 hover:bg-[#2329c1] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>ດາວໂຫຼດເອກະສານ (PDF)</span>
                    </a>
                  ) : (
                    <span className="mt-4 text-xs text-slate-400 text-center py-2">
                      ຕິດຕໍ່ຫ້ອງການ ຟຟລ
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="w-6 h-6 text-[#2329c1] shrink-0" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              ຄຳຖາມທີ່ພົບເລື້ອຍ ກ່ຽວກັບອັດຕາຄ່າໄຟຟ້າ (FAQ)
            </h3>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-100"
              >
                <div className="text-sm font-bold text-slate-900 mb-1.5 flex items-start gap-2">
                  <span className="text-[#2329c1] shrink-0">Q{idx + 1}:</span>
                  <span>{faq.q}</span>
                </div>
                <div className="text-xs sm:text-sm text-slate-600 pl-0 sm:pl-6 leading-relaxed">
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
