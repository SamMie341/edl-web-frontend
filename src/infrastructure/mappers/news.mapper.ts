import { NewsArticle } from "@/domain/entities/news.entity";
import { getStorageUrl } from "../storage/storage.service";

/**
 * Maps raw backend API news JSON to pure Domain NewsArticle entity.
 */
export function mapApiNewsToArticle(item: any): NewsArticle {
  const plainText = (item.contentLa || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const excerpt =
    item.subtitleLa ||
    (plainText.length > 160 ? plainText.slice(0, 160) + "..." : plainText) ||
    item.titleLa;

  return {
    id: item.id,
    categoryId: item.categoryId || item.category?.id || 1,
    titleLa: item.titleLa || item.title || "",
    titleEn: item.titleEn || item.titleLa || item.title || "",
    title: item.titleLa || item.title || "",
    subtitleLa: item.subtitleLa || undefined,
    subtitleEn: item.subtitleEn || undefined,
    excerpt,
    contentLa: item.contentLa,
    contentEn: item.contentEn || undefined,
    coverImage: getStorageUrl(item.coverImage),
    galleryImages:
      item.galleryImages && item.galleryImages.length > 0
        ? item.galleryImages.map((img: string) => getStorageUrl(img))
        : [],
    videoUrl: item.videoUrl || undefined,
    publishedAt: item.publishedAt || item.publishedDate || item.createdAt || "",
    publishedDate: item.publishedAt || item.publishedDate || item.createdAt || "",
    viewsCount: item.viewCount || item.viewsCount || 0,
    viewCount: item.viewCount || item.viewsCount || 0,
    status: item.status || "PUBLISHED",
    category: {
      id: item.category?.id || 1,
      categoryName: item.category?.categoryName || "ຂ່າວສານທົ່ວໄປ",
      description: item.category?.description || undefined,
    },
    tags:
      item.tags && item.tags.length > 0
        ? item.tags.map((t: any) => ({
            id: t.tag?.id || t.tagId,
            tagName: t.tag?.tagName || "ຂ່າວສານ ຟຟລ",
          }))
        : [{ id: 1, tagName: "ຂ່າວສານ ຟຟລ" }],
    author: "ລັດວິສາຫະກິດໄຟຟ້າລາວ (EDL)",
    featured: true,
  };
}
