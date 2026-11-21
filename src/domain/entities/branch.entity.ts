export type RegionType = "north" | "central" | "south";

export interface Branch {
  id: number;
  departmentId?: number | null;
  branchName: string;
  branchImage?: string | null;
  coverImage?: string | null;
  orgChartImage?: string | null;
  address?: string | null;
  locationCoordinates?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  roleResponsibilities?: string | null;
  orderIndex?: number | null;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  department?: {
    id: number;
    name?: string;
    departmentName?: string;
  } | null;
  province?: {
    id: number;
    name: string;
  } | null;
  district?: {
    id: number;
    name: string;
  } | null;
}

export interface ServiceCenter {
  id: number;
  departmentId?: number | null;
  branchId?: number | null;
  centerName: string;
  phoneNumber?: string | null;
  provinceId?: number | null;
  districtId?: number | null;
  villageId?: number | null;
  longitude?: string | null;
  latitude?: string | null;
  imageUrl?: string | null;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  department?: {
    id: number;
    name: string;
  } | null;
  branch?: {
    id: number;
    branchName: string;
  } | null;
  province?: {
    id: number;
    name: string;
  } | null;
  district?: {
    id: number;
    name: string;
  } | null;
  village?: {
    id: number;
    name: string;
  } | null;
}

export interface BranchDisplay {
  id: number;
  name: string;
  province: string;
  region: RegionType;
  address: string;
  phone: string;
  email?: string;
  hotline: string;
  hours: string;
  isHeadquarters?: boolean;
  image?: string | null;
  coverImage?: string | null;
  branchImage?: string | null;
}
