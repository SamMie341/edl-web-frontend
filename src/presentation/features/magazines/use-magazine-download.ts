"use client";

import { useState, useCallback } from "react";
import type { Magazine } from "@/domain";

/**
 * Tracks per-magazine download counts in client state and notifies
 * `/api/magazines/:id/download` when a user reads or downloads a PDF.
 */
export function useMagazineDownload(initialMagazines: Magazine[]) {
  const [downloadCounts, setDownloadCounts] = useState<Record<number, number>>(
    () =>
      Object.fromEntries(
        initialMagazines.map((m) => [m.id, m.downloadCount || 0])
      )
  );

  const getDownloadCount = useCallback(
    (mag: Magazine) => downloadCounts[mag.id] ?? mag.downloadCount ?? 0,
    [downloadCounts]
  );

  const trackDownload = useCallback(async (magazineId: number) => {
    setDownloadCounts((prev) => ({
      ...prev,
      [magazineId]: (prev[magazineId] ?? 0) + 1,
    }));

    try {
      const res = await fetch(`/api/magazines/${magazineId}/download`, {
        method: "POST",
      });
      if (!res.ok) return;
      const json = await res.json();
      const updatedCount = json?.data?.downloadCount;
      if (typeof updatedCount === "number") {
        setDownloadCounts((prev) => ({
          ...prev,
          [magazineId]: updatedCount,
        }));
      }
    } catch {
      // Keep optimistic increment if tracking request fails transiently
    }
  }, []);

  return { getDownloadCount, trackDownload };
}
