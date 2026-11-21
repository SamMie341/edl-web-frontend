import { INewsRepository } from "@/domain/repositories/news.repository.interface";
import { NewsArticle, NewsCategory } from "@/domain/entities/news.entity";
import { sanitizePathId } from "@/shared";
import { ApiClient } from "../http/api-client";
import { mapApiNewsToArticle } from "../mappers/news.mapper";

export class HttpNewsRepository implements INewsRepository {
  async findMany(): Promise<NewsArticle[]> {
    const raw = await ApiClient.get<any[]>("/news");
    if (Array.isArray(raw)) {
      return raw.map(mapApiNewsToArticle);
    }
    return [];
  }

  async findById(id: string | number): Promise<NewsArticle | null> {
    const safeId = sanitizePathId(id);
    if (!safeId) return null;

    const raw = await ApiClient.get<any>(`/news/${safeId}`);
    if (raw) {
      return mapApiNewsToArticle(raw);
    }
    return null;
  }

  async findRaw(): Promise<any[]> {
    const raw = await ApiClient.get<any[]>("/news");
    return Array.isArray(raw) ? raw : [];
  }

  async findRawById(id: string | number): Promise<any | null> {
    const safeId = sanitizePathId(id);
    if (!safeId) return null;

    return ApiClient.get<any>(`/news/${safeId}`);
  }

  async findCategories(): Promise<NewsCategory[]> {
    const raw = await ApiClient.get<NewsCategory[]>("/news-categories");
    return Array.isArray(raw) ? raw : [];
  }

  async incrementView(id: string | number): Promise<NewsArticle | null> {
    const safeId = sanitizePathId(id);
    if (!safeId) return null;

    const raw = await ApiClient.put<Record<string, unknown>>(`/news/${safeId}/view`);
    return raw ? mapApiNewsToArticle(raw) : null;
  }
}
