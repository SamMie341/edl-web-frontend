import sanitizeHtml from "sanitize-html";

const ALLOWED_HTML_TAGS = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "br",
  "hr",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "sub",
  "sup",
  "blockquote",
  "ul",
  "ol",
  "li",
  "a",
  "img",
  "table",
  "thead",
  "tbody",
  "tfoot",
  "tr",
  "th",
  "td",
  "pre",
  "code",
  "span",
  "div",
  "figure",
  "figcaption",
];

const SAFE_URL_PROTOCOLS = new Set(["http:", "https:"]);
const SAFE_LINK_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);

/**
 * Sanitizes CMS/API-provided HTML to mitigate Stored XSS while preserving rich-text formatting.
 */
export function sanitizeHtmlContent(html?: string | null): string {
  if (!html) return "";

  return sanitizeHtml(html, {
    allowedTags: ALLOWED_HTML_TAGS,
    allowedAttributes: {
      a: ["href", "name", "target", "rel", "title"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      th: ["colspan", "rowspan", "scope"],
      td: ["colspan", "rowspan"],
      "*": ["class"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: {
      img: ["http", "https"],
    },
    allowProtocolRelative: false,
    disallowedTagsMode: "discard",
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href ? sanitizeLinkHref(attribs.href) : "";
        const nextAttribs: Record<string, string> = {};
        if (href) nextAttribs.href = href;
        if (attribs.title) nextAttribs.title = attribs.title;
        if (attribs.name) nextAttribs.name = attribs.name;
        if (attribs.class) nextAttribs.class = attribs.class;
        if (attribs.target === "_blank") {
          nextAttribs.target = "_blank";
          nextAttribs.rel = "noopener noreferrer";
        }
        return { tagName, attribs: nextAttribs };
      },
      img: (tagName, attribs) => {
        const src = attribs.src ? sanitizeExternalUrl(attribs.src) : "";
        if (!src) {
          return { tagName: "span", attribs: {} };
        }
        const nextAttribs: Record<string, string> = { src };
        if (attribs.alt) nextAttribs.alt = attribs.alt;
        if (attribs.title) nextAttribs.title = attribs.title;
        if (attribs.width) nextAttribs.width = attribs.width;
        if (attribs.height) nextAttribs.height = attribs.height;
        if (attribs.class) nextAttribs.class = attribs.class;
        nextAttribs.loading = "lazy";
        return { tagName, attribs: nextAttribs };
      },
    },
  });
}

function sanitizeLinkHref(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("#") || (trimmed.startsWith("/") && !trimmed.startsWith("//"))) {
    return trimmed;
  }
  try {
    const parsed = new URL(trimmed);
    return SAFE_LINK_PROTOCOLS.has(parsed.protocol) ? trimmed : "";
  } catch {
    return "";
  }
}

/**
 * Validates that a URL is either a safe single-slash relative path or an http(s) URL.
 * Rejects javascript:, data:, vbscript:, and protocol-relative (//) URLs.
 */
export function sanitizeExternalUrl(
  url?: string | null,
  fallback = ""
): string {
  if (!url) return fallback;
  const trimmed = url.trim();
  if (!trimmed) return fallback;

  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (!SAFE_URL_PROTOCOLS.has(parsed.protocol)) {
      return fallback;
    }
    if (
      parsed.protocol === "http:" &&
      process.env.NODE_ENV === "production" &&
      parsed.hostname !== "localhost" &&
      parsed.hostname !== "127.0.0.1"
    ) {
      parsed.protocol = "https:";
      return parsed.toString();
    }
    return parsed.toString();
  } catch {
    return fallback;
  }
}

/**
 * Validates and encodes a single path identifier (e.g., numeric ID or slug)
 * to prevent path traversal or query/fragment injection into backend API URLs.
 */
export function sanitizePathId(id: string | number): string | null {
  const raw = String(id).trim();
  if (!raw || raw === "." || raw === "..") return null;
  if (!/^[a-zA-Z0-9_-]+$/.test(raw)) return null;
  return encodeURIComponent(raw);
}
