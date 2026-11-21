/**
 * Typed environment configuration with fallbacks for UAT & production.
 */
export const ENV = {
  API_BASE_URL:
    process.env.NEXT_PUBLIC_API_URL || "https://uat-web-admin.edl.com.la/api/v1",
  STORAGE_BASE_URL:
    process.env.NEXT_PUBLIC_STORAGE_URL || "https://uat-web-admin.edl.com.la",
  SITE_URL:
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.edl.com.la",
  REVALIDATE_TIME:
    Number(process.env.REVALIDATE_TIME) || 60,
} as const;

export const API_BASE_URL = ENV.API_BASE_URL;
export const STORAGE_BASE_URL = ENV.STORAGE_BASE_URL;
export const SITE_URL = ENV.SITE_URL;
export const REVALIDATE_TIME = ENV.REVALIDATE_TIME;
