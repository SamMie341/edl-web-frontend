export interface NewsCategory {
  id: number;
  categoryName: string;
  description?: string | null;
  orderIndex?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewsTag {
  id: number;
  tagName: string;
  status?: string;
}

export interface NewsTagRelation {
  newsId: number;
  tagId: number;
  tag?: NewsTag;
}

export interface NewsArticle {
  id: number;
  categoryId: number;
  titleLa: string;
  titleEn: string;
  title?: string; // Convenience alias for titleLa
  subtitleLa?: string;
  subtitleEn?: string;
  excerpt: string;
  contentLa: string;
  contentEn?: string;
  coverImage: string;
  galleryImages?: string[];
  videoUrl?: string;
  publishedAt: string;
  publishedDate?: string; // Convenience alias for publishedAt
  viewsCount: number;
  viewCount?: number; // Convenience alias for viewsCount
  status: "PUBLISHED" | "DRAFT" | string;
  category: {
    id: number;
    categoryName: string;
    description?: string;
  };
  tags?: { id: number; tagName: string }[];
  author: string;
  featured?: boolean;
}
