import { ElectricalKnowledge } from "../entities/electrical-knowledge.entity";

export interface IElectricalKnowledgeRepository {
  findMany(): Promise<ElectricalKnowledge[]>;
  incrementView(id: string | number): Promise<ElectricalKnowledge | null>;
}
