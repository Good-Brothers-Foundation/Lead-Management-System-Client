"use client";

import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeadFormData } from "@/lib/types/lead";
import { Edit2 } from "lucide-react";

interface LeadDetailDrawerProps {
  lead: LeadFormData | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedLead: LeadFormData) => Promise<void> | void;
}

export default function LeadDetailDrawer({
  lead,
  isOpen,
  onClose,
  onUpdate,
}: LeadDetailDrawerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<LeadFormData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (lead) {
      const syncLeadState = window.setTimeout(() => {
        setEditData({ ...lead });
        setIsEditing(false);
        setSaveError(null);
      }, 0);

      return () => window.clearTimeout(syncLeadState);
    }
  }, [lead, isOpen]);

  if (!lead || !editData) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditData((prev) =>
      prev ? { ...prev, [e.target.name]: e.target.value } : null
    );
  };

  const handleSelectChange = (field: keyof LeadFormData, value: string) => {
    setEditData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editData) {
      setIsSaving(true);
      setSaveError(null);

      try {
        await onUpdate(editData);
        setIsEditing(false);
      } catch (error) {
        setSaveError(
          error instanceof Error ? error.message : "Could not update this lead."
        );
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* Set maximum viewport height to ensure the drawer is scrollable and doesn't spill out */}
      <DrawerContent className="mx-auto max-h-[92vh] flex flex-col bg-card border-t border-border">
        
        {/* Fixed Header */}
        <DrawerHeader className="shrink-0 border-b border-border px-8 py-6 flex flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-left">
            <DrawerTitle className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {isEditing ? "Modify Lead Details" : lead.fullName}
            </DrawerTitle>
            <DrawerDescription className="text-sm text-muted-foreground">
              {isEditing ? "Edit lead information below." : "View lead profile details."}
            </DrawerDescription>
          </div>

          {!isEditing && (
            <Button
              type="button"
              onClick={() => setIsEditing(true)}
              className="h-10 gap-2 px-6 font-semibold text-white transition-colors rounded-md shrink-0 cursor-pointer"
              style={{ backgroundColor: "var(--button-primary)" }}
            >
              <Edit2 className="h-4 w-4" />
              Edit Record
            </Button>
          )}
        </DrawerHeader>

        {/* Scrollable Form Body Container */}
        <form
          onSubmit={handleFormSubmit}
          className="flex-1 overflow-y-auto px-8 py-10 space-y-10"
        >
          {/* Section 1: Personal Information */}
          <div className="p-6 border border-border rounded-xl bg-background/50 space-y-6">
            <h3 className="text-md font-semibold tracking-wide uppercase text-muted-foreground/80 border-b border-border pb-2">
              Personal Information
            </h3>
            <div className="grid gap-x-6 gap-y-6 md:grid-cols-2">
              {[
                { id: "fullName", label: "Full Name *", value: editData.fullName },
                { id: "phone", label: "Phone Number *", value: editData.phone },
                { id: "alternatePhone", label: "Alternate Phone", value: editData.alternatePhone },
                { id: "email", label: "Email Address", value: editData.email },
              ].map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label className="text-sm font-medium">{field.label}</Label>
                  {isEditing ? (
                    <Input
                      name={field.id}
                      value={field.value || ""}
                      onChange={handleInputChange}
                      className="h-10 bg-card border-input"
                    />
                  ) : (
                    <p className="h-10 flex items-center px-3 border border-transparent font-medium">
                      {field.value || "—"}
                    </p>
                  )}
                </div>
              ))}
              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm font-medium">Company Name</Label>
                {isEditing ? (
                  <Input
                    name="company"
                    value={editData.company || ""}
                    onChange={handleInputChange}
                    className="h-10 bg-card border-input"
                  />
                ) : (
                  <p className="h-10 flex items-center px-3 border border-transparent font-medium">
                    {editData.company || "Individual Account"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Lead Information */}
          <div className="p-6 border border-border rounded-xl bg-background/50 space-y-6">
            <h3 className="text-md font-semibold tracking-wide uppercase text-muted-foreground/80 border-b border-border pb-2">
              Lead Information
            </h3>
            <div className="grid gap-x-6 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Service Interested In</Label>
                {isEditing ? (
                  <Select
                    onValueChange={(v) => handleSelectChange("service", v)}
                    value={editData.service}
                  >
                    <SelectTrigger className="h-10 bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="website">Website Development</SelectItem>
                      <SelectItem value="ecommerce">E-Commerce Development</SelectItem>
                      <SelectItem value="app">Mobile App Development</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="h-10 flex items-center px-3 font-medium capitalize">
                    {editData.service || "—"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Budget Range</Label>
                {isEditing ? (
                  <Select
                    onValueChange={(v) => handleSelectChange("budget", v)}
                    value={editData.budget}
                  >
                    <SelectTrigger className="h-10 bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="under25">Under ₹25,000</SelectItem>
                      <SelectItem value="25to50">₹25,000 - ₹50,000</SelectItem>
                      <SelectItem value="100plus">Above ₹1,00,000</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="h-10 flex items-center px-3 font-medium">
                    {editData.budget || "—"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Project Timeline</Label>
                {isEditing ? (
                  <Select
                    onValueChange={(v) => handleSelectChange("timeline", v)}
                    value={editData.timeline}
                  >
                    <SelectTrigger className="h-10 bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="1week">Within 1 Week</SelectItem>
                      <SelectItem value="1month">Within 1 Month</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="h-10 flex items-center px-3 font-medium">
                    {editData.timeline || "—"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Lead Source *</Label>
                {isEditing ? (
                  <Select
                    onValueChange={(v) => handleSelectChange("source", v)}
                    value={editData.source}
                  >
                    <SelectTrigger className="h-10 bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="h-10 flex items-center px-3 font-medium capitalize">
                    {editData.source}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Lead Status *</Label>
                {isEditing ? (
                  <Select
                    onValueChange={(v) => handleSelectChange("status", v)}
                    value={editData.status}
                  >
                    <SelectTrigger className="h-10 bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="h-10 flex items-center px-3 font-medium capitalize">
                    {editData.status}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Assigned To</Label>
                {isEditing ? (
                  <Select
                    onValueChange={(v) => handleSelectChange("assignedTo", v)}
                    value={editData.assignedTo}
                  >
                    <SelectTrigger className="h-10 bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="mayank">Mayank</SelectItem>
                      <SelectItem value="priya">Priya</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="h-10 flex items-center px-3 font-medium capitalize">
                    {editData.assignedTo || "Unassigned"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Follow Up Information */}
          <div className="p-6 border border-border rounded-xl bg-background/50 space-y-6">
            <h3 className="text-md font-semibold tracking-wide uppercase text-muted-foreground/80 border-b border-border pb-2">
              Follow Up Information
            </h3>
            <div className="grid gap-x-6 gap-y-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Follow Up Date</Label>
                {isEditing ? (
                  <Input
                    type="date"
                    name="followUpDate"
                    value={editData.followUpDate || ""}
                    onChange={handleInputChange}
                    className="h-10 bg-card"
                  />
                ) : (
                  <p className="h-10 flex items-center px-3 font-medium">
                    {editData.followUpDate || "—"}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Follow Up Time</Label>
                {isEditing ? (
                  <Input
                    type="time"
                    name="followUpTime"
                    value={editData.followUpTime || ""}
                    onChange={handleInputChange}
                    className="h-10 bg-card"
                  />
                ) : (
                  <p className="h-10 flex items-center px-3 font-medium">
                    {editData.followUpTime || "—"}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Priority</Label>
                {isEditing ? (
                  <Select
                    onValueChange={(v) => handleSelectChange("priority", v)}
                    value={editData.priority}
                  >
                    <SelectTrigger className="h-10 bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="h-10 flex items-center px-3 font-medium capitalize">
                    {editData.priority || "—"}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Contact Method</Label>
                {isEditing ? (
                  <Select
                    onValueChange={(v) => handleSelectChange("contactMethod", v)}
                    value={editData.contactMethod}
                  >
                    <SelectTrigger className="h-10 bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="call">Call</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="h-10 flex items-center px-3 font-medium capitalize">
                    {editData.contactMethod || "—"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Text Areas */}
          <div className="p-6 border border-border rounded-xl bg-background/50 space-y-6">
            <h3 className="text-md font-semibold tracking-wide uppercase text-muted-foreground/80 border-b border-border pb-2">
              Additional Information
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Project Requirements</Label>
                {isEditing ? (
                  <Textarea
                    name="requirements"
                    value={editData.requirements || ""}
                    onChange={handleInputChange}
                    rows={4}
                    className="bg-card resize-none"
                  />
                ) : (
                  <p className="p-3 bg-muted/30 rounded-md text-sm leading-relaxed">
                    {editData.requirements || "No requirements added."}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Additional Notes</Label>
                {isEditing ? (
                  <Textarea
                    name="notes"
                    value={editData.notes || ""}
                    onChange={handleInputChange}
                    rows={4}
                    className="bg-card resize-none"
                  />
                ) : (
                  <p className="p-3 bg-muted/30 rounded-md text-sm leading-relaxed">
                    {editData.notes || "No notes added."}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Fixed Bottom Action Section Container */}
          {saveError && (
            <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {saveError}
            </p>
          )}

          <DrawerFooter className="shrink-0 flex flex-row justify-end items-center gap-4 px-0 pt-8 border-t border-border bg-card">
            {isEditing ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="h-11 px-8 font-semibold cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="h-11 px-10 font-semibold text-white shadow-md transition-all cursor-pointer"
                  style={{ backgroundColor: "var(--button-secondary)" }}
                >
                  {isSaving ? "Updating..." : "Update Lead"}
                </Button>
              </>
            ) : (
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="h-11 px-10 font-semibold cursor-pointer"
              >
                Close View
              </Button>
            )}
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
