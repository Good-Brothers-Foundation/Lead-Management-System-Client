"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

// Import Modular Components
import PersonalInfoSection from "./sections/PersonalInfoSection";
import LeadInfoSection from "./sections/LeadInfoSection";
import FollowUpSection from "./sections/FollowUpSection";
import AdditionalInfoSection from "./sections/AdditionalInfoSection";
import FormActions from "./sections/FormActions";
import StatusModal from "@/components/ui/StatusModal";
import { leadsApi } from "@/lib/api/leads";
import { LeadFormData, LeadPayload } from "@/lib/types/lead";

// FIX: Initial state must mirror your Mongoose Schema and support UI expectations
const emptyLeadForm: LeadFormData = {
  fullName: "",
  phone: "",
  alternatePhone: "",
  emails: [], // FIX: Initialized as an array to prevent .join() runtime crashes
  category: "", // FIX: Synced from 'company' to match your DB schema and UI layout
  address: "",
  website: "",
  gmbLink: "",
  rating: undefined,
  socials: {
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
    youtube: "",
  },
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
};

// FIX: Sanitize and cast your types properly before hitting the server API
const toLeadPayload = (lead: LeadFormData): LeadPayload => {
  const payload = {
    ...lead,
    // Cast rating string back to a float/number or undefined for Mongoose compliance
    rating: lead.rating ? parseFloat(lead.rating.toString()) : undefined,
  };

  delete payload._id;
  delete payload.createdAt;
  delete payload.updatedAt;

  return payload;
};

export default function AddLeadForm() {
  const [formData, setFormData] = useState<LeadFormData>(emptyLeadForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // FIX: Intercept array fields and nested sub-objects (socials) safely
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    // Route social inputs cleanly into the nested state tree (name is "socials.facebook" etc.)
    if (name.startsWith("socials.")) {
      const socialKey = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socials: {
          ...prev.socials,
          [socialKey]: value,
        },
      }));
      return;
    }

    // Intercept emails field to maintain array type state integrity
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "emails"
          ? value.split(",").map((email) => email.trimStart()) // Maintains array for .join() operations
          : value,
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await leadsApi.create(toLeadPayload(formData));

      setModalState({
        isOpen: true,
        type: "success",
        title: "Lead Logged Successfully",
        description:
          "The workflow assigned to this lead profile is now active.",
      });

      setFormData(emptyLeadForm);
    } catch (error) {
      setModalState({
        isOpen: true,
        type: "error",
        title: "Database Entry Error",
        description:
          error instanceof Error
            ? error.message
            : "Could not save this lead. Check fields and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card className="max-w-7xl bg-card shadow-sm rounded-lg">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-10">
            <PersonalInfoSection formData={formData} onChange={handleChange} />

            <LeadInfoSection
              formData={formData}
              onSelectChange={handleSelectChange}
            />

            <FollowUpSection
              formData={formData}
              onChange={handleChange}
              onSelectChange={handleSelectChange}
            />

            <AdditionalInfoSection
              formData={formData}
              onChange={handleChange}
            />

            <FormActions isSubmitting={isSubmitting} />
          </form>
        </CardContent>
      </Card>

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
