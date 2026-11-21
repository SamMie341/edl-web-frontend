"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Clock,
  Search,
  Building2,
  Navigation,
  Globe,
  PhoneCall,
  ShieldAlert,
  ChevronRight,
  ArrowLeft,
  Mail,
  Copy,
  Check,
  Share2,
  Sparkles,
  ExternalLink,
  FileText,
  Users,
} from "lucide-react";
import type { Branch, ServiceCenter } from "@/domain";
import { getStorageUrl } from "@/infrastructure";
import { RichTextRenderer } from "@/presentation/components/ui/rich-text-renderer";

interface BranchDetailViewProps {
  branch: Branch;
  serviceCenters: ServiceCenter[];
  otherBranches: Branch[];
  regionName: string;
}

export function BranchDetailView({
  branch,
  serviceCenters,
  otherBranches,
  regionName,
}: BranchDetailViewProps) {
  const [copied, setCopied] = useState(false);
  const [copiedCenterId, setCopiedCenterId] = useState<number | null>(null);
  const [centerSearch, setCenterSearch] = useState("");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyCenterInfo = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedCenterId(id);
    setTimeout(() => setCopiedCenterId(null), 2000);
  };

  const filteredCenters = useMemo(() => {
    if (!centerSearch.trim()) return serviceCenters;
    const q = centerSearch.toLowerCase();
    return serviceCenters.filter((c) => {
      return (
        c.centerName.toLowerCase().includes(q) ||
        c.phoneNumber?.toLowerCase().includes(q) ||
        c.district?.name.toLowerCase().includes(q) ||
        c.village?.name.toLowerCase().includes(q)
      );
    });
  }, [serviceCenters, centerSearch]);

  const primaryPhone = branch.phoneNumber
    ? branch.phoneNumber.split(";")[0].trim()
    : "1199";

  const googleMapsUrl = branch.locationCoordinates
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        branch.locationCoordinates
      )}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        branch.branchName + " " + (branch.address || "")
      )}`;

  return (
    <div className="min-h-screen bg-slate-50 py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-[#2329c1] transition-colors">
            ໜ້າຫຼັກ
          </Link>
          <span>/</span>
          <Link
            href="/services/branches"
            className="hover:text-[#2329c1] transition-colors"
          >
            ສາຂາ ແລະ ສູນບໍລິການ 18 ແຂວງ
          </Link>
          <span>/</span>
          <span className="text-[#2329c1] font-semibold truncate max-w-xs sm:max-w-md">
            {branch.branchName}
          </span>
        </nav>

        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/services/branches"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#2329c1] transition-all bg-white px-4 py-2.5 rounded-xl border border-slate-200/80 shadow-sm hover:shadow active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ກັບໄປໜ້າລວມສາຂາທັງໝົດ 18 ແຂວງ</span>
          </Link>
        </div>

        {/* Header Hero Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#2329c1] via-[#1b209e] to-[#0c0e4a] p-5 sm:p-10 lg:p-12 text-white relative overflow-hidden shadow-xl mb-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-white/15 backdrop-blur-sm">
                {regionName}
              </span>
              {branch.province && (
                <span className="px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold border border-white/10">
                  ແຂວງ {branch.province.name}
                </span>
              )}
              {branch.district && (
                <span className="px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold border border-white/10">
                  ເມືອງ {branch.district.name}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4">
              {branch.branchName}
            </h1>

            <div className="flex items-start gap-2.5 text-sm sm:text-base text-blue-100 max-w-3xl mb-6">
              <MapPin className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
              <span>{branch.address || "ບໍ່ມີຂໍ້ມູນທີ່ຢູ່ລະອຽດ"}</span>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 pt-4 border-t border-white/15">
              <a
                href={`tel:${primaryPhone}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm hover:bg-amber-300 transition-colors shadow-lg active:scale-95"
              >
                <PhoneCall className="w-4 h-4" />
                <span>ໂທຕິດຕໍ່: {primaryPhone}</span>
              </a>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm transition-colors border border-white/20 active:scale-95"
              >
                <Navigation className="w-4 h-4 text-amber-300" />
                <span>ເປີດແຜນທີ່ນຳທາງ</span>
              </a>

              <button
                onClick={() =>
                  copyToClipboard(
                    `${branch.branchName}\nທີ່ຢູ່: ${branch.address || ""}\nເບີໂທ: ${branch.phoneNumber || "1199"}`
                  )
                }
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors border border-white/15"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>ສຳເນົາສຳເລັດ!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>ສຳເນົາຂໍ້ມູນ</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Content Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Branch Building Image */}
            {branch.branchImage && (
              <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <Building2 className="w-4 h-4 text-[#2329c1]" />
                    <span>ພາບອາຄານສຳນັກງານສາຂາ</span>
                  </div>
                  <a
                    href={getStorageUrl(branch.branchImage)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-[#2329c1] hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>ເປີດຮູບແທັບໃໝ່</span>
                  </a>
                </div>

                <a
                  href={getStorageUrl(branch.branchImage)}
                  target="_blank"
                  rel="noreferrer"
                  className="block relative h-56 sm:h-96 w-full rounded-2xl overflow-hidden bg-slate-100 group"
                >
                  <Image
                    src={getStorageUrl(branch.branchImage)}
                    alt={branch.branchName}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-4 py-2 rounded-xl bg-white/90 text-slate-900 font-bold text-xs flex items-center gap-1.5 shadow-lg">
                      <ExternalLink className="w-3.5 h-3.5 text-[#2329c1]" />
                      <span>ເປີດຮູບຕົ້ນສະບັບໃນແທັບໃໝ່</span>
                    </span>
                  </div>
                </a>
              </div>
            )}

            {/* Roles and Responsibilities */}
            {branch.roleResponsibilities && (
              <div className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-3 pb-5 mb-6 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2329c1] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                      ພາລະບົດບາດ ແລະ ໜ້າທີ່ຮັບຜິດຊອບ
                    </h2>
                    <p className="text-xs text-slate-500">
                      ເປົ້າໝາຍການປະຕິບັດງານ ແລະ ຍຸດທະສາດການບໍລິຫານຂອງສາຂາ
                    </p>
                  </div>
                </div>

                <RichTextRenderer content={branch.roleResponsibilities} />
              </div>
            )}

            {/* Organizational Structure / Chart */}
            {branch.orgChartImage && (
              <div className="bg-white rounded-3xl p-4 sm:p-8 border border-slate-200/80 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                        ໂຄງຮ່າງການຈັດຕັ້ງ (Organizational Chart)
                      </h2>
                      <p className="text-xs text-slate-500">
                        ແຜນຜັງສາຍການບັງຄັບບັນຊາ ແລະ ການບໍລິຫານງານພາຍໃນສາຂາ
                      </p>
                    </div>
                  </div>

                  <a
                    href={getStorageUrl(branch.orgChartImage)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-[#2329c1] hover:underline flex items-center gap-1 self-start sm:self-auto shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>ເບິ່ງຮູບຂະໜາດເຕັມ</span>
                  </a>
                </div>

                <a
                  href={getStorageUrl(branch.orgChartImage)}
                  target="_blank"
                  rel="noreferrer"
                  className="block relative w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 p-2 sm:p-4 hover:border-blue-300 transition-colors group cursor-zoom-in"
                >
                  <img
                    src={getStorageUrl(branch.orgChartImage)}
                    alt={`ໂຄງຮ່າງການຈັດຕັ້ງ ${branch.branchName}`}
                    className="w-full h-auto object-contain rounded-xl max-h-[600px] mx-auto group-hover:scale-[1.01] transition-transform duration-300"
                  />
                  <div className="mt-3 text-center text-xs text-slate-600 group-hover:text-[#2329c1] flex items-center justify-center gap-1 transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>ກົດເພື່ອເປີດເບິ່ງແຜນຜັງເຕັມຈໍໃນແທັບໃໝ່</span>
                  </div>
                </a>
              </div>
            )}

            {/* District Service Centers Grid */}
            <div className="bg-white rounded-3xl p-4 sm:p-8 border border-slate-200/80 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[#2329c1]" />
                    <span>ຫ້ອງການໄຟຟ້າເມືອງ & ສູນບໍລິການຍ່ອຍ</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    ຈຸດບໍລິການລູກຄ້າໃນຂອບເຂດຄວາມຮັບຜິດຊອບຂອງ {branch.branchName} (
                    {serviceCenters.length} ແຫ່ງ)
                  </p>
                </div>

                {serviceCenters.length > 3 && (
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="ຄົ້ນຫາຊື່ເມືອງ ຫຼື ສູນ..."
                      aria-label="ຄົ້ນຫາຊື່ເມືອງ ຫຼື ສູນບໍລິການ"
                      value={centerSearch}
                      onChange={(e) => setCenterSearch(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2329c1]"
                    />
                  </div>
                )}
              </div>

              {filteredCenters.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredCenters.map((center) => (
                    <div
                      key={center.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-blue-100/70 text-[#2329c1] text-[10px] font-bold">
                            {center.district?.name
                              ? `ເມືອງ ${center.district.name}`
                              : "ຫ້ອງການເມືອງ"}
                          </span>
                          {center.village?.name && (
                            <span className="text-[11px] text-slate-600">
                              ບ້ານ {center.village.name}
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug">
                          {center.centerName}
                        </h3>

                        {center.phoneNumber && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-2">
                            <Phone className="w-3.5 h-3.5 text-[#2329c1]" />
                            <span>{center.phoneNumber}</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-200/60 flex items-center gap-2">
                        {center.phoneNumber ? (
                          <a
                            href={`tel:${center.phoneNumber
                              .split(";")[0]
                              .trim()}`}
                            className="flex-1 py-1.5 px-3 rounded-lg bg-white border border-slate-200 hover:bg-[#2329c1] hover:text-white text-slate-700 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <PhoneCall className="w-3 h-3" />
                            <span>ໂທອອກ</span>
                          </a>
                        ) : (
                          <div className="flex-1 text-[11px] text-slate-600">
                            ສາຍດ່ວນ 1199
                          </div>
                        )}

                        <button
                          onClick={() =>
                            copyCenterInfo(
                              `${center.centerName}\nເບີໂທ: ${
                                center.phoneNumber || "1199"
                              }`,
                              center.id
                            )
                          }
                          className="p-2 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-[#2329c1] transition-colors"
                          title="ສຳເນົາຂໍ້ມູນ"
                          aria-label={`ສຳເນົາຂໍ້ມູນ ${center.centerName}`}
                        >
                          {copiedCenterId === center.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-600 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  {centerSearch
                    ? "ບໍ່ພົບສູນບໍລິການທີ່ຄົ້ນຫາ"
                    : "ຍັງບໍ່ມີຂໍ້ມູນສູນບໍລິການຍ່ອຍໃນລະບົບ"}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Area (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Contact Details Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <h2 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#2329c1]" />
                <span>ຂໍ້ມູນການຕິດຕໍ່ສາຂາ</span>
              </h2>

              <div className="space-y-3.5 text-xs text-slate-600">
                <div>
                  <span className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                    ເບີໂທລະສັບຕິດຕໍ່:
                  </span>
                  <div className="space-y-1">
                    {(branch.phoneNumber || "1199").split(";").map((ph, idx) => (
                      <a
                        key={idx}
                        href={`tel:${ph.trim()}`}
                        className="font-bold text-[#2329c1] hover:underline flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>{ph.trim()}</span>
                      </a>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                    ທີ່ຕັ້ງສຳນັກງານ:
                  </span>
                  <p className="leading-relaxed">
                    {branch.address || "ບໍ່ມີຂໍ້ມູນທີ່ຢູ່"}
                  </p>
                </div>

                {branch.email && (
                  <div>
                    <span className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                      ອີເມວຕິດຕໍ່:
                    </span>
                    <a
                      href={`mailto:${branch.email}`}
                      className="text-[#2329c1] hover:underline flex items-center gap-1.5 min-w-0"
                    >
                      <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="break-all">{branch.email}</span>
                    </a>
                  </div>
                )}

                <div>
                  <span className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                    ໂມງລັດຖະການ:
                  </span>
                  <p className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>ຈັນ - ສຸກ: 08:00 - 16:30 ໂມງ</span>
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-[#2329c1] hover:text-white text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors active:scale-95"
                >
                  <Navigation className="w-4 h-4 text-[#2329c1] group-hover:text-white" />
                  <span>ເບິ່ງແຜນທີ່ Google Maps</span>
                </a>
              </div>
            </div>

            {/* Emergency Hotline 1199 Box */}
            <div className="rounded-3xl bg-gradient-to-br from-amber-500 to-amber-600 p-6 text-white shadow-lg space-y-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-200" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-100">
                  ສາຍດ່ວນ 24 ຊົ່ວໂມງ
                </span>
              </div>
              <h3 className="text-lg font-black leading-snug">
                ແຈ້ງເຫດໄຟຟ້າຂັດຂ້ອງ & ສຸກເສີນ
              </h3>
              <p className="text-xs text-amber-100 leading-relaxed">
                ຫາກພົບເຫັນອຸບັດຕິເຫດສາຍໄຟຂາດ, ເສົາໄຟລົ້ມ ຫຼື ໄຟດັບເປັນບໍລິເວນກວ້າງ
                ສາມາດແຈ້ງສາຍດ່ວນໄດ້ທັນທີ.
              </p>
              <a
                href="tel:1199"
                className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-white text-slate-900 font-black text-sm shadow-md hover:bg-amber-50 transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-amber-600" />
                <span>ໂທສາຍດ່ວນ 1199 (ຟຣີ)</span>
              </a>
            </div>

            {/* Other Branches Recommendation List */}
            {otherBranches.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
                <h3 className="text-sm font-extrabold text-slate-900 pb-2 border-b border-slate-100">
                  ສາຂາອື່ນໆ ທີ່ໜ້າສົນໃຈ
                </h3>

                <div className="space-y-2">
                  {otherBranches.map((other) => (
                    <Link
                      key={other.id}
                      href={`/services/branches/${other.id}`}
                      className="p-3 rounded-xl hover:bg-blue-50/50 border border-transparent hover:border-blue-100 transition-all flex items-center justify-between group"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="text-xs font-bold text-slate-800 group-hover:text-[#2329c1] truncate">
                          {other.branchName}
                        </div>
                        <div className="text-[11px] text-slate-600 truncate">
                          {other.province?.name || other.address || "ສາຂາ ຟຟລ"}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#2329c1] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  ))}
                </div>

                <div className="pt-2">
                  <Link
                    href="/services/branches"
                    className="text-xs font-bold text-[#2329c1] hover:underline flex items-center justify-center gap-1 pt-2"
                  >
                    <span>ເບິ່ງທັງໝົດ 18 ແຂວງ</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
