import { INewsRepository } from "@/domain/repositories/news.repository.interface";
import { NewsArticle } from "@/domain/entities/news.entity";
import { newsRepository } from "@/infrastructure/repositories";

export async function getNewsByIdUseCase(
  id: string | number,
  repo: INewsRepository = newsRepository
): Promise<NewsArticle | null> {
  return repo.findById(id);
}
