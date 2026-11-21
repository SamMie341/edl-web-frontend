export interface Magazine {
  id: number;
  title: string;
  issueNumber?: string | null;
  publishedYear?: string | null;
  description?: string | null;
  coverImage?: string | null;
  fileUrl?: string | null;
  publishedDate?: string | null;
  downloadCount?: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}
