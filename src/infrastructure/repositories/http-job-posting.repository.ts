import { IJobPostingRepository } from "@/domain/repositories/job-posting.repository.interface";
import { JobPosting } from "@/domain/entities/job-posting.entity";
import { sanitizePathId } from "@/shared";
import { ApiClient } from "../http/api-client";

export class HttpJobPostingRepository implements IJobPostingRepository {
  async findMany(params?: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<JobPosting[]> {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());
    const qs = query.toString();
    const endpoint = qs ? `/job-postings?${qs}` : "/job-postings";

    const raw = await ApiClient.get<JobPosting[]>(endpoint);
    return Array.isArray(raw) ? raw : [];
  }

  async findById(id: string | number): Promise<JobPosting | null> {
    const safeId = sanitizePathId(id);
    if (!safeId) return null;

    const raw = await ApiClient.get<JobPosting>(`/job-postings/${safeId}`);
    return raw ?? null;
  }
}
