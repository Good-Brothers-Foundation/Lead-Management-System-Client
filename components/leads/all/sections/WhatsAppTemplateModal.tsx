"use client";

import { useEffect, useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Edit2, Plus, MessageSquare, ArrowLeft, Loader2 } from "lucide-react";
import { LeadFormData } from "@/lib/types/lead";

interface TemplateItem {
  _id: string;
  name: string;
  content: string;
}

interface WhatsAppTemplateModalProps {
  lead: LeadFormData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function WhatsAppTemplateModal({ lead, isOpen, onClose }: WhatsAppTemplateModalProps) {
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("custom");
  const [messageText, setMessageText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // CRUD Template management state
  const [isManaging, setIsManaging] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TemplateItem | null>(null);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateContent, setNewTemplateContent] = useState("");
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/templates");
      const data = await res.json();
      if (data.success) {
        setTemplates(data.data);
        if (data.data.length > 0 && selectedTemplateId === "custom") {
          // Select first template by default if available
          setSelectedTemplateId(data.data[0]._id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
      setIsManaging(false);
      setEditingTemplate(null);
    }
  }, [isOpen]);

  // Handle template selection and text substitution
  useEffect(() => {
    if (!lead) return;

    if (selectedTemplateId === "custom") {
      setMessageText("");
      return;
    }

    const template = templates.find((t) => t._id === selectedTemplateId);
    if (template) {
      const text = template.content
        .replace(/\{\{leadName\}\}/g, lead.fullName || "")
        .replace(/\{\{phone\}\}/g, lead.phone || "")
        .replace(/\{\{service\}\}/g, lead.service || "")
        .replace(/\{\{assignedTo\}\}/g, lead.assignedTo || "")
        .replace(/\{\{timeline\}\}/g, lead.timeline || "");
      setMessageText(text);
    }
  }, [selectedTemplateId, lead, templates]);

  if (!lead) return null;

  const handleSend = () => {
    const cleanedPhone = lead.phone.replace(/\D/g, "");
    if (!cleanedPhone) return;

    const encodedText = encodeURIComponent(messageText);
    const url = `https://wa.me/${cleanedPhone}?text=${encodedText}`;
    window.open(url, "_blank", "noopener,noreferrer");
    onClose();
  };

  const handleAddOrEditTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplateName.trim() || !newTemplateContent.trim()) return;

