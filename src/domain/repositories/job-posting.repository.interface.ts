import { JobPosting } from "../entities/job-posting.entity";

export interface IJobPostingRepository {
  findMany(params?: { search?: string; page?: number; limit?: number }): Promise<JobPosting[]>;
  findById(id: string | number): Promise<JobPosting | null>;
}
