"use client";

import React, { useState } from "react";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import { getStorageUrl } from "@/infrastructure";

interface MagazineCoverImageProps {
  coverImage?: string | null;
  title: string;
  issueNumber?: string | null;
  sizes?: string;
  className?: string;
  priority?: boolean;
}

export function MagazineCoverImage({
  coverImage,
  title,
  issueNumber,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  className = "object-cover group-hover:scale-105 transition-transform duration-500",
  priority = false,
}: MagazineCoverImageProps) {
  const [hasError, setHasError] = useState(false);
  const hasCustomCover = Boolean(coverImage && coverImage.trim().length > 0);
  const coverSrc = hasCustomCover ? getStorageUrl(coverImage) : "";

  if (!hasCustomCover || hasError) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-[#2329c1] via-[#1b209e] to-[#0b0d40] flex flex-col justify-between p-5 text-white select-none">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full bg-white/15 text-amber-300 text-[10px] font-bold border border-white/15">
            EDL E-MAGAZINE
          </span>
          <BookOpen className="w-5 h-5 text-amber-300/80" />
        </div>
        <div>
          {issueNumber && (
            <div className="text-[11px] font-semibold text-blue-200 mb-1">
              {issueNumber}
            </div>
          )}
          <div className="text-sm sm:text-base font-extrabold leading-snug line-clamp-3">
            {title}
          </div>
        </div>
        <div className="text-[10px] text-blue-200/80 border-t border-white/15 pt-2">
          ລັດວິສາຫະກິດໄຟຟ້າລາວ (EDL)
        </div>
      </div>
    );
  }

  return (
    <Image
      src={coverSrc}
      alt={title}
      fill
      unoptimized
      priority={priority}
      sizes={sizes}
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
