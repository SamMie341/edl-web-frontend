"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatNumber, formatLaoDate } from "@/shared";
import {
  Calendar,
  Eye,
  ArrowRight,
  Newspaper,
  ChevronRight,
} from "lucide-react";
import type { NewsArticle } from "@/domain";

interface NewsSectionProps {
  news?: NewsArticle[];
  categories?: string[];
}

export function NewsSection({ news, categories }: NewsSectionProps) {
  const articlesList = news || [];

  const categoryOptions = [
    "ທັງໝົດ",
    ...(categories && categories.length > 0
      ? categories
      : Array.from(new Set(articlesList.map((n) => n.category?.categoryName || "ຂ່າວສານ")))),
  ];

  const [activeCategory, setActiveCategory] = useState("ທັງໝົດ");

  const filteredNews =
    activeCategory === "ທັງໝົດ"
      ? articlesList
      : articlesList.filter(
          (item) => item.category?.categoryName === activeCategory
        );

  const featured = filteredNews.find((n) => n.featured) || filteredNews[0];
  const regularNews = filteredNews
    .filter((n) => n.id !== featured?.id)
    .slice(0, 3);

  return (
    <section id="news" className="py-12 sm:py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2329c1] text-xs font-semibold mb-2">
              <Newspaper className="w-3.5 h-3.5" />
              <span>ຂ່າວສານ & ກິດຈະກຳ ຟຟລ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              ຂ່າວສານ ແລະ ຄວາມເຄື່ອນໄຫວລ່າສຸດ
            </h2>
            <p className="mt-1 text-sm text-slate-500 max-w-xl">
              ຕິດຕາມຂ່າວສານ, ແຈ້ງການ, ກິດຈະກຳເພື່ອສັງຄົມ ແລະ ໂຄງການພັດທະນາຕ່າງໆ ຂອງລັດວິສາຫະກິດໄຟຟ້າລາວ
            </p>
          </div>

          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2329c1] hover:text-blue-700 transition-colors"
          >
            <span>ເບິ່ງຂ່າວທັງໝົດ</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Pills */}
        {categoryOptions.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {categoryOptions.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-[#2329c1] text-white shadow-md shadow-blue-500/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Empty State */}
        {articlesList.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-200">
            <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-600">
              ຍັງບໍ່ມີຂ່າວສານເຜີຍແຜ່ໃນຂະນະນີ້
            </p>
          </div>
        ) : (
          /* News Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            {/* Featured Large Article (7 cols) */}
            {featured && (
              <div className="lg:col-span-7">
                <Link
                  href={`/news/${featured.id}`}
                  className="group h-full bg-slate-50 rounded-3xl overflow-hidden border border-slate-200/80 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-200">
                    <Image
                      src={featured.coverImage || "/edl-logo-v2.png"}
                      alt={featured.title || "News"}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-wrap gap-1.5 sm:gap-2 pr-3">
                      <span className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-[#2329c1] text-white shadow-md">
                        {featured.category?.categoryName || "ຂ່າວເດັ່ນ"}
                      </span>
                      {featured.featured && (
                        <span className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-amber-500 text-white shadow-md">
                          ຂ່າວເດັ່ນພິເສດ
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5 sm:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mb-3">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {formatLaoDate(featured.publishedDate)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          {formatNumber(featured.viewCount)} ຄັ້ງ
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-2xl font-bold text-slate-900 group-hover:text-[#2329c1] transition-colors line-clamp-2 leading-snug mb-2.5 sm:mb-3">
                        {featured.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                        {featured.excerpt}
                      </p>
                    </div>

                    <div className="pt-5 sm:pt-6 mt-5 sm:mt-6 border-t border-slate-200/80 flex items-center gap-2 text-xs font-bold text-[#2329c1]">
                      <span>ອ່ານລາຍລະອຽດຕໍ່</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Regular News List (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-5 justify-between">
              {regularNews.map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.id}`}
                  className="group flex gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
                >
                  <div className="relative w-24 sm:w-32 aspect-video rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 self-start sm:self-center">
                    <Image
                      src={article.coverImage || "/edl-logo-v2.png"}
                      alt={article.title || "News"}
                      fill
                      sizes="(max-width: 768px) 120px, 150px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-600 mb-1">
                        <span className="text-[#2329c1] font-semibold">
                          {article.category?.categoryName}
                        </span>
                        <span>•</span>
                        <span>{formatLaoDate(article.publishedDate)}</span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#2329c1] transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mt-2">
                      <Eye className="w-3 h-3" />
                      <span>{formatNumber(article.viewCount)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
