export interface Legislation {
  id: number;
  documentNumber?: string | null;
  title: string;
  fileUrl?: string | null;
  issueDate?: string | null;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED" | string;
  createdAt?: string;
  updatedAt?: string;
}
