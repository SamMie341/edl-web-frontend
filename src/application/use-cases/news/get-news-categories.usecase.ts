import { INewsRepository } from "@/domain/repositories/news.repository.interface";
import { NewsCategory } from "@/domain/entities/news.entity";
import { newsRepository } from "@/infrastructure/repositories";

export async function getNewsCategoriesUseCase(
  repo: INewsRepository = newsRepository
): Promise<NewsCategory[]> {
  return repo.findCategories();
}
