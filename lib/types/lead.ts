// types/lead.ts
export interface LeadFormData {
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
}