import { ENV } from "../config/env.config";

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class ApiClient {
  private static baseUrl = ENV.API_BASE_URL;

  public static async get<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T | null> {
    try {
      const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
      const url = `${this.baseUrl}${cleanEndpoint}`;

      const res = await fetch(url, {
        next: { revalidate: ENV.REVALIDATE_TIME },
        signal: options?.signal ?? AbortSignal.timeout(10_000),
        headers: {
          Accept: "application/json",
          ...options?.headers,
        },
        ...options,
      });

      if (!res.ok) {
        console.warn(`[ApiClient] HTTP ${res.status} on ${endpoint}`);
        return null;
      }

      const json = await res.json();
      return (json.data ?? json) as T;
    } catch (error) {
      console.warn(`[ApiClient] Network/Fetch error on ${endpoint}:`, error);
      return null;
    }
  }

  public static async post<T>(
    endpoint: string,
    body: unknown,
    options?: RequestInit
  ): Promise<T | null> {
    try {
      const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
      const url = `${this.baseUrl}${cleanEndpoint}`;

      const res = await fetch(url, {
        method: "POST",
        signal: options?.signal ?? AbortSignal.timeout(10_000),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...options?.headers,
        },
        body: JSON.stringify(body),
        ...options,
      });

      if (!res.ok) {
        console.warn(`[ApiClient] HTTP ${res.status} on POST ${endpoint}`);
        return null;
      }

      const json = await res.json();
      return (json.data ?? json) as T;
    } catch (error) {
      console.warn(`[ApiClient] Network/Fetch error on POST ${endpoint}:`, error);
      return null;
    }
  }

  public static async put<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<T | null> {
    try {
      const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
      const url = `${this.baseUrl}${cleanEndpoint}`;
      const hasBody = body !== undefined;

      const res = await fetch(url, {
        method: "PUT",
        signal: options?.signal ?? AbortSignal.timeout(10_000),
        headers: {
          ...(hasBody ? { "Content-Type": "application/json" } : {}),
          Accept: "application/json",
          ...options?.headers,
        },
        ...(hasBody ? { body: JSON.stringify(body) } : {}),
        ...options,
      });

      if (!res.ok) {
        console.warn(`[ApiClient] HTTP ${res.status} on PUT ${endpoint}`);
        return null;
      }

      const json = await res.json();
      return (json.data ?? json) as T;
    } catch (error) {
      console.warn(`[ApiClient] Network/Fetch error on PUT ${endpoint}:`, error);
      return null;
    }
  }
}
