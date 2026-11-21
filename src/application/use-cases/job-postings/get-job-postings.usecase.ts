import { IJobPostingRepository } from "@/domain/repositories/job-posting.repository.interface";
import { JobPosting } from "@/domain/entities/job-posting.entity";
import { jobPostingRepository } from "@/infrastructure/repositories";

export async function getJobPostingsUseCase(
  params?: { search?: string; page?: number; limit?: number },
  repo: IJobPostingRepository = jobPostingRepository
): Promise<JobPosting[]> {
  return repo.findMany(params);
}

export async function getJobPostingByIdUseCase(
  id: string | number,
  repo: IJobPostingRepository = jobPostingRepository
): Promise<JobPosting | null> {
  return repo.findById(id);
}
