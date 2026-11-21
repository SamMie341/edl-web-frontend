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
  Filter,
  Mail,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import type { BranchDisplay } from "@/domain";
import { getStorageUrl } from "@/infrastructure";

interface BranchesListViewProps {
  branches: BranchDisplay[];
}

export function BranchesListView({ branches }: BranchesListViewProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredBranches = useMemo(() => {
    return branches.filter((branch) => {
      // Region filter
      if (selectedRegion !== "all" && branch.region !== selectedRegion) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          branch.name.toLowerCase().includes(query) ||
          branch.province.toLowerCase().includes(query) ||
          branch.address.toLowerCase().includes(query) ||
          branch.phone.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [branches, selectedRegion, searchQuery]);

  const hqBranch = branches.find((b) => b.isHeadquarters);

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-[#2329c1] transition-colors">
            ໜ້າຫຼັກ
          </Link>
          <span>/</span>
          <Link href="/services" className="hover:text-[#2329c1] transition-colors">
            ບໍລິການ
          </Link>
          <span>/</span>
          <span className="text-[#2329c1] font-semibold">
            ສາຂາທົ່ວປະເທດ 18 ແຂວງ
          </span>
        </nav>

        {/* Hero Header */}
        <div className="rounded-3xl bg-gradient-to-r from-[#2329c1] via-[#1b209e] to-[#0c0e4a] p-6 sm:p-10 lg:p-12 text-white relative overflow-hidden shadow-xl mb-8 sm:mb-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-amber-300 text-xs font-semibold mb-4 border border-white/15 backdrop-blur-sm shadow-sm">
              <Globe className="w-3.5 h-3.5" />
              <span>ເຄືອຂ່າຍບໍລິການໄຟຟ້າລາວ ທົ່ວປະເທດ (18 ແຂວງ)</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              ສາຂາ ແລະ ສູນບໍລິການ ຟຟລ ທົ່ວປະເທດ
            </h1>
            <p className="mt-3 text-sm sm:text-base text-blue-100 leading-relaxed">
              ລັດວິສາຫະກິດໄຟຟ້າລາວ ພ້ອມໃຫ້ບໍລິການ ແລະ ສະໜັບສະໜູນປະຊາຊົນ
              ຜ່ານສາຂາປະຈຳ 18 ແຂວງ ແລະ ສູນບໍລິການລູກຄ້າຍ່ອຍ.
              ສາມາດຄົ້ນຫາທີ່ຕັ້ງ, ເບີໂທລະສັບຕິດຕໍ່ ແລະ ເສັ້ນທາງໄດ້ສະດວກຕະຫຼອດ 24 ຊົ່ວໂມງ.
            </p>

            {/* Quick Hotline Bar */}
            <div className="mt-6 pt-6 border-t border-white/15 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-black text-sm shadow-md animate-bounce-subtle">
                  1199
                </div>
                <div>
                  <div className="text-[11px] text-blue-200">
                    ສາຍດ່ວນແຈ້ງເຫດໄຟຟ້າຂັດຂ້ອງ (24/7)
                  </div>
                  <div className="text-sm font-bold text-white">
                    ໂທຟຣີທົ່ວປະເທດ 1199
                  </div>
                </div>
              </div>

              <div className="hidden sm:block h-8 w-px bg-white/20" />

              <div className="flex items-center gap-2 text-xs text-blue-100">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>ທີມງານວິສະວະກອນສຸກເສີນພ້ອມປະຕິບັດງານຕະຫຼອດ 24 ຊົ່ວໂມງ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Headquarters Card */}
        {hqBranch && (
          <div className="bg-white rounded-3xl p-4 sm:p-8 border border-slate-200/80 shadow-md mb-8 sm:mb-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50/60 rounded-full blur-3xl pointer-events-none" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center relative z-10">
              {/* HQ Building Image Showcase */}
              <div className="lg:col-span-5 relative h-56 sm:h-72 w-full rounded-2xl overflow-hidden shadow-md bg-slate-100">
                <Image
                  src={getStorageUrl(hqBranch.image || hqBranch.branchImage)}
                  alt={hqBranch.name}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2329c1] text-white text-xs font-bold shadow-md">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>ສຳນັກງານໃຫຍ່ (Headquarters)</span>
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="text-[11px] text-blue-200 font-medium">ສູນກາງການບໍລິຫານງານໄຟຟ້າລາວ</div>
                  <div className="text-sm font-bold text-white truncate">ນະຄອນຫຼວງວຽງຈັນ</div>
                </div>
              </div>

              {/* HQ Details & CTAs */}
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2329c1] text-xs font-bold border border-blue-100 mb-2">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>ສຳນັກງານໃຫຍ່ (Headquarters)</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                    {hqBranch.name}
                  </h2>
                </div>

                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                  <MapPin className="w-4 h-4 text-[#2329c1] shrink-0 mt-0.5" />
                  <span>{hqBranch.address}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#2329c1]" />
                    <span className="font-semibold text-slate-700">{hqBranch.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{hqBranch.hours}</span>
                  </div>
                  {hqBranch.email && (
                    <div className="flex items-center gap-2 sm:col-span-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{hqBranch.email}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 pt-3">
                  <a
                    href="tel:021316120"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#2329c1] text-white text-xs font-bold hover:bg-[#1b209e] transition-colors shadow-md shadow-blue-700/20 active:scale-95"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>ໂທຕິດຕໍ່ສຳນັກງານໃຫຍ່</span>
                  </a>
                  <a
                    href="https://maps.google.com/?q=Electricite+du+Laos+Headquarters"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors active:scale-95"
                  >
                    <Navigation className="w-4 h-4 text-[#2329c1]" />
                    <span>ແຜນທີ່ນຳທາງ (Google Maps)</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-sm mb-8 sm:mb-10 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ຄົ້ນຫາຊື່ສາຂາ, ແຂວງ, ເມືອງ ຫຼື ເບີໂທລະສັບ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2329c1] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Region Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-slate-400 mr-1" />
              <button
                onClick={() => setSelectedRegion("all")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                  selectedRegion === "all"
                    ? "bg-[#2329c1] text-white shadow-md shadow-blue-700/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                ທຸກພາກ (ທັງໝົດ {branches.filter((b) => !b.isHeadquarters).length} ແຫ່ງ)
              </button>
              <button
                onClick={() => setSelectedRegion("north")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                  selectedRegion === "north"
                    ? "bg-[#2329c1] text-white shadow-md shadow-blue-700/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                ພາກເໜືອ (7 ແຂວງ)
              </button>
              <button
                onClick={() => setSelectedRegion("central")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                  selectedRegion === "central"
                    ? "bg-[#2329c1] text-white shadow-md shadow-blue-700/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                ພາກກາງ (7 ແຂວງ & ນະຄອນຫຼວງ)
              </button>
              <button
                onClick={() => setSelectedRegion("south")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                  selectedRegion === "south"
                    ? "bg-[#2329c1] text-white shadow-md shadow-blue-700/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                ພາກໃຕ້ (4 ແຂວງ)
              </button>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              ພົບເຫັນ{" "}
              <strong className="text-[#2329c1]">
                {filteredBranches.filter((b) => !b.isHeadquarters).length}
              </strong>{" "}
              ສາຂາປະຈຳແຂວງ
            </div>
          </div>
        </div>

        {/* Branches Grid with Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredBranches
            .filter((branch) => !branch.isHeadquarters)
            .map((branch) => {
              const hasImage = Boolean(branch.image || branch.coverImage || branch.branchImage);
              const imageUrl = getStorageUrl(branch.image || branch.coverImage || branch.branchImage);

              return (
                <div
                  key={branch.id}
                  className="group bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-2xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    {/* Branch Card Image Header */}
                    <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-gradient-to-br from-[#121568] via-[#1a1f9e] to-[#2329c1]">
                      {hasImage ? (
                        <Image
                          src={imageUrl}
                          alt={branch.name}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center p-2.5 mb-2 border border-white/20 shadow-md">
                            <Image
                              src="/edl-logo-v2.png"
                              alt="EDL"
                              width={40}
                              height={40}
                              className="object-contain drop-shadow"
                            />
                          </div>
                          <span className="text-white/90 text-xs font-bold tracking-wide">
                            ລັດວິສາຫະກິດໄຟຟ້າລາວ
                          </span>
                          <span className="text-blue-200 text-[11px] truncate max-w-[200px]">
                            {branch.name}
                          </span>
                        </div>
                      )}

                      {/* Gradient Vignette Overlay for High Contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#2329c1] text-xs font-bold shadow-sm">
                          {branch.province}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3 z-10">
                        <span className="px-2.5 py-1 rounded-full bg-slate-900/75 backdrop-blur-md text-white text-[11px] font-semibold border border-white/15 shadow-sm">
                          {branch.region === "north"
                            ? "ພາກເໜືອ"
                            : branch.region === "south"
                            ? "ພາກໃຕ້"
                            : "ພາກກາງ"}
                        </span>
                      </div>

                      {/* Clickable Image Overlay */}
                      {branch.id !== 0 && (
                        <Link
                          href={`/services/branches/${branch.id}`}
                          className="absolute inset-0 z-0"
                          aria-label={`ເບິ່ງລາຍລະອຽດ ${branch.name}`}
                        />
                      )}
                    </div>

                    {/* Branch Info Body */}
                    <div className="p-4 sm:p-6">
                      {branch.id !== 0 ? (
                        <Link
                          href={`/services/branches/${branch.id}`}
                          className="group-hover:text-[#2329c1] transition-colors block"
                        >
                          <h3 className="text-base font-extrabold text-slate-900 leading-snug mb-2.5 hover:text-[#2329c1] line-clamp-1">
                            {branch.name}
                          </h3>
                        </Link>
                      ) : (
                        <h3 className="text-base font-extrabold text-slate-900 leading-snug mb-2.5 line-clamp-1">
                          {branch.name}
                        </h3>
                      )}

                      {/* Address */}
                      <div className="flex items-start gap-2 text-xs text-slate-600 mb-3.5 leading-relaxed line-clamp-2">
                        <MapPin className="w-3.5 h-3.5 text-[#2329c1] shrink-0 mt-0.5" />
                        <span>{branch.address}</span>
                      </div>

                      {/* Hours & Email */}
                      <div className="space-y-1.5 text-xs text-slate-500 pt-2.5 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{branch.hours}</span>
                        </div>
                        {branch.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{branch.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="px-4 sm:px-6 pb-5 sm:pb-6 pt-1 flex items-center gap-2 z-10">
                    <a
                      href={`tel:${branch.phone.split(";")[0].trim()}`}
                      className="flex-1 min-w-0 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-blue-50 text-[#2329c1] hover:bg-blue-100 transition-colors text-xs font-bold active:scale-95"
                    >
                      <Phone className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{branch.phone.split(";")[0].trim()}</span>
                    </a>

                    {branch.id !== 0 && (
                      <Link
                        href={`/services/branches/${branch.id}`}
                        className="inline-flex items-center gap-1 px-3.5 py-2.5 rounded-xl bg-[#2329c1] hover:bg-[#1a1f9e] text-white transition-colors text-xs font-bold active:scale-95 shadow-sm shrink-0"
                      >
                        <span>ລາຍລະອຽດ</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    )}

                    <button
                      onClick={() =>
                        copyToClipboard(
                          `${branch.name}\n${branch.address}\nເບີໂທ: ${branch.phone}`,
                          branch.id
                        )
                      }
                      title="ສຳເນົາຂໍ້ມູນສາຂາ"
                      className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-[#2329c1] hover:bg-slate-50 transition-colors active:scale-95 shrink-0"
                    >
                      {copiedId === branch.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Empty Search Result */}
        {filteredBranches.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm max-w-lg mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              ບໍ່ພົບສາຂາທີ່ຄົ້ນຫາ
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              ກະລຸນາກວດສອບຊື່ແຂວງ ຫຼື ຄຳຄົ້ນຫາໃໝ່
            </p>
            <button
              onClick={() => {
                setSelectedRegion("all");
                setSearchQuery("");
              }}
              className="px-6 py-2.5 rounded-full bg-[#2329c1] text-white text-xs font-semibold hover:bg-[#1b209e] transition-colors shadow-md shadow-blue-700/20"
            >
              ລຶບຄຳຄົ້ນຫາທັງໝົດ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
