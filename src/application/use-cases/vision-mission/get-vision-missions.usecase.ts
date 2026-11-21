import { IVisionMissionRepository } from "@/domain/repositories/vision-mission.repository.interface";
import { VisionMission } from "@/domain/entities/vision-mission.entity";
import { visionMissionRepository } from "@/infrastructure/repositories";

export async function getVisionMissionsUseCase(
  repo: IVisionMissionRepository = visionMissionRepository
): Promise<VisionMission[]> {
  return repo.findMany();
}
