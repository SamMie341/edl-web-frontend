export type OrgStructureType =
  | "BOARD_OF_DIRECTORS"
  | "EXECUTIVE_BOARD"
  | "ORG_STRUCTURE"
  | string;

export interface OrgStructure {
  id: number;
  structureType: OrgStructureType;
  structureName: string;
  imageUrl: string;
  orderIndex?: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrgStructureSectionInfo {
  title: string;
  subtitle: string;
  description: string;
  roles: string[];
}
