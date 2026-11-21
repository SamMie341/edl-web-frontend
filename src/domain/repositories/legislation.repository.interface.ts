import { Legislation } from "../entities/legislation.entity";

export interface ILegislationRepository {
  findMany(params?: { search?: string; page?: number; limit?: number }): Promise<Legislation[]>;
  findById(id: string | number): Promise<Legislation | null>;
}
