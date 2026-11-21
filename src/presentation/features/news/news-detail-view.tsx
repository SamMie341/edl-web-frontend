"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Calendar,
  Eye,
  ArrowLeft,
  Share2,
  Tag,
  User,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import type { NewsArticle } from "@/domain";
import { RichTextRenderer } from "@/presentation/components/ui/rich-text-renderer";
import { formatNumber, formatLaoDate } from "@/shared";

interface NewsDetailViewProps {
  news: NewsArticle;
  relatedArticles: NewsArticle[];
}

export function NewsDetailView({ news, relatedArticles }: NewsDetailViewProps) {
  const publishedDateText = formatLaoDate(news.publishedAt || news.publishedDate);
  const [trackedViewsById, setTrackedViewsById] = useState<Record<number, number>>({});
  const trackedArticleIdRef = useRef<number | null>(null);

  const viewsCount =
    trackedViewsById[news.id] ?? news.viewsCount ?? news.viewCount ?? 0;

  useEffect(() => {
    if (trackedArticleIdRef.current === news.id) return;
    trackedArticleIdRef.current = news.id;

    let cancelled = false;
    fetch(`/api/news/${news.id}/view`, { method: "POST" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (cancelled) return;
        const updatedViews =
          json?.data?.viewsCount ?? json?.data?.viewCount;
        if (typeof updatedViews === "number") {
          setTrackedViewsById((prev) => ({
            ...prev,
            [news.id]: updatedViews,
          }));
        }
      })
      .catch(() => {
        // Ignore view tracking failures so article reading is unaffected
      });

    return () => {
      cancelled = true;
    };
  }, [news.id]);

  return (
    <article className="min-h-screen bg-slate-50 py-10 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-[#2329c1] transition-colors">
            ໜ້າຫຼັກ
          </Link>
          <span>/</span>
          <Link href="/news" className="hover:text-[#2329c1] transition-colors">
            ຂ່າວສານ & ກິດຈະກຳ
          </Link>
          <span>/</span>
          <span className="text-[#2329c1] font-semibold truncate max-w-xs sm:max-w-md">
            {news.titleLa || news.title}
          </span>
        </nav>

        {/* Back Link with hover animation */}
        <div className="mb-6">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#2329c1] transition-all bg-white px-4 py-2.5 rounded-xl border border-slate-200/80 shadow-sm hover:shadow active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ກັບໄປໜ້າລວມຂ່າວທັງໝົດ</span>
          </Link>
        </div>

        {/* Article Container Card */}
        <div className="bg-white rounded-3xl p-4 sm:p-8 lg:p-12 border border-slate-200/80 shadow-sm relative overflow-hidden">
          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-slate-500 mb-6 pb-6 border-b border-slate-100">
            <span className="bg-blue-50 text-[#2329c1] px-3.5 py-1 rounded-full font-bold shadow-sm">
              {news.category?.categoryName || "ຂ່າວສານ"}
            </span>

            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#2329c1]" />
              {publishedDateText}
            </span>

            <span>•</span>

            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              {formatNumber(viewsCount)} ຄັ້ງ
            </span>

            <span>•</span>

            <span className="flex items-center gap-1.5 text-slate-500">
              <User className="w-3.5 h-3.5 text-slate-400" />
              {news.author || "ລັດວິສາຫະກິດໄຟຟ້າລາວ (EDL)"}
            </span>
          </div>

          {/* Article Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.3] mb-3">
            {news.titleLa || news.title}
          </h1>

          {/* Subtitle if available */}
          {news.subtitleLa && (
            <div className="text-sm sm:text-base font-semibold text-blue-800 mb-6 leading-relaxed">
              {news.subtitleLa}
            </div>
          )}

          {/* Excerpt Lead Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/60 border border-blue-100/80 text-sm sm:text-base text-slate-700 leading-relaxed font-medium mb-8">
            {news.excerpt}
          </div>

          {/* Cover Image */}
          <div className="w-full h-56 sm:h-80 md:h-[460px] relative rounded-2xl sm:rounded-3xl overflow-hidden mb-8 sm:mb-10 shadow-md bg-slate-100">
            <img
              src={news.coverImage}
              alt={news.titleLa || news.title || "News Cover"}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Rich Text Content */}
          <div className="border-b border-slate-100 pb-10">
            <RichTextRenderer content={news.contentLa} />
          </div>

          {/* Photo Gallery (if available) */}
          {news.galleryImages && news.galleryImages.length > 0 && (
            <div className="py-8 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>ຮູບພາບປະກອບກິດຈະກຳ ({news.galleryImages.length} ຮູບ)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {news.galleryImages.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="h-56 rounded-2xl overflow-hidden shadow-sm group bg-slate-100"
                  >
                    <img
                      src={imgUrl}
                      alt={`Gallery ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags from EDL Admin */}
          {news.tags && news.tags.length > 0 && (
            <div className="py-6 border-b border-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mr-1">
                <Tag className="w-3.5 h-3.5 text-[#2329c1]" />
                <span>ປ້າຍກຳກັບ:</span>
              </span>
              {news.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium hover:bg-blue-50 hover:text-[#2329c1] transition-colors cursor-pointer"
                >
                  #{tag.tagName}
                </span>
              ))}
            </div>
          )}

          {/* Share & Footer Actions */}
          <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-[#2329c1]" />
                <span>ແບ່ງປັນຂ່າວ:</span>
              </span>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  "https://www.edl.com.la/news/" + news.id
                )}`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-[#2329c1] text-white text-xs font-semibold hover:bg-[#1b209e] transition-all shadow-sm active:scale-95"
              >
                Facebook
              </a>
              <a
                href={`https://telegram.me/share/url?url=${encodeURIComponent(
                  "https://www.edl.com.la/news/" + news.id
                )}&text=${encodeURIComponent(news.titleLa || news.title || "")}`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-sky-500 text-white text-xs font-semibold hover:bg-sky-600 transition-all shadow-sm active:scale-95"
              >
                Telegram
              </a>
            </div>

            <Link
              href="/news"
              className="text-xs font-bold text-[#2329c1] hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>ເບິ່ງຂ່າວອື່ນໆທັງໝົດ</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Related News Section */}
        {relatedArticles.length > 0 && (
          <div className="mt-14">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                ຂ່າວສານທີ່ກ່ຽວຂ້ອງ (Related News)
              </h2>
              <Link
                href="/news"
                className="text-xs font-bold text-[#2329c1] hover:underline"
              >
                ເບິ່ງທັງໝົດ
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/news/${rel.id}`}
                  className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                      <img
                        src={rel.coverImage}
                        alt={rel.titleLa || rel.title || "Related"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md bg-[#2329c1] text-white text-[10px] font-bold shadow-sm">
                        {rel.category?.categoryName || "ຂ່າວສານ"}
                      </span>
                    </div>

                    <div className="p-4">
                      <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#2329c1]" />
                        {formatLaoDate(rel.publishedAt || rel.publishedDate)}
                      </div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#2329c1] transition-colors line-clamp-2 leading-snug">
                        {rel.titleLa || rel.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-4 pt-0 text-[11px] font-semibold text-[#2329c1] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>ອ່ານຕໍ່</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
