import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

function getOrigin(rawUrl?: string): string {
  if (!rawUrl) return "";
  try {
    return new URL(rawUrl).origin;
  } catch {
    return "";
  }
}

const apiOrigin = getOrigin(process.env.NEXT_PUBLIC_API_URL);
const storageOrigin = getOrigin(process.env.NEXT_PUBLIC_STORAGE_URL);

const connectSources = [
  "'self'",
  "https://uat-web-admin.edl.com.la",
  apiOrigin,
  ...(isDev ? ["http://localhost:*", "ws://localhost:*"] : []),
]
  .filter(Boolean)
  .join(" ");

const imgSources = [
  "'self'",
  "blob:",
  "data:",
  "https:",
  storageOrigin,
  ...(isDev ? ["http://localhost:*"] : []),
]
  .filter(Boolean)
  .join(" ");

const cspDirectives = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  `img-src ${imgSources}`,
  "font-src 'self' https://fonts.gstatic.com data:",
  `connect-src ${connectSources}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
];

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: cspDirectives.join("; "),
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  ...(isDev
    ? []
    : [
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains",
        },
      ]),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    agentUpgrade: "security",
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uat-web-admin.edl.com.la",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      ...(isDev
        ? [
            {
              protocol: "http" as const,
              hostname: "localhost",
            },
          ]
        : []),
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
