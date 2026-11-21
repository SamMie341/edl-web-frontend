import { INewsRepository } from "@/domain/repositories/news.repository.interface";
import { NewsArticle } from "@/domain/entities/news.entity";
import { newsRepository } from "@/infrastructure/repositories";

export async function getNewsUseCase(
  repo: INewsRepository = newsRepository
): Promise<NewsArticle[]> {
  return repo.findMany();
}
