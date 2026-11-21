import { Magazine } from "../entities/magazine.entity";

export interface IMagazineRepository {
  findMany(): Promise<Magazine[]>;
  findById(id: string | number): Promise<Magazine | null>;
  incrementDownload(id: string | number): Promise<Magazine | null>;
}
