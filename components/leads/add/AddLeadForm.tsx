"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

// Import Modular Components
import PersonalInfoSection from "./sections/PersonalInfoSection";
import LeadInfoSection from "./sections/LeadInfoSection";
import FollowUpSection from "./sections/FollowUpSection";
import AdditionalInfoSection from "./sections/AdditionalInfoSection";
import FormActions from "./sections/FormActions";
import StatusModal from "@/components/ui/StatusModal"; // Integrated
import { LeadFormData } from "@/lib/types/lead";

export default function AddLeadForm() {
  const [formData, setFormData] = useState<LeadFormData>({
    id : "",
    fullName: "",
    phone: "",
    alternatePhone: "",
    email: "",
    company: "",
    service: "",
    budget: "",
    timeline: "",
    source: "",
    status: "",
    assignedTo: "",
    followUpDate: "",
    followUpTime: "",
    priority: "",
    contactMethod: "",
    requirements: "",
    notes: "",
  });

  // Modal State Trigger Context
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title?: string;
    description?: string;
  }>({
    isOpen: false,
    type: "success",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Fixed signature to match keyof constraint of your modular components
  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      // Mock API submission execution payload. 
      // Replace with your true backend fetch/axios request: await axios.post('/api/leads', formData)
      const isSuccess = true; 

      if (isSuccess) {
        setModalState({
          isOpen: true,
          type: "success",
          title: "Lead Logged Successfully",
          description: "The workflow assigned to this lead profile is now active.",
        });
        
        setFormData({
          id: "",
          fullName: "",
          phone: "",
          alternatePhone: "",
          email: "",
          company: "",
          service: "",
          budget: "",
          timeline: "",
          source: "",
          status: "",
          assignedTo: "",
          followUpDate: "",
          followUpTime: "",
          priority: "",
          contactMethod: "",
          requirements: "",
          notes: "",
        });
      } else {
        throw new Error("API Rejection");
      }
    } catch (error) {
      setModalState({
        isOpen: true,
        type: "error",
        title: "Database Entry Error",
        description: "Failed to parse system network communication protocols. Check fields and try again.",
      });
    }
  };

  return (
    <>
      <Card className="max-w-7xl bg-card shadow-sm rounded-lg">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-10">
            
            <PersonalInfoSection formData={formData} onChange={handleChange} />
            
            <LeadInfoSection formData={formData} onSelectChange={handleSelectChange} />
            
            <FollowUpSection formData={formData} onChange={handleChange} onSelectChange={handleSelectChange} />
            
            <AdditionalInfoSection formData={formData} onChange={handleChange} />
            
            <FormActions />

          </form>
        </CardContent>
      </Card>

      {/* Reusable, Centered Confirmation Popup Component Layout */}
      <StatusModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        title={modalState.title}
        description={modalState.description}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
      />
    </>
  );
}