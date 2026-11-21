import { IVisionMissionRepository } from "@/domain/repositories/vision-mission.repository.interface";
import { VisionMission } from "@/domain/entities/vision-mission.entity";
import { ApiClient } from "../http/api-client";

export class HttpVisionMissionRepository implements IVisionMissionRepository {
  async findMany(): Promise<VisionMission[]> {
    const raw = await ApiClient.get<VisionMission[]>("/vision-missions");
    return Array.isArray(raw) ? raw : [];
  }
}
