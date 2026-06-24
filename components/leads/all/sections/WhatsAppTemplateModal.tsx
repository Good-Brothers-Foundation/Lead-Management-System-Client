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
import { Trash2, Edit2, Plus, MessageSquare, ArrowLeft } from "lucide-react";
import { LeadFormData } from "@/lib/types/lead";
import { useRealtimeSubscription } from "@/components/providers/RealtimeProvider";
import { useAuth } from "@/lib/auth/AuthContext";

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

const safeDecode = (str: string) => {
  try {
    return decodeURIComponent(str);
  } catch (e) {
    return str;
  }
};

const safeEncode = (str: string) => {
  return encodeURIComponent(str);
};

export function WhatsAppTemplateModal({ lead, isOpen, onClose }: WhatsAppTemplateModalProps) {
  const { user } = useAuth();
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
        // Decode templates content
        const decodedData = data.data.map((t: TemplateItem) => ({
          ...t,
          content: safeDecode(t.content)
        }));
        setTemplates(decodedData);
        
        // Auto-select template based on lead service if matching template exists
        if (lead && lead.service) {
          const matchingTemplate = decodedData.find((t: TemplateItem) => 
            t.name.toLowerCase().includes(lead.service!.toLowerCase())
          );
          if (matchingTemplate) {
            setSelectedTemplateId(matchingTemplate._id);
            return;
          }
        }
        
        // Default to custom message
        setSelectedTemplateId("custom");
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

  // Subscribe to real-time events via the unified provider
  useRealtimeSubscription("template_created", (newTemplate: TemplateItem) => {
    const decodedTemplate = {
      ...newTemplate,
      content: safeDecode(newTemplate.content)
    };
    setTemplates((prev) => {
      if (prev.some((t) => t._id === decodedTemplate._id)) return prev;
      return [decodedTemplate, ...prev];
    });
  });

  useRealtimeSubscription("template_updated", (updatedTemplate: TemplateItem) => {
    const decodedTemplate = {
      ...updatedTemplate,
      content: safeDecode(updatedTemplate.content)
    };
    setTemplates((prev) =>
      prev.map((t) => (t._id === decodedTemplate._id ? decodedTemplate : t))
    );
  });

  useRealtimeSubscription("template_deleted", ({ id }: { id: string }) => {
    setTemplates((prev) => prev.filter((t) => t._id !== id));
    if (selectedTemplateId === id) {
      setSelectedTemplateId("custom");
    }
  });

  // Handle template selection and text substitution
  useEffect(() => {
    if (!lead) return;

    if (selectedTemplateId === "custom") {
      let msg = `Hi ${lead.fullName || ""},\n\n`;
      msg += `Hope you're doing well.\n\n`;
      if (lead.service) {
        msg += `I wanted to connect regarding your inquiry for ${lead.service.toUpperCase()}`;
        if (lead.requirements && !lead.requirements.toLowerCase().includes("scraped")) {
          msg += ` (${lead.requirements})`;
        }
        msg += `.\n\n`;
      } else if (lead.requirements && !lead.requirements.toLowerCase().includes("scraped")) {
        msg += `I wanted to connect regarding your requirements: "${lead.requirements}".\n\n`;
      } else {
        msg += `I wanted to reach out and connect with you.\n\n`;
      }
      msg += `Let me know when you're available for a quick chat.`;
      setMessageText(msg);
      return;
    }

    const template = templates.find((t) => t._id === selectedTemplateId);
    if (template) {
      const text = template.content
        .replace(/\{\{leadName\}\}/g, lead.fullName || "")
        .replace(/\{\{phone\}\}/g, lead.phone || "")
        .replace(/\{\{service\}\}/g, lead.service || "")
        .replace(/\{\{assignedTo\}\}/g, lead.assignedTo || "")
        .replace(/\{\{timeline\}\}/g, lead.timeline || "")
        .replace(/\{\{requirements\}\}/g, lead.requirements || "")
        .replace(/\{\{notes\}\}/g, lead.notes || "");
      setMessageText(text);
    }
  }, [selectedTemplateId, lead, templates]);

  if (!lead) return null;

  const insertVariable = (value: string) => {
    const textarea = document.getElementById("msg-textarea") as HTMLTextAreaElement;
    if (!textarea) {
      setMessageText((prev) => prev + value);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);

    setMessageText(before + value + after);
    
    // Put focus back and position cursor after inserted value
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + value.length;
    }, 0);
  };

  const handleSend = async () => {
    let cleanedPhone = lead.phone.replace(/\D/g, "");
    if (!cleanedPhone) return;

    // Normalize local 10-digit, 0-prefixed 11-digit, or 910-prefixed 13-digit Indian phone numbers
    if (cleanedPhone.startsWith("0") && cleanedPhone.length === 11) {
      cleanedPhone = cleanedPhone.substring(1); // Slice the '0' from the front
    } else if (cleanedPhone.startsWith("910") && cleanedPhone.length === 13) {
      cleanedPhone = "91" + cleanedPhone.substring(3); // Slice the '0' after the '91' country code
    }

    if (cleanedPhone.length === 10) {
      cleanedPhone = "91" + cleanedPhone;
    }

    // Replace placeholders in final text as well just in case they are present in custom messages
    const finalMessageText = messageText
      .replace(/\{\{leadName\}\}/g, lead.fullName || "")
      .replace(/\{\{phone\}\}/g, lead.phone || "")
      .replace(/\{\{service\}\}/g, lead.service || "")
      .replace(/\{\{assignedTo\}\}/g, lead.assignedTo || "")
      .replace(/\{\{timeline\}\}/g, lead.timeline || "")
      .replace(/\{\{requirements\}\}/g, lead.requirements || "")
      .replace(/\{\{notes\}\}/g, lead.notes || "");

    const encodedText = encodeURIComponent(finalMessageText);
    const url = `https://api.whatsapp.com/send/?phone=${cleanedPhone}&text=${encodedText}`;
    window.open(url, "_blank", "noopener,noreferrer");

    // Log WhatsApp Outreach Activity
    try {
      const templateName = selectedTemplateId === "custom" 
        ? "Custom message" 
        : (templates.find((t) => t._id === selectedTemplateId)?.name || "Outreach message");
      
      await fetch(`/api/leads/${lead._id}/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "WhatsApp Outreach",
          performedBy: user?.email || "System / Admin",
          details: `Outreach template: "${templateName}"`,
        }),
      });
    } catch (err) {
      console.error("Failed to log outreach activity:", err);
    }

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
          body: JSON.stringify({ name: newTemplateName, content: safeEncode(newTemplateContent) }),
        });
        const data = await res.json();
        if (data.success) {
          const decodedTemplate = {
            ...data.data,
            content: safeDecode(data.data.content)
          };
          setTemplates((prev) =>
            prev.map((t) => (t._id === editingTemplate._id ? decodedTemplate : t))
          );
          setEditingTemplate(null);
        }
      } else {
        // Create template
        const res = await fetch("/api/templates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newTemplateName, content: safeEncode(newTemplateContent) }),
        });
        const data = await res.json();
        if (data.success) {
          const decodedTemplate = {
            ...data.data,
            content: safeDecode(data.data.content)
          };
          setTemplates((prev) => [decodedTemplate, ...prev]);
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
      <DialogContent className="sm:max-w-120 max-h-[90vh] overflow-y-auto bg-card border border-border">
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
                  className="h-8 px-4 text-xs font-semibold text-white bg-(--button-secondary) hover:opacity-90"
                >
                  {isSavingTemplate ? "Saving..." : editingTemplate ? "Save Changes" : "Create"}
                </Button>
              </div>
            </form>

            {/* List of saved templates */}
            <div className="space-y-2.5 max-h-45 overflow-y-auto pr-1">
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
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="msg-textarea" className="text-xs font-semibold">Message Text</Label>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-muted-foreground select-none">Insert:</span>
                    <button
                      type="button"
                      onClick={() => insertVariable(lead.fullName || "")}
                      className="px-1.5 py-0.5 text-[9px] font-bold bg-muted hover:bg-muted-foreground/10 border border-border rounded cursor-pointer transition-all active:scale-95"
                    >
                      Name
                    </button>
                    <button
                      type="button"
                      onClick={() => insertVariable(lead.phone || "")}
                      className="px-1.5 py-0.5 text-[9px] font-bold bg-muted hover:bg-muted-foreground/10 border border-border rounded cursor-pointer transition-all active:scale-95"
                    >
                      Phone
                    </button>
                    {lead.service && (
                      <button
                        type="button"
                        onClick={() => insertVariable(lead.service || "")}
                        className="px-1.5 py-0.5 text-[9px] font-bold bg-muted hover:bg-muted-foreground/10 border border-border rounded cursor-pointer transition-all active:scale-95"
                      >
                        Service
                      </button>
                    )}
                    {lead.assignedTo && (
                      <button
                        type="button"
                        onClick={() => insertVariable(lead.assignedTo || "")}
                        className="px-1.5 py-0.5 text-[9px] font-bold bg-muted hover:bg-muted-foreground/10 border border-border rounded cursor-pointer transition-all active:scale-95"
                      >
                        Owner
                      </button>
                    )}
                    {lead.requirements && (
                      <button
                        type="button"
                        onClick={() => insertVariable(lead.requirements || "")}
                        className="px-1.5 py-0.5 text-[9px] font-bold bg-muted hover:bg-muted-foreground/10 border border-border rounded cursor-pointer transition-all active:scale-95"
                      >
                        Requirements
                      </button>
                    )}
                    {lead.notes && (
                      <button
                        type="button"
                        onClick={() => insertVariable(lead.notes || "")}
                        className="px-1.5 py-0.5 text-[9px] font-bold bg-muted hover:bg-muted-foreground/10 border border-border rounded cursor-pointer transition-all active:scale-95"
                      >
                        Notes
                      </button>
                    )}
                  </div>
                </div>
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
