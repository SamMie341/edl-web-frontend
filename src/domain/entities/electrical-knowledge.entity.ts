export interface ElectricalKnowledge {
  id: number;
  title: string;
  coverImage?: string | null;
  videoUrl?: string | null;
  content?: string | null;
  viewCount?: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SafetyTopic {
  id: string;
  title: string;
  summary: string;
  tips: string[];
}
