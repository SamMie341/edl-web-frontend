export interface VisionMission {
  id: number;
  entryType: "VISION" | "MISSION" | string;
  title: string;
  slogan?: string | null;
  description?: string | null;
  content?: string | null;
  imageUrl?: string | null;
  orderIndex?: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}
