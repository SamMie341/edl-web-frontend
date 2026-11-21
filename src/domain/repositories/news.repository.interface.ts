import { NewsArticle, NewsCategory } from "../entities/news.entity";

export interface INewsRepository {
  findMany(): Promise<NewsArticle[]>;
  findById(id: string | number): Promise<NewsArticle | null>;
  findCategories(): Promise<NewsCategory[]>;
  incrementView(id: string | number): Promise<NewsArticle | null>;
}
