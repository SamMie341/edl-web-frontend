"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Share2,
  Check,
  ChevronRight,
  Hash,
} from "lucide-react";
import type { Magazine } from "@/domain";
import { formatLaoDate, formatNumber } from "@/shared";
import { MagazineCoverImage } from "./magazine-cover-image";
import { useMagazineDownload } from "./use-magazine-download";

interface MagazineDetailViewProps {
  magazine: Magazine;
  otherMagazines: Magazine[];
}

export function MagazineDetailView({
  magazine,
  otherMagazines,
}: MagazineDetailViewProps) {
  const [copied, setCopied] = useState(false);
  const { getDownloadCount, trackDownload } = useMagazineDownload([
    magazine,
    ...otherMagazines,
  ]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard failures in restricted contexts
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-[#2329c1] transition-colors">
            ໜ້າຫຼັກ
          </Link>
          <span>/</span>
          <Link
            href="/magazines"
            className="hover:text-[#2329c1] transition-colors"
          >
            ວາລະສານ ຟຟລ
          </Link>
          <span>/</span>
          <span className="text-[#2329c1] font-semibold truncate max-w-xs sm:max-w-md">
            {magazine.title}
          </span>
        </nav>

        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/magazines"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#2329c1] transition-all bg-white px-4 py-2.5 rounded-xl border border-slate-200/80 shadow-sm hover:shadow active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ກັບໄປໜ້າລວມວາລະສານທັງໝົດ</span>
          </Link>
        </div>

        {/* Main Showcase Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Cover Column */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-100 via-blue-50/50 to-slate-100 p-6 sm:p-10 lg:p-12 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-100">
              <div className="relative aspect-[3/4] w-full max-w-[240px] sm:max-w-[320px] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-900/10">
                <MagazineCoverImage
                  coverImage={magazine.coverImage}
                  title={magazine.title}
                  issueNumber={magazine.issueNumber}
                  sizes="(max-width: 1024px) 320px, 320px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Info & Actions Column */}
            <div className="lg:col-span-7 p-5 sm:p-10 lg:p-12 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2.5 mb-5">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-[#2329c1] text-xs font-bold">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>EDL E-Magazine</span>
                  </span>
                  {magazine.issueNumber && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                      <Hash className="w-3 h-3" />
                      <span>{magazine.issueNumber}</span>
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug mb-4">
                  {magazine.title}
                </h1>

                {/* Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2329c1] flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-600 font-medium">
                        ວັນທີເຜີຍແຜ່
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-slate-800">
                        {formatLaoDate(magazine.publishedDate) || "ອັບເດດລ່າສຸດ"}
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <Eye className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-600 font-medium">
                        ຍອດດາວໂຫຼດ & ອ່ານ
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-slate-800">
                        {formatNumber(getDownloadCount(magazine))} ຄັ້ງ
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100/80 text-sm text-slate-700 leading-relaxed mb-8">
                  {magazine.description ||
                    "ວາລະສານ ໄຟຟ້າລາວ ສະບັບດິຈິຕອນ ເຜີຍແຜ່ຂໍ້ມູນຂ່າວສານ, ບົດວິເຄາະດ້ານພະລັງງານໄຟຟ້າ, ຜົນງານການພັດທະນາລະບົບສາຍສົ່ງ ແລະ ຄວາມຮູ້ທີ່ເປັນປະໂຫຍດສຳລັບປະຊາຊົນ."}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
                {magazine.fileUrl ? (
                  <>
                    <a
                      href={`/api/magazines/${magazine.id}/pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackDownload(magazine.id)}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#2329c1] hover:bg-[#1a1f9e] text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-700/20 transition-all active:scale-95"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>ເປີດອ່ານອອນລາຍ (PDF)</span>
                    </a>

                    <a
                      href={`/api/magazines/${magazine.id}/pdf?download=1`}
                      onClick={() => trackDownload(magazine.id)}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95"
                    >
                      <Download className="w-4 h-4" />
                      <span>ດາວໂຫຼດໄຟລ໌ PDF</span>
                    </a>
                  </>
                ) : (
                  <span className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-100 text-slate-500 text-xs font-semibold">
                    <FileText className="w-4 h-4" />
                    <span>ຍັງບໍ່ມີໄຟລ໌ PDF ສຳລັບສະບັບນີ້</span>
                  </span>
                )}

                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors sm:ml-auto"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">ສຳເນົາລິ້ງແລ້ວ</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      <span>ແຊລິ້ງ</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Other Issues */}
        {otherMagazines.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#2329c1]" />
                <span>ວາລະສານສະບັບອື່ນໆ</span>
              </h2>
              <Link
                href="/magazines"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#2329c1] hover:text-blue-700"
              >
                <span>ເບິ່ງທັງໝົດ</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherMagazines.map((item) => (
                <Link
                  key={item.id}
                  href={`/magazines/${item.id}`}
                  className="group bg-white rounded-3xl p-4 border border-slate-200/80 hover:border-blue-300 hover:shadow-lg transition-all flex gap-4 items-center"
                >
                  <div className="relative w-20 aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 shrink-0 shadow-sm">
                    <MagazineCoverImage
                      coverImage={item.coverImage}
                      title={item.title}
                      issueNumber={item.issueNumber}
                      sizes="80px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="inline-block text-[10px] font-bold text-[#2329c1] bg-blue-50 px-2 py-0.5 rounded-full mb-1.5">
                      {item.issueNumber || "ສະບັບທາງການ"}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#2329c1] transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                    <div className="mt-2 text-[11px] text-slate-600 flex items-center gap-2">
                      <span>{formatLaoDate(item.publishedDate)}</span>
                      <span>•</span>
                      <span>{formatNumber(getDownloadCount(item))} ດາວໂຫຼດ</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
