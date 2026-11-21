"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Newspaper,
  Search,
  Calendar,
  Eye,
  ArrowRight,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import type { NewsArticle } from "@/domain";
import { formatNumber, formatLaoDate } from "@/shared";

interface NewsListViewProps {
  articles: NewsArticle[];
  categories: string[];
}

export function NewsListView({
  articles,
  categories,
}: NewsListViewProps) {
  const [selectedCategory, setSelectedCategory] = useState("ທັງໝົດ");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNews = useMemo(() => {
    return articles.filter((article) => {
      // Category filter
      if (
        selectedCategory !== "ທັງໝົດ" &&
        article.category?.categoryName !== selectedCategory
      ) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const tLa = (article.titleLa || article.title || "").toLowerCase();
        const tEn = (article.titleEn || "").toLowerCase();
        const exc = (article.excerpt || "").toLowerCase();
        const cat = (article.category?.categoryName || "").toLowerCase();
        return (
          tLa.includes(q) ||
          tEn.includes(q) ||
          exc.includes(q) ||
          cat.includes(q)
        );
      }
      return true;
    });
  }, [articles, selectedCategory, searchQuery]);

  const featuredArticle =
    filteredNews.find((a) => a.featured) || filteredNews[0];
  const regularArticles = filteredNews.filter(
    (a) => a.id !== featuredArticle?.id
  );

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
            ຂ່າວສານ ແລະ ກິດຈະກຳ
          </span>
        </nav>

        {/* Page Hero Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#2329c1] via-[#1b209e] to-[#101357] p-6 sm:p-10 lg:p-12 text-white relative overflow-hidden shadow-xl mb-8 sm:mb-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-amber-300 text-xs font-semibold mb-4 border border-white/15 backdrop-blur-sm shadow-sm">
              <Newspaper className="w-3.5 h-3.5" />
              <span>ສູນຂໍ້ມູນຂ່າວສານ ແລະ ປະຊາສຳພັນ ຟຟລ (News Portal)</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              ຂ່າວສານ ແລະ ຄວາມເຄື່ອນໄຫວ ຟຟລ
            </h1>
            <p className="mt-3 text-sm sm:text-base text-blue-100 leading-relaxed">
              ອັບເດດຂໍ້ມູນຂ່າວສານການເຄື່ອນໄຫວ, ໂຄງການພັດທະນາສາຍສົ່ງ,
              ແຈ້ງການຕັດກະແສໄຟຟ້າຊົ່ວຄາວ ແລະ ນະວັດຕະກຳພະລັງງານສີຂຽວ ຈາກລະບົບຖານຂໍ້ມູນທາງການ EDL.
            </p>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-sm mb-8 sm:mb-10 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ຄົ້ນຫາຫົວຂໍ້ຂ່າວ, ເນື້ອໃນ ຫຼື ໝວດໝູ່ຂ່າວ..."
                aria-label="ຄົ້ນຫາຫົວຂໍ້ຂ່າວ, ເນື້ອໃນ ຫຼື ໝວດໝູ່ຂ່າວ"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2329c1] focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-600 font-semibold mr-1">ໝວດໝູ່:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full font-medium transition-all duration-200 active:scale-95 ${
                  selectedCategory === cat
                    ? "bg-[#2329c1] text-white shadow-md shadow-blue-700/25 scale-105"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
            <span className="ml-auto text-slate-600 font-medium">
              ພົບ <strong>{filteredNews.length}</strong> ບົດຄວາມ
            </span>
          </div>
        </div>

        {/* Featured News Article */}
        {featuredArticle && (
          <div className="mb-12">
            <Link
              href={`/news/${featuredArticle.id}`}
              className="group block bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-7 relative h-56 sm:h-80 md:h-96 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={featuredArticle.coverImage}
                    alt={featuredArticle.titleLa || featuredArticle.title || "News Cover"}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3.5 py-1 rounded-full bg-[#2329c1] text-white text-xs font-semibold shadow-md">
                      {featuredArticle.category?.categoryName || "ຂ່າວສານ"}
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 text-xs text-slate-600 mb-3">
                      <span className="flex items-center gap-1.5 font-medium text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-[#2329c1]" />
                        {formatLaoDate(featuredArticle.publishedAt || featuredArticle.publishedDate)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        {formatNumber(featuredArticle.viewsCount || featuredArticle.viewCount || 0)} ຄົນອ່ານ
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 group-hover:text-[#2329c1] transition-colors leading-snug">
                      {featuredArticle.titleLa || featuredArticle.title}
                    </h2>

                    {featuredArticle.subtitleLa && (
                      <div className="text-xs font-semibold text-blue-700 mt-1 mb-2">
                        {featuredArticle.subtitleLa}
                      </div>
                    )}

                    <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {featuredArticle.excerpt}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#2329c1]">
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      ອ່ານບົດຄວາມເຕັມ <ArrowRight className="w-4 h-4 ml-1" />
                    </span>
                    <span className="text-[11px] text-slate-600 font-normal">
                      ອັບເດດລ່າສຸດ
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Regular Articles Grid */}
        {regularArticles.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#2329c1]" />
                <span>ຂ່າວສານອື່ນໆ ທີ່ໜ້າສົນໃຈ</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {regularArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.id}`}
                  className="group flex flex-col bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={article.coverImage}
                      alt={article.titleLa || article.title || "News"}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#2329c1] text-[11px] font-bold shadow-sm">
                        {article.category?.categoryName || "ຂ່າວສານ"}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-600 mb-2.5">
                        <span className="flex items-center gap-1 font-medium text-slate-500">
                          <Calendar className="w-3.5 h-3.5 text-[#2329c1]" />
                          {formatLaoDate(article.publishedAt || article.publishedDate)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {formatNumber(article.viewsCount || article.viewCount || 0)}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900 group-hover:text-[#2329c1] transition-colors leading-snug line-clamp-2 mb-2">
                        {article.titleLa || article.title}
                      </h4>

                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                        {article.excerpt}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#2329c1]">
                      <span>ອ່ານເພີ່ມເຕີມ</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty Search Result */}
        {filteredNews.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm max-w-lg mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              ບໍ່ພົບຂ່າວສານທີ່ຄົ້ນຫາ
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              ກະລຸນາກວດສອບຄຳຄົ້ນຫາ ຫຼື ເລືອກໝວດໝູ່ອື່ນເພື່ອຄົ້ນຫາໃໝ່
            </p>
            <button
              onClick={() => {
                setSelectedCategory("ທັງໝົດ");
                setSearchQuery("");
              }}
              className="px-6 py-2.5 rounded-full bg-[#2329c1] text-white text-xs font-semibold hover:bg-[#1a1f9e] transition-colors shadow-md shadow-blue-700/20"
            >
              ລຶບຄຳຄົ້ນຫາທັງໝົດ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
