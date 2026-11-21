"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Download,
  ExternalLink,
  Calendar,
  Eye,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import type { Magazine } from "@/domain";
import { formatLaoDate, formatNumber } from "@/shared";
import { MagazineCoverImage } from "../magazines/magazine-cover-image";
import { useMagazineDownload } from "../magazines/use-magazine-download";

interface MagazineShowcaseProps {
  magazines?: Magazine[];
}

export function MagazineShowcase({ magazines }: MagazineShowcaseProps) {
  const items = magazines || [];
  const { getDownloadCount, trackDownload } = useMagazineDownload(items);

  return (
    <section id="magazines" className="py-12 sm:py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2329c1] text-xs font-semibold mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>ວາລະສານ & ສິ່ງພິມທາງການ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              ວາລະສານ ໄຟຟ້າລາວ (EDL Magazine)
            </h2>
            <p className="mt-1 text-sm text-slate-500 max-w-xl">
              ຕິດຕາມບົດຄວາມພິເສດ, ບົດວິເຄາະດ້ານພະລັງງານ, ຜົນງານ ແລະ ທິດທາງການພັດທະນາ ຟຟລ ໃນຮູບແບບ E-Magazine
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>ດາວໂຫຼດອ່ານຟຣີທຸກສະບັບ (PDF)</span>
            </div>

            <Link
              href="/magazines"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#2329c1] hover:text-blue-700 transition-colors"
            >
              <span>ເບິ່ງວາລະສານທັງໝົດ</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-200">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-600">
              ຍັງບໍ່ມີວາລະສານເຜີຍແຜ່ໃນຂະນະນີ້
            </p>
          </div>
        ) : (
          /* Magazine Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {items.map((mag) => (
              <div
                key={mag.id}
                className="bg-gradient-to-b from-slate-50 to-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  {/* Magazine Cover with 3D Book Shadow Effect */}
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
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-3 sm:p-4 sm:pointer-events-none sm:group-hover:pointer-events-auto">
                      {mag.fileUrl && (
                        <a
                          href={`/api/magazines/${mag.id}/pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackDownload(mag.id)}
                          className="w-full py-2 sm:py-2.5 rounded-xl bg-white/95 backdrop-blur-sm text-[#2329c1] text-xs font-bold flex items-center justify-center gap-2 hover:bg-white shadow-lg"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>ເປີດອ່ານອອນລາຍ</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Badges & Meta */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 mb-2">
                    <span className="font-bold text-[#2329c1] bg-blue-50 px-2.5 py-0.5 rounded-full">
                      {mag.issueNumber || "ສະບັບລ່າສຸດ"}
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatLaoDate(mag.publishedDate)}
                    </span>
                  </div>

                  {/* Title */}
                  <Link href={`/magazines/${mag.id}`}>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#2329c1] transition-colors line-clamp-2 leading-snug mb-3">
                      {mag.title}
                    </h3>
                  </Link>
                </div>

                {/* Footer Download Link */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{formatNumber(getDownloadCount(mag))} ດາວໂຫຼດ</span>
                  </div>

                  {mag.fileUrl ? (
                    <a
                      href={`/api/magazines/${mag.id}/pdf?download=1`}
                      onClick={() => trackDownload(mag.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2329c1] hover:bg-[#1a1f9e] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95"
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
        )}
      </div>
    </section>
  );
}
