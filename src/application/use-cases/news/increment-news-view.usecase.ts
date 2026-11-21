import { INewsRepository } from "@/domain/repositories/news.repository.interface";
import { NewsArticle } from "@/domain/entities/news.entity";
import { newsRepository } from "@/infrastructure/repositories";

export async function incrementNewsViewUseCase(
  id: string | number,
  repo: INewsRepository = newsRepository
): Promise<NewsArticle | null> {
  return repo.incrementView(id);
}
