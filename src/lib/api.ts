/**
 * Backwards compatibility facade for API and entities.
 * In Clean Architecture:
 * - Domain entities & types live in '@/domain'
 * - Concrete HTTP repositories and infrastructure live in '@/infrastructure'
 * - Application use cases live in '@/application'
 */

export {
  API_BASE_URL,
  STORAGE_BASE_URL,
  getStorageUrl,
  newsRepository,
  branchRepository,
  tariffRepository,
  orgStructureRepository,
  magazineRepository,
  procurementRepository,
  visionMissionRepository,
  electricalKnowledgeRepository,
  jobPostingRepository,
  legislationRepository,
} from "@/infrastructure";

export type {
  NewsArticle as ApiNewsItem,
  NewsCategory,
  NewsTag,
  NewsTagRelation,
  Branch as ApiBranch,
  ServiceCenter as ApiServiceCenter,
  ElectricityTariff as ApiElectricityTariff,
  OrgStructure as ApiOrgStructure,
  Magazine as ApiMagazine,
  Procurement as ApiProcurement,
  VisionMission as ApiVisionMission,
  ElectricalKnowledge as ApiElectricalKnowledge,
  JobPosting as ApiJobPosting,
  Legislation as ApiLegislation,
} from "@/domain";

import {
  newsRepository,
  branchRepository,
  tariffRepository,
  orgStructureRepository,
  magazineRepository,
  procurementRepository,
  visionMissionRepository,
  electricalKnowledgeRepository,
  jobPostingRepository,
  legislationRepository,
  ApiClient,
} from "@/infrastructure";
import type {
  NewsCategory,
  Branch,
  ServiceCenter,
  ElectricityTariff,
  OrgStructure,
  Magazine,
  Procurement,
  VisionMission,
  ElectricalKnowledge,
  JobPosting,
  Legislation,
} from "@/domain";

export async function fetchFromApi<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  return ApiClient.get<T>(endpoint, options);
}

export async function fetchNews() {
  return newsRepository.findRaw();
}

export async function fetchNewsById(id: string | number) {
  return newsRepository.findRawById(id);
}

export async function fetchNewsCategories(): Promise<NewsCategory[]> {
  return newsRepository.findCategories();
}

export async function fetchBranches(): Promise<Branch[]> {
  return branchRepository.findMany();
}

export async function fetchBranchById(id: string | number): Promise<Branch | null> {
  return branchRepository.findById(id);
}

export async function fetchServiceCenters(): Promise<ServiceCenter[]> {
  return branchRepository.findServiceCenters();
}

export async function fetchTariffs(): Promise<ElectricityTariff[]> {
  return tariffRepository.findMany();
}

export async function fetchVisionMissions(): Promise<VisionMission[]> {
  return visionMissionRepository.findMany();
}

export async function fetchMagazines(): Promise<Magazine[]> {
  return magazineRepository.findMany();
}

export async function fetchProcurements(): Promise<Procurement[]> {
  return procurementRepository.findMany();
}

export async function fetchElectricalKnowledge(): Promise<ElectricalKnowledge[]> {
  return electricalKnowledgeRepository.findMany();
}

export async function fetchOrgStructures(): Promise<OrgStructure[]> {
  return orgStructureRepository.findMany();
}

export async function fetchJobPostings(): Promise<JobPosting[]> {
  return jobPostingRepository.findMany();
}

export async function fetchLegislations(): Promise<Legislation[]> {
  return legislationRepository.findMany();
}
