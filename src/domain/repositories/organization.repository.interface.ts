import { OrgStructure } from "../entities/organization.entity";

export interface IOrgStructureRepository {
  findMany(): Promise<OrgStructure[]>;
}