    setIsSavingTemplate(true);
    try {
      if (editingTemplate) {
        // Update template
        const res = await fetch(`/api/templates/${editingTemplate._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newTemplateName, content: newTemplateContent }),
        });
        const data = await res.json();
        if (data.success) {
          setTemplates((prev) =>
            prev.map((t) => (t._id === editingTemplate._id ? data.data : t))
          );
          setEditingTemplate(null);
        }
      } else {
        // Create template
        const res = await fetch("/api/templates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newTemplateName, content: newTemplateContent }),
        });
        const data = await res.json();
        if (data.success) {
          setTemplates((prev) => [data.data, ...prev]);
        }
      }
      setNewTemplateName("");
      setNewTemplateContent("");
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingTemplate(false);
    }
  };

  const handleStartEdit = (template: TemplateItem) => {
    setEditingTemplate(template);
    setNewTemplateName(template.name);
    setNewTemplateContent(template.content);
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;

    try {
      const res = await fetch(`/api/templates/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setTemplates((prev) => prev.filter((t) => t._id !== id));
        if (selectedTemplateId === id) {
          setSelectedTemplateId("custom");
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto bg-card border border-border">
        {isManaging ? (
          /* Templates Management Mode */
          <div className="space-y-4">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => {
                    setIsManaging(false);
                    setEditingTemplate(null);
                    setNewTemplateName("");
                    setNewTemplateContent("");
                  }}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <DialogTitle className="text-lg font-bold text-foreground">Manage Templates</DialogTitle>
              </div>
              <DialogDescription className="text-xs text-muted-foreground pl-10">
                Create and edit templates for quick WhatsApp client outreach.
              </DialogDescription>
            </DialogHeader>

            {/* Template Creator Form */}
            <form onSubmit={handleAddOrEditTemplate} className="space-y-3 bg-muted/20 p-3 rounded-xl border border-border/40">
              <span className="text-xs font-bold text-foreground capitalize">
                {editingTemplate ? "Edit Template" : "Add New Template"}
              </span>
              <div className="space-y-1">
                <Label htmlFor="template-name" className="text-[11px] font-semibold">Template Name *</Label>
                <Input
                  id="template-name"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="e.g. Introduction Outreach"
                  required
                  className="h-9 bg-muted/10 border-input"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="template-content" className="text-[11px] font-semibold">Message Text *</Label>
                <Textarea
                  id="template-content"
                  value={newTemplateContent}
                  onChange={(e) => setNewTemplateContent(e.target.value)}
                  placeholder="Hello {{leadName}}, thanks for..."
                  rows={3}
                  required
                  className="bg-muted/10 border-input resize-none text-xs"
                />
                <span className="text-[9px] text-muted-foreground/80 leading-normal block">
                  Available tags: <code className="bg-muted px-1 py-0.5 rounded font-mono font-bold">{"{{leadName}}"}</code>, <code className="bg-muted px-1 py-0.5 rounded font-mono font-bold">{"{{service}}"}</code>, <code className="bg-muted px-1 py-0.5 rounded font-mono font-bold">{"{{timeline}}"}</code>, <code className="bg-muted px-1 py-0.5 rounded font-mono font-bold">{"{{assignedTo}}"}</code>
                </span>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                {editingTemplate && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setEditingTemplate(null);
                      setNewTemplateName("");
                      setNewTemplateContent("");
                    }}
                    className="h-8 text-xs cursor-pointer"
                  >
                    Cancel
                  </Button>
                )}
                <Button 
                  type="submit" 
                  disabled={isSavingTemplate}
                  className="h-8 px-4 text-xs font-semibold text-white bg-[var(--button-secondary)] hover:opacity-90"
                >
                  {isSavingTemplate ? "Saving..." : editingTemplate ? "Save Changes" : "Create"}
                </Button>
              </div>
            </form>

            {/* List of saved templates */}
            <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1">
              <span className="text-xs font-bold text-foreground">Saved Templates ({templates.length})</span>
              {templates.length > 0 ? (
                templates.map((t) => (
                  <div key={t._id} className="flex items-center justify-between gap-3 p-2.5 rounded-lg border border-border/80 bg-background hover:bg-muted/10">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">{t.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{t.content}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleStartEdit(t)}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteTemplate(t._id)}
                        className="h-7 w-7 text-muted-foreground hover:text-destructive cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-center text-muted-foreground italic py-4">No templates found.</p>
              )}
            </div>
          </div>
        ) : (
          /* Outreach Messaging Mode */
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-foreground">Outreach to {lead.fullName}</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Select a message template or write a custom message to launch WhatsApp.
              </DialogDescription>
            </DialogHeader>

            {/* Template Selection */}
            <div className="space-y-3.5">
              <div className="flex items-end justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <Label htmlFor="template-select" className="text-xs font-semibold">Outreach Template</Label>
                  <Select onValueChange={setSelectedTemplateId} value={selectedTemplateId}>
                    <SelectTrigger id="template-select" className="h-10 bg-muted/10 border-input">
                      <SelectValue placeholder="Custom Message" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="custom">-- Custom Message --</SelectItem>
                      {templates.map((t) => (
                        <SelectItem key={t._id} value={t._id}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsManaging(true)}
                  className="h-10 gap-1.5 font-semibold text-xs border-dashed cursor-pointer shrink-0"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Templates
                </Button>
              </div>

              {/* Message Content Preview Area */}
              <div className="space-y-1">
                <Label htmlFor="msg-textarea" className="text-xs font-semibold">Message Text</Label>
                <Textarea
                  id="msg-textarea"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your outreach message here..."
                  rows={6}
                  className="bg-muted/10 border-input resize-none text-xs leading-normal"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={onClose} className="h-10 font-semibold cursor-pointer">
                Cancel
              </Button>
              <Button 
                onClick={handleSend} 
                className="h-10 gap-1.5 px-6 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 hover:opacity-90"
              >
                <MessageSquare className="h-4 w-4" />
                Send via WhatsApp
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
