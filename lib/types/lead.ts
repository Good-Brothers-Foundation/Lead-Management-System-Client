export interface LeadFormData {
  _id?: string;
  fullName: string;
  phone: string;
  source: string;
  status: string;

  alternatePhone?: string;
  email?: string;
  company?: string;
  service?: string;
  budget?: string;
  timeline?: string;
  assignedTo?: string;
  followUpDate?: string;
  followUpTime?: string;
  priority?: string;
  contactMethod?: string;
  requirements?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type LeadPayload = Omit<LeadFormData, "_id" | "createdAt" | "updatedAt">;
