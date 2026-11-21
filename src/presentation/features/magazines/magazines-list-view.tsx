"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  Download,
  ExternalLink,
  Calendar,
  Eye,
  Search,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  FileText,
} from "lucide-react";
import type { Magazine } from "@/domain";
import { formatLaoDate, formatNumber } from "@/shared";
import { MagazineCoverImage } from "./magazine-cover-image";
import { useMagazineDownload } from "./use-magazine-download";

type SortOrder = "latest" | "popular" | "oldest";

interface MagazinesListViewProps {
  magazines: Magazine[];
}

function getMagazineYear(mag: Magazine): string | null {
  if (mag.publishedYear && mag.publishedYear.trim()) {
    return mag.publishedYear.trim();
  }
  if (!mag.publishedDate) return null;
  const date = new Date(mag.publishedDate);
  if (isNaN(date.getTime())) return null;
  return String(date.getFullYear());
}

function getPublishedTimestamp(mag: Magazine): number {
  const raw = mag.publishedDate || mag.createdAt;
  if (!raw) return 0;
  const ts = new Date(raw).getTime();
  return isNaN(ts) ? 0 : ts;
}

export function MagazinesListView({ magazines }: MagazinesListViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("ທັງໝົດ");
  const [sortBy, setSortBy] = useState<SortOrder>("latest");

  const { getDownloadCount, trackDownload } = useMagazineDownload(magazines);

  const yearOptions = useMemo(() => {
    const years = Array.from(
      new Set(
        magazines
          .map(getMagazineYear)
          .filter((y): y is string => Boolean(y))
      )
    ).sort((a, b) => Number(b) - Number(a));
    return ["ທັງໝົດ", ...years];
  }, [magazines]);

  const totalDownloads = useMemo(
    () => magazines.reduce((sum, mag) => sum + getDownloadCount(mag), 0),
    [magazines, getDownloadCount]
  );

  const filteredMagazines = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = magazines.filter((mag) => {
      const year = getMagazineYear(mag);
      if (selectedYear !== "ທັງໝົດ" && year !== selectedYear) {
        return false;
      }

      if (query) {
        const title = (mag.title || "").toLowerCase();
        const issue = (mag.issueNumber || "").toLowerCase();
        const desc = (mag.description || "").toLowerCase();
        const yearStr = (year || "").toLowerCase();
        return (
          title.includes(query) ||
          issue.includes(query) ||
          desc.includes(query) ||
          yearStr.includes(query)
        );
      }

      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "popular") {
        return getDownloadCount(b) - getDownloadCount(a);
      }
      if (sortBy === "oldest") {
        return getPublishedTimestamp(a) - getPublishedTimestamp(b);
      }
      return getPublishedTimestamp(b) - getPublishedTimestamp(a);
    });
  }, [magazines, searchQuery, selectedYear, sortBy, getDownloadCount]);

  const showFeaturedSpotlight =
    selectedYear === "ທັງໝົດ" &&
    !searchQuery.trim() &&
    sortBy === "latest" &&
    filteredMagazines.length > 0;

  const featuredMagazine = showFeaturedSpotlight ? filteredMagazines[0] : null;
  const gridMagazines = showFeaturedSpotlight
    ? filteredMagazines.slice(1)
    : filteredMagazines;

  const hasActiveFilters =
    selectedYear !== "ທັງໝົດ" || searchQuery.trim().length > 0 || sortBy !== "latest";

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-[#2329c1] transition-colors">
            ໜ້າຫຼັກ
          </Link>
          <span>/</span>
          <span className="text-[#2329c1] font-semibold">
            ວາລະສານ ຟຟລ (EDL Magazine)
          </span>
        </nav>

        {/* Page Hero Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#2329c1] via-[#1b209e] to-[#0c0e4a] p-6 sm:p-10 lg:p-12 text-white relative overflow-hidden shadow-xl mb-8 sm:mb-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-amber-300 text-xs font-semibold mb-4 border border-white/15 backdrop-blur-sm shadow-sm">
                <BookOpen className="w-3.5 h-3.5" />
                <span>ສິ່ງພິມທາງການ & ວາລະສານດິຈິຕອນ (EDL E-Magazine)</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                ວາລະສານ ໄຟຟ້າລາວ (EDL Magazine)
              </h1>
              <p className="mt-3 text-sm sm:text-base text-blue-100 leading-relaxed">
                ຕິດຕາມບົດຄວາມພິເສດ, ບົດວິເຄາະດ້ານພະລັງງານ, ຜົນງານການພັດທະນາຕາໜ່າງໄຟຟ້າ
                ແລະ ທິດທາງແຜນການຂອງ ລັດວິສາຫະກິດໄຟຟ້າລາວ ໃນຮູບແບບ E-Magazine ອ່ານອອນລາຍ ແລະ ດາວໂຫຼດຟຣີ.
              </p>
            </div>

            {/* Quick Summary Stats */}
            <div className="grid grid-cols-2 sm:flex items-center gap-3 shrink-0 w-full lg:w-auto">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-3.5 sm:px-4 py-3 sm:min-w-[125px]">
                <div className="text-[11px] text-blue-200 font-medium">
                  ວາລະສານທັງໝົດ
                </div>
                <div className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
                  {formatNumber(magazines.length)}{" "}
                  <span className="text-xs font-semibold text-amber-300">ສະບັບ</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-3.5 sm:px-4 py-3 sm:min-w-[140px]">
                <div className="text-[11px] text-blue-200 font-medium">
                  ຍອດດາວໂຫຼດລວມ
                </div>
                <div className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
                  {formatNumber(totalDownloads)}{" "}
                  <span className="text-xs font-semibold text-amber-300">ຄັ້ງ</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search, Year Filter & Sort Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-sm mb-8 sm:mb-10 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ຄົ້ນຫາຊື່ວາລະສານ, ເລກທີສະບັບ ຫຼື ປີພິມ..."
                aria-label="ຄົ້ນຫາຊື່ວາລະສານ, ເລກທີສະບັບ ຫຼື ປີພິມ"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2329c1] focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 shrink-0">
                <SlidersHorizontal className="w-4 h-4 text-[#2329c1]" />
                <span>ຈັດລຽງ:</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOrder)}
                aria-label="ຈັດລຽງວາລະສານ"
                className="flex-1 md:flex-none bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2329c1] cursor-pointer"
              >
                <option value="latest">ສະບັບລ່າສຸດ</option>
                <option value="popular">ຍອດດາວໂຫຼດສູງສຸດ</option>
                <option value="oldest">ສະບັບເກົ່າສຸດ</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 text-xs">
            <span className="text-slate-600 font-semibold mr-1">ປີພິມ:</span>
            {yearOptions.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-3.5 py-1.5 rounded-full font-medium transition-all duration-200 active:scale-95 ${
                  selectedYear === year
                    ? "bg-[#2329c1] text-white shadow-md shadow-blue-700/25"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {year}
              </button>
            ))}
            <span className="ml-auto text-slate-600 font-medium">
              ພົບ <strong>{formatNumber(filteredMagazines.length)}</strong> ສະບັບ
            </span>
          </div>
        </div>

        {/* Featured Latest Issue Spotlight */}
        {featuredMagazine && (
          <div className="mb-12">
            <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
                {/* 3D Book Cover Showcase */}
                <div className="lg:col-span-5 bg-gradient-to-br from-slate-100 via-blue-50/50 to-slate-100 p-8 sm:p-10 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-100">
                  <Link
                    href={`/magazines/${featuredMagazine.id}`}
                    className="group relative aspect-[3/4] w-full max-w-[280px] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-900/10 transition-transform duration-500 hover:-translate-y-1.5"
                  >
                    <MagazineCoverImage
                      coverImage={featuredMagazine.coverImage}
                      title={featuredMagazine.title}
                      issueNumber={featuredMagazine.issueNumber}
                      sizes="280px"
                      priority
                    />
                    <div className="absolute top-3 left-3 z-10">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400 text-slate-900 text-[11px] font-extrabold shadow-md">
                        <Sparkles className="w-3 h-3" />
                        <span>ສະບັບລ່າສຸດ</span>
                      </span>
                    </div>
                  </Link>
                </div>

                {/* Details & Actions */}
                <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-4">
                      <span className="font-bold text-[#2329c1] bg-blue-50 px-3 py-1 rounded-full">
                        {featuredMagazine.issueNumber || "ສະບັບລ່າສຸດ"}
                      </span>
                      {featuredMagazine.publishedDate && (
                        <span className="flex items-center gap-1.5 font-medium text-slate-600">
                          <Calendar className="w-3.5 h-3.5 text-[#2329c1]" />
                          {formatLaoDate(featuredMagazine.publishedDate)}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        {formatNumber(getDownloadCount(featuredMagazine))} ດາວໂຫຼດ
                      </span>
                    </div>

                    <Link href={`/magazines/${featuredMagazine.id}`}>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 hover:text-[#2329c1] transition-colors leading-snug mb-3">
                        {featuredMagazine.title}
                      </h2>
                    </Link>

                    <p className="text-sm text-slate-600 leading-relaxed mb-6">
                      {featuredMagazine.description ||
                        "ວາລະສານທາງການຂອງ ລັດວິສາຫະກິດໄຟຟ້າລາວ ລວບລວມຂ່າວສານການດຳເນີນງານ, ຜົນສຳເລັດໂຄງການພັດທະນາພະລັງງານ ແລະ ບົດຄວາມຄວາມຮູ້ທີ່ໜ້າສົນໃຈ."}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
                    {featuredMagazine.fileUrl ? (
                      <>
                        <a
                          href={`/api/magazines/${featuredMagazine.id}/pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackDownload(featuredMagazine.id)}
                          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#2329c1] hover:bg-[#1a1f9e] text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-700/20 transition-all active:scale-95"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>ເປີດອ່ານອອນລາຍ (PDF)</span>
                        </a>

                        <a
                          href={`/api/magazines/${featuredMagazine.id}/pdf?download=1`}
                          onClick={() => trackDownload(featuredMagazine.id)}
                          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95"
                        >
                          <Download className="w-4 h-4" />
                          <span>ດາວໂຫຼດ PDF</span>
                        </a>
                      </>
                    ) : (
                      <span className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-500 text-xs font-semibold">
                        <FileText className="w-4 h-4" />
                        <span>ກຳລັງອັບໂຫຼດໄຟລ໌ PDF</span>
                      </span>
                    )}

                    <Link
                      href={`/magazines/${featuredMagazine.id}`}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition-colors sm:ml-auto"
                    >
                      <span>ລາຍລະອຽດ</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Magazine Archive Grid */}
        {gridMagazines.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#2329c1]" />
                <span>
                  {showFeaturedSpotlight
                    ? "ວາລະສານສະບັບກ່ອນໜ້າ"
                    : "ລາຍການວາລະສານທັງໝົດ"}
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {gridMagazines.map((mag) => (
                <div
                  key={mag.id}
                  className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    {/* Magazine Cover */}
                    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-lg mb-4 sm:mb-5 bg-slate-200 group-hover:shadow-2xl transition-shadow">
                      <Link
                        href={`/magazines/${mag.id}`}
                        className="block relative w-full h-full"
                      >
                        <MagazineCoverImage
                          coverImage={mag.coverImage}
                          title={mag.title}
                          issueNumber={mag.issueNumber}
                        />
                      </Link>
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-3 sm:p-4 flex items-center gap-2 sm:pointer-events-none sm:group-hover:pointer-events-auto">
                        {mag.fileUrl && (
                          <a
                            href={`/api/magazines/${mag.id}/pdf`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackDownload(mag.id)}
                            className="flex-1 py-2.5 rounded-xl bg-white/95 backdrop-blur-sm text-[#2329c1] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-white shadow-lg"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>ອ່ານອອນລາຍ</span>
                          </a>
                        )}
                        <Link
                          href={`/magazines/${mag.id}`}
                          className="py-2.5 px-3 rounded-xl bg-slate-900/80 backdrop-blur-sm text-white text-xs font-bold hover:bg-slate-900 shadow-lg"
                        >
                          ລາຍລະອຽດ
                        </Link>
                      </div>
                    </div>

                    {/* Badges & Meta */}
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2 gap-2">
                      <span className="font-bold text-[#2329c1] bg-blue-50 px-2.5 py-0.5 rounded-full truncate">
                        {mag.issueNumber || "ສະບັບທາງການ"}
                      </span>
                      {mag.publishedDate && (
                        <span className="flex items-center gap-1 text-[11px] shrink-0">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {formatLaoDate(mag.publishedDate)}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <Link href={`/magazines/${mag.id}`}>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-[#2329c1] transition-colors line-clamp-2 leading-snug mb-2">
                        {mag.title}
                      </h3>
                    </Link>

                    {mag.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                        {mag.description}
                      </p>
                    )}
                  </div>

                  {/* Footer Download Link */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatNumber(getDownloadCount(mag))} ດາວໂຫຼດ</span>
                    </div>

                    {mag.fileUrl ? (
                      <a
                        href={`/api/magazines/${mag.id}/pdf?download=1`}
                        onClick={() => trackDownload(mag.id)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2329c1] hover:bg-[#1a1f9e] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>ດາວໂຫຼດ PDF</span>
                      </a>
                    ) : (
                      <span className="text-xs text-slate-600">
                        ບໍ່ມີໄຟລ໌ດາວໂຫຼດ
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredMagazines.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm max-w-lg mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              {magazines.length === 0 ? (
                <BookOpen className="w-8 h-8" />
              ) : (
                <Search className="w-8 h-8" />
              )}
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              {magazines.length === 0
                ? "ຍັງບໍ່ມີວາລະສານເຜີຍແຜ່ໃນຂະນະນີ້"
                : "ບໍ່ພົບວາລະສານທີ່ຄົ້ນຫາ"}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              {magazines.length === 0
                ? "ກະລຸນາຕິດຕາມສະບັບໃໝ່ຈາກລັດວິສາຫະກິດໄຟຟ້າລາວໃນໄວໆນີ້"
                : "ກະລຸນາກວດສອບຄຳຄົ້ນຫາ ຫຼື ເລືອກປີພິມອື່ນເພື່ອຄົ້ນຫາໃໝ່"}
            </p>
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setSelectedYear("ທັງໝົດ");
                  setSearchQuery("");
                  setSortBy("latest");
                }}
                className="px-6 py-2.5 rounded-full bg-[#2329c1] text-white text-xs font-semibold hover:bg-[#1a1f9e] transition-colors shadow-md shadow-blue-700/20"
              >
                ລຶບຕົວກອງທັງໝົດ
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
