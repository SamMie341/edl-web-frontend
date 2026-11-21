/**
 * Backwards compatibility facade for News data and mapping.
 * In Clean Architecture:
 * - NewsArticle domain entity is in '@/domain'
 * - mapApiNewsToArticle is in '@/infrastructure'
 * - News use cases are in '@/application'
 */

export type { NewsArticle } from "@/domain";
export { mapApiNewsToArticle } from "@/infrastructure";
import { newsRepository } from "@/infrastructure";
import type { NewsArticle } from "@/domain";

export async function getNewsById(id: string | number): Promise<NewsArticle | null> {
  return newsRepository.findById(id);
}
