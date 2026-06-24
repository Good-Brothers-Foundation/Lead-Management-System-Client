import { LeadFormData, LeadPayload } from "@/lib/types/lead";
import { apiRequest } from "./http-client";

interface LeadsListResponse {
  success: boolean;
  count?: number;
  data: LeadFormData[];
  categories?: string[];
  services?: string[];
  sources?: string[];
  timelines?: string[];
  budgets?: string[];
  statusCounts?: Record<string, number>;
  pagination?: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

interface LeadResponse {
  success: boolean;
  message?: string;
  data: LeadFormData;
}

export const leadsApi = {
  async getAll(params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    search?: string;
  }) {
    let url = "/leads";
    if (params) {
      const searchParams = new URLSearchParams();
      if (params.page !== undefined) searchParams.append("page", String(params.page));
      if (params.limit !== undefined) searchParams.append("limit", String(params.limit));
      if (params.status && params.status !== "all") searchParams.append("status", params.status);
      if (params.category && params.category !== "all") searchParams.append("category", params.category);
      if (params.search && params.search.trim() !== "") searchParams.append("search", params.search.trim());
      
      const queryStr = searchParams.toString();
      if (queryStr) {
        url += `?${queryStr}`;
      }
    }
    const response = await apiRequest<LeadsListResponse>(url);
    return response;
  },

  async getById(id: string) {
    const response = await apiRequest<LeadResponse>(`/leads/${id}`);
    return response.data;
  },

  async create(payload: LeadPayload) {
    const response = await apiRequest<LeadResponse>("/leads", {
      method: "POST",
      body: payload,
    });
    return response.data;
  },

  async update(id: string, payload: Partial<LeadPayload>) {
    const response = await apiRequest<LeadResponse>(`/leads/${id}`, {
      method: "PUT",
      body: payload,
    });
    return response.data;
  },

  async remove(id: string) {
    await apiRequest<{ success: boolean; message: string }>(`/leads/${id}`, {
      method: "DELETE",
    });
  },
};
