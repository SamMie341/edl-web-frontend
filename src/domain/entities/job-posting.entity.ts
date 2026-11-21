export interface JobPosition {
  id: number;
  positionName: string;
  description?: string | null;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface JobPosting {
  id: number;
  positionId?: number | null;
  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  description?: string | null;
  status: "OPEN" | "CLOSED" | "CANCELLED" | string;
  createdAt?: string;
  updatedAt?: string;
  position?: JobPosition | null;
}
