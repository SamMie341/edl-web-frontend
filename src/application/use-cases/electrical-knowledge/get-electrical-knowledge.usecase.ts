import { IElectricalKnowledgeRepository } from "@/domain/repositories/electrical-knowledge.repository.interface";
import { ElectricalKnowledge } from "@/domain/entities/electrical-knowledge.entity";
import { electricalKnowledgeRepository } from "@/infrastructure/repositories";

export async function getElectricalKnowledgeUseCase(
  repo: IElectricalKnowledgeRepository = electricalKnowledgeRepository
): Promise<ElectricalKnowledge[]> {
  return repo.findMany();
}
