import React from "react";
import { sanitizeHtmlContent } from "@/shared";

interface RichTextRendererProps {
  content: string;
  className?: string;
}

export function RichTextRenderer({
  content,
  className = "",
}: RichTextRendererProps) {
  if (!content) return null;

  const safeHtml = sanitizeHtmlContent(content);
  if (!safeHtml) return null;

  return (
    <div
      className={`prose prose-slate max-w-none overflow-x-auto break-words
        prose-headings:text-slate-900 prose-headings:font-bold prose-headings:tracking-tight
        prose-h2:text-xl sm:prose-h2:text-3xl prose-h2:mt-6 sm:prose-h2:mt-8 prose-h2:mb-3 sm:prose-h2:mb-4
        prose-h3:text-lg sm:prose-h3:text-2xl prose-h3:mt-5 sm:prose-h3:mt-6 prose-h3:mb-2.5 sm:prose-h3:mb-3
        prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-4 sm:prose-p:mb-5 prose-p:text-sm sm:prose-p:text-base
        prose-a:text-[#2329c1] prose-a:font-semibold prose-a:underline hover:prose-a:text-[#1b209e] prose-a:break-words
        prose-img:rounded-2xl prose-img:shadow-md prose-img:my-5 sm:prose-img:my-6 prose-img:w-full prose-img:max-w-full prose-img:h-auto
        prose-ul:list-disc prose-ul:pl-5 sm:prose-ul:pl-6 prose-ul:my-4 prose-li:my-1.5 prose-li:text-sm sm:prose-li:text-base
        prose-ol:list-decimal prose-ol:pl-5 sm:prose-ol:pl-6 prose-ol:my-4 prose-li:my-1.5
        prose-blockquote:border-l-4 prose-blockquote:border-[#2329c1] prose-blockquote:bg-blue-50/50 prose-blockquote:p-3.5 sm:prose-blockquote:p-4 prose-blockquote:rounded-r-2xl prose-blockquote:italic prose-blockquote:text-slate-800
        [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto [&_iframe]:w-full [&_iframe]:max-w-full
        ${className}`}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
