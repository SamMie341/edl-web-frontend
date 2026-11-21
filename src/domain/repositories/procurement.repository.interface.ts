import { Procurement } from "../entities/procurement.entity";

export interface IProcurementRepository {
  findMany(): Promise<Procurement[]>;
}
