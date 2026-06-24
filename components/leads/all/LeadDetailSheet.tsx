"use client";

import { useState, useEffect } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { LeadFormData } from "@/lib/types/lead";
import { Edit2 } from "lucide-react";
import { LeadEditForm } from "./sections/drawer/lead-edit-form";
import { LeadDetailView } from "./sections/drawer/lead-detail-view";
import { useAuth } from "@/lib/auth/AuthContext";

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
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<LeadFormData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Synchronize incoming baseline props directly into form tree
  useEffect(() => {
    if (lead && isOpen) {
      setEditData({ ...lead });
      setIsEditing(false);
      setSaveError(null);
    }
  }, [lead, isOpen]);

  if (!lead || !editData) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => {
      if (!prev) return null;
      if (name.startsWith("socials.")) {
        const socialKey = name.split(".")[1];
        return {
          ...prev,
          socials: {
            ...(prev.socials || {}),
            [socialKey]: value,
          },
        };
      }
      if (name === "emails") {
        return {
          ...prev,
          emails: value ? value.split(",").map((email) => email.trim()) : [],
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSelectChange = (field: keyof LeadFormData, value: string) => {
    setEditData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editData) return;
    
    setIsSaving(true);
    setSaveError(null);
    try {
      await onUpdate(editData);
      setIsEditing(false);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Could not update this lead.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="mx-auto max-h-[92vh] flex flex-col bg-card border-t border-border">
        
        {/* Fixed Section Header Area Layout */}
        <DrawerHeader className="shrink-0 border-b border-border px-4 sm:px-8 py-4 sm:py-6 flex flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-left">
            <DrawerTitle className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {isEditing ? "Modify Lead Details" : lead.fullName}
            </DrawerTitle>
            <DrawerDescription className="text-sm text-muted-foreground flex items-center">
              {isEditing ? (
                "Edit lead information below."
              ) : (
                "View lead profile details."
              )}
            </DrawerDescription>
          </div>

          {!isEditing && (
            <Button
              type="button"
              onClick={() => setIsEditing(true)}
              className="h-10 gap-2 px-6 font-semibold text-white transition-colors rounded-md shrink-0 cursor-pointer bg-(--button-primary) hover:opacity-90"
            >
              <Edit2 className="h-4 w-4" />
              Edit Record
            </Button>
          )}
        </DrawerHeader>

        {/* Primary View / Form Scroll Containment Node */}
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 sm:py-10 space-y-6">
          {isEditing ? (
            <LeadEditForm 
              editData={editData} 
              onChange={handleInputChange} 
              onSelectChange={handleSelectChange} 
            />
          ) : (
            <LeadDetailView lead={lead} />
          )}

          {/* Validation Status Block Interface */}
          {saveError && (
            <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive animate-in fade-in duration-150">
              {saveError}
            </p>
          )}

          {/* Persistent Footer Trigger Row */}
          <DrawerFooter className="shrink-0 flex flex-row justify-end items-center gap-3 sm:gap-4 px-0 pt-6 sm:pt-8 border-t border-border bg-card">
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
                  className="h-11 px-10 font-semibold text-white shadow-md transition-all cursor-pointer bg-(--button-secondary) hover:opacity-90"
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