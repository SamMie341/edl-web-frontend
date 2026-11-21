import { ENV } from "../config/env.config";
import { sanitizeExternalUrl } from "@/shared";

const DEFAULT_FALLBACK = "/edl-logo-v2.png";

/**
 * Resolves full media URL for uploaded assets (images, PDFs) from EDL Storage.
 * Validates URL schemes to prevent javascript:/data: injection or unintended protocol-relative redirects.
 */
export function getStorageUrl(path?: string | null): string {
  if (!path) return DEFAULT_FALLBACK;
  const trimmed = path.trim();
  if (!trimmed) return DEFAULT_FALLBACK;

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return sanitizeExternalUrl(trimmed, DEFAULT_FALLBACK);
  }

  const cleanBase = ENV.STORAGE_BASE_URL.replace(/\/$/, "");
  const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  if (cleanPath.startsWith("//")) {
    return DEFAULT_FALLBACK;
  }

  return sanitizeExternalUrl(`${cleanBase}${cleanPath}`, DEFAULT_FALLBACK);
}
