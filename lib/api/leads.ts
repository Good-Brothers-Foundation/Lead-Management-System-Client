import { LeadFormData, LeadPayload } from "@/lib/types/lead";
import { apiRequest } from "./http-client";

interface LeadsListResponse {
  success: boolean;
  count: number;
  data: LeadFormData[];
}

interface LeadResponse {
  success: boolean;
  message?: string;
  data: LeadFormData;
}

export const leadsApi = {
  async getAll() {
    const response = await apiRequest<LeadsListResponse>("/leads");
    return response.data;
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
