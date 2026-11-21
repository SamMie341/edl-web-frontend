import { NewsArticle, NewsCategory } from "@/domain/entities/news.entity";
import { Magazine } from "@/domain/entities/magazine.entity";
import { Procurement } from "@/domain/entities/procurement.entity";
import { VisionMission } from "@/domain/entities/vision-mission.entity";
import { ElectricalKnowledge } from "@/domain/entities/electrical-knowledge.entity";
import { JobPosting } from "@/domain/entities/job-posting.entity";
import {
  newsRepository,
  magazineRepository,
  procurementRepository,
  visionMissionRepository,
  electricalKnowledgeRepository,
  jobPostingRepository,
} from "@/infrastructure/repositories";

export interface HomeDataResult {
  news: NewsArticle[];
  categories: NewsCategory[];
  magazines: Magazine[];
  procurements: Procurement[];
  visionMissions: VisionMission[];
  electricalKnowledge: ElectricalKnowledge[];
  jobPostings: JobPosting[];
}

/**
 * Use Case: Loads all required aggregate data for the EDL Home portal in parallel.
 */
export async function getHomeDataUseCase(): Promise<HomeDataResult> {
  const [
    news,
    categories,
    magazines,
    procurements,
    visionMissions,
    electricalKnowledge,
    jobPostings,
  ] = await Promise.all([
    newsRepository.findMany(),
    newsRepository.findCategories(),
    magazineRepository.findMany(),
    procurementRepository.findMany(),
    visionMissionRepository.findMany(),
    electricalKnowledgeRepository.findMany(),
    jobPostingRepository.findMany(),
  ]);

  return {
    news,
    categories,
    magazines,
    procurements,
    visionMissions,
    electricalKnowledge,
    jobPostings,
  };
}
