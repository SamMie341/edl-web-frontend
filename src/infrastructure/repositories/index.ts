import { HttpNewsRepository } from "./http-news.repository";
import { HttpBranchRepository } from "./http-branch.repository";
import { HttpTariffRepository } from "./http-tariff.repository";
import { HttpOrgStructureRepository } from "./http-organization.repository";
import { HttpMagazineRepository } from "./http-magazine.repository";
import { HttpProcurementRepository } from "./http-procurement.repository";
import { HttpVisionMissionRepository } from "./http-vision-mission.repository";
import { HttpElectricalKnowledgeRepository } from "./http-electrical-knowledge.repository";
import { HttpJobPostingRepository } from "./http-job-posting.repository";
import { HttpLegislationRepository } from "./http-legislation.repository";
import { HttpElectricityCalculatorRepository } from "./http-electricity-calculator.repository";

export * from "./http-news.repository";
export * from "./http-branch.repository";
export * from "./http-tariff.repository";
export * from "./http-organization.repository";
export * from "./http-magazine.repository";
export * from "./http-procurement.repository";
export * from "./http-vision-mission.repository";
export * from "./http-electrical-knowledge.repository";
export * from "./http-job-posting.repository";
export * from "./http-legislation.repository";
export * from "./http-electricity-calculator.repository";

// Default Infrastructure Repository Instances
export const newsRepository = new HttpNewsRepository();
export const branchRepository = new HttpBranchRepository();
export const tariffRepository = new HttpTariffRepository();
export const orgStructureRepository = new HttpOrgStructureRepository();
export const magazineRepository = new HttpMagazineRepository();
export const procurementRepository = new HttpProcurementRepository();
export const visionMissionRepository = new HttpVisionMissionRepository();
export const electricalKnowledgeRepository =
  new HttpElectricalKnowledgeRepository();
export const jobPostingRepository = new HttpJobPostingRepository();
export const legislationRepository = new HttpLegislationRepository();
export const electricityCalculatorRepository =
  new HttpElectricityCalculatorRepository();
