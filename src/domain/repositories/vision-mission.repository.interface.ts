import { VisionMission } from "../entities/vision-mission.entity";

export interface IVisionMissionRepository {
  findMany(): Promise<VisionMission[]>;
}
