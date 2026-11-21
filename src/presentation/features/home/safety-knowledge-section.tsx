"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import {
  ShieldAlert,
  Lightbulb,
  Zap,
  Play,
  Eye,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import type { ElectricalKnowledge } from "@/domain";
import { getStorageUrl } from "@/infrastructure";
import { formatNumber, sanitizeHtmlContent, sanitizeExternalUrl } from "@/shared";

interface SafetyKnowledgeSectionProps {
  knowledge?: ElectricalKnowledge[];
}

export function SafetyKnowledgeSection({
  knowledge,
}: SafetyKnowledgeSectionProps) {
  const items = knowledge || [];
  const [selectedId, setSelectedId] = useState<number | null>(
    items[0]?.id ?? null
  );
  const [viewCounts, setViewCounts] = useState<Record<number, number>>(() =>
    Object.fromEntries(items.map((item) => [item.id, item.viewCount || 0]))
  );
  const trackedIdsRef = useRef<Set<number>>(new Set());

  const trackKnowledgeView = useCallback(async (id: number) => {
    if (trackedIdsRef.current.has(id)) return;
    trackedIdsRef.current.add(id);

    setViewCounts((prev) => ({
      ...prev,
      [id]: (prev[id] ?? 0) + 1,
    }));

    try {
      const res = await fetch(`/api/electrical-knowledge/${id}/view`, {
        method: "POST",
      });
      if (!res.ok) return;
      const json = await res.json();
      const updatedViews = json?.data?.viewCount;
      if (typeof updatedViews === "number") {
        setViewCounts((prev) => ({
          ...prev,
          [id]: updatedViews,
        }));
      }
    } catch {
      // Keep optimistic view count if tracking fails transiently
    }
  }, []);

  const handleSelectArticle = (id: number) => {
    setSelectedId(id);
    void trackKnowledgeView(id);
  };

  const activeArticle =
    items.find((item) => item.id === selectedId) || items[0];
  const activeViewCount = activeArticle
    ? viewCounts[activeArticle.id] ?? activeArticle.viewCount ?? 0
    : 0;
  const safeVideoUrl = activeArticle
    ? sanitizeExternalUrl(activeArticle.videoUrl)
    : "";

  return (
    <section
      id="safety"
      className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white relative border-t border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold mb-3 border border-amber-200">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>ຄູ່ມືຄວາມປອດໄພ & ຄວາມຮູ້ດ້ານໄຟຟ້າ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            ຮູ້ໃຊ້ ຮູ້ປະຢັດ ປອດໄພທຸກຄົວເຮືອນ
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            ບົດຄວາມ ແລະ ຄຳແນະນຳການນຳໃຊ້ໄຟຟ້າຢ່າງຖືກຕ້ອງ ແລະ ປອດໄພ ຈາກວິສະວະກອນ ຟຟລ
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-600">
              ຍັງບໍ່ມີບົດຄວາມຄວາມຮູ້ໃນຂະນະນີ້
            </p>
          </div>
        ) : (
          <div>
            {/* Topic Selector Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {items.map((item, idx) => {
                const isSelected = item.id === (activeArticle?.id ?? item.id);
                const cover = item.coverImage
                  ? getStorageUrl(item.coverImage)
                  : "/edl-logo-v2.png";

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectArticle(item.id)}
                    className={`p-3.5 sm:p-4 rounded-2xl text-left transition-all duration-300 flex items-start gap-3.5 sm:gap-4 border ${
                      isSelected
                        ? "bg-white border-[#2329c1] shadow-xl ring-2 ring-[#2329c1]/20 md:-translate-y-1"
                        : "bg-white/70 border-slate-200 hover:bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0">
                      <Image
                        src={cover}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-bold text-[#2329c1] uppercase tracking-wider mb-0.5">
                        ບົດຄວາມທີ {idx + 1}
                      </div>
                      <h3
                        className={`text-xs sm:text-sm font-bold line-clamp-2 leading-snug ${
                          isSelected ? "text-[#2329c1]" : "text-slate-800"
                        }`}
                      >
                        {item.title}
                      </h3>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Detailed Interactive Panel for Selected Topic */}
            {activeArticle && (
              <div className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 border border-slate-200/90 shadow-xl relative overflow-hidden">
                <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">
                  {/* Left Column: Visual & Header */}
                  <div className="lg:w-2/5 w-full">
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-md mb-4 bg-slate-100">
                      <Image
                        src={
                          activeArticle.coverImage
                            ? getStorageUrl(activeArticle.coverImage)
                            : "/edl-logo-v2.png"
                        }
                        alt={activeArticle.title}
                        fill
                        className="object-cover"
                      />
                      {safeVideoUrl && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <a
                            href={safeVideoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                            title="ເບິ່ງວິດີໂອ"
                          >
                            <Play className="w-6 h-6 fill-white ml-0.5" />
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatNumber(activeViewCount)} ຄັ້ງ</span>
                      </span>
                      {safeVideoUrl && (
                        <a
                          href={safeVideoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#2329c1] hover:underline font-semibold"
                        >
                          <Play className="w-3.5 h-3.5 text-red-600" />
                          <span>ວິດີໂອແນະນຳ</span>
                        </a>
                      )}
                    </div>

                    <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 space-y-2 mt-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#2329c1]">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        <span>ຄຳແນະນຳຈາກ ຟຟລ:</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        ຫາກພົບເຫັນອຸບັດຕິເຫດ ຫຼື ສາຍໄຟຂາດ ໃຫ້ຮີບແຈ້ງສາຍດ່ວນ 1199 ທັນທີ (ບໍລິການ 24 ຊົ່ວໂມງ).
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Article Details */}
                  <div className="lg:w-3/5 w-full space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2329c1] text-xs font-bold">
                      <Zap className="w-3.5 h-3.5" />
                      <span>ເນື້ອໃນບົດຄວາມຄວາມຮູ້</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                      {activeArticle.title}
                    </h3>

                    {activeArticle.content ? (
                      <div
                        className="text-sm text-slate-700 leading-relaxed prose prose-blue max-w-none bg-slate-50/70 p-4 sm:p-6 rounded-2xl border border-slate-100 overflow-x-auto break-words [&_img]:max-w-full [&_img]:h-auto [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto"
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtmlContent(activeArticle.content),
                        }}
                      />
                    ) : (
                      <p className="text-sm text-slate-500 italic">
                        ບໍ່ມີເນື້ອໃນເພີ່ມເຕີມ
                      </p>
                    )}

                    {safeVideoUrl && (
                      <div className="pt-2">
                        <a
                          href={safeVideoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md active:scale-95"
                        >
                          <Play className="w-4 h-4 fill-white" />
                          <span>ເບິ່ງວິດີໂອບົດຮຽນໃນ YouTube</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
