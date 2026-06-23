export interface Member {
  _id: string;
  name: string;
  email?: string;
  role: string;
  status: "Active" | "Inactive";
  createdAt?: string;
  updatedAt?: string;
}

export interface TeamTask {
  _id: string;
  title: string;
  description?: string;
  assignedTo: Member | string; // Populated or ID
  status: "backlog" | "pending" | "completed";
  priority: "low" | "medium" | "high";
  dueDate?: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
