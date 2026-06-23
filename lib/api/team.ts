import { Member, TeamTask } from "@/lib/types/team";
import { apiRequest } from "./http-client";

interface MembersListResponse {
  success: boolean;
  count: number;
  data: Member[];
}

interface MemberResponse {
  success: boolean;
  message?: string;
  data: Member;
}

interface TeamTasksListResponse {
  success: boolean;
  count: number;
  data: TeamTask[];
}

interface TeamTaskResponse {
  success: boolean;
  message?: string;
  data: TeamTask;
}

export const membersApi = {
  async getAll() {
    const response = await apiRequest<MembersListResponse>("/members");
    return response.data;
  },

  async getById(id: string) {
    const response = await apiRequest<MemberResponse>(`/members/${id}`);
    return response.data;
  },

  async create(payload: Omit<Member, "_id" | "createdAt" | "updatedAt">) {
    const response = await apiRequest<MemberResponse>("/members", {
      method: "POST",
      body: payload,
    });
    return response.data;
  },

  async update(id: string, payload: Partial<Omit<Member, "_id">>) {
    const response = await apiRequest<MemberResponse>(`/members/${id}`, {
      method: "PUT",
      body: payload,
    });
    return response.data;
  },

  async remove(id: string) {
    await apiRequest<{ success: boolean; message: string }>(`/members/${id}`, {
      method: "DELETE",
    });
  },
};

export const teamTasksApi = {
  async getAll() {
    const response = await apiRequest<TeamTasksListResponse>("/team-tasks");
    return response.data;
  },

  async getById(id: string) {
    const response = await apiRequest<TeamTaskResponse>(`/team-tasks/${id}`);
    return response.data;
  },

  async create(payload: Omit<TeamTask, "_id" | "createdAt" | "updatedAt" | "assignedTo"> & { assignedTo: string }) {
    const response = await apiRequest<TeamTaskResponse>("/team-tasks", {
      method: "POST",
      body: payload,
    });
    return response.data;
  },

  async update(id: string, payload: Partial<Omit<TeamTask, "_id" | "assignedTo"> & { assignedTo?: string }>) {
    const response = await apiRequest<TeamTaskResponse>(`/team-tasks/${id}`, {
      method: "PUT",
      body: payload,
    });
    return response.data;
  },

  async remove(id: string) {
    await apiRequest<{ success: boolean; message: string }>(`/team-tasks/${id}`, {
      method: "DELETE",
    });
  },
};
