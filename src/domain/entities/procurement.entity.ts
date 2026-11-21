export interface Procurement {
  id: number;
  tenderNumber: string;
  code?: string;
  title: string;
  fileUrl?: string | null;
  imageUrl?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  deadline?: string;
  type?: string;
  description?: string | null;
  status: "OPEN" | "CLOSED" | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ScheduledOutage {
  id: number;
  area: string;
  date: string;
  time: string;
  reason: string;
  status: string;
}
