"use client";

import { LeadFormData } from "@/lib/types/lead";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FieldRenderer } from "./field-renderer";

interface LeadEditFormProps {
  editData: LeadFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (field: keyof LeadFormData, value: string) => void;
}

export function LeadEditForm({ editData, onChange, onSelectChange }: LeadEditFormProps) {
  return (
    <div className="space-y-8 sm:space-y-10 pb-6">
      
      {/* Block 1: Contact Group Data */}
      <div className="p-4 sm:p-6 border border-border rounded-xl bg-background/50 space-y-4 sm:space-y-6">
        <h3 className="text-md font-semibold tracking-wide uppercase text-muted-foreground/80 border-b border-border pb-2">
          Personal & General Information
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          <FieldRenderer 
            label="Full Name *" 
            name="fullName" 
            value={editData.fullName} 
            isEditing 
            onChange={onChange} 
          />
          <FieldRenderer 
            label="Category" 
            name="category" 
            value={editData.category || ""} 
            isEditing 
            onChange={onChange} 
            renderCustomEdit={
              <input 
                name="category" 
                placeholder="e.g. Technology, Retail, Individual Account" 
                value={editData.category || ""} 
                onChange={onChange} 
                className="h-10 w-full bg-card border border-input rounded-md px-3 text-sm focus-visible:ring-1 focus-visible:outline-none" 
              />
            }
          />
          <FieldRenderer 
            label="Phone Number *" 
            name="phone" 
            value={editData.phone} 
            isEditing 
            onChange={onChange} 
          />
          <FieldRenderer 
            label="Alternate Phone" 
            name="alternatePhone" 
            value={editData.alternatePhone || ""} 
            isEditing 
            onChange={onChange} 
          />
          <FieldRenderer 
            label="Email Addresses (Comma separated)" 
            name="emails" 
            value={editData.emails?.join(", ") || ""} 
            isEditing 
            onChange={onChange} 
            renderCustomEdit={
              <input 
                name="emails" 
                placeholder="email1@example.com, email2@example.com" 
                value={editData.emails?.join(", ") || ""} 
                onChange={onChange} 
                className="h-10 w-full bg-card border border-input rounded-md px-3 text-sm focus-visible:ring-1 focus-visible:outline-none" 
              />
            }
          />
          <FieldRenderer 
            label="Rating (1.0 - 5.0)" 
            name="rating" 
            value={editData.rating?.toString() || ""} 
            isEditing 
            onChange={onChange} 
            renderCustomEdit={
              <input 
                type="number" 
                name="rating" 
                step="0.1" 
                min="1" 
                max="5" 
                value={editData.rating || ""} 
                onChange={onChange} 
                className="h-10 w-full bg-card border border-input rounded-md px-3 text-sm focus-visible:ring-1 focus-visible:outline-none" 
              />
            }
          />
          <div className="md:col-span-2">
            <FieldRenderer 
              label="Address" 
              name="address" 
              value={editData.address || ""} 
              isEditing 
              onChange={onChange} 
            />
          </div>
        </div>
      </div>

      {/* Block 2: Service and System Dropdowns */}
      <div className="p-4 sm:p-6 border border-border rounded-xl bg-background/50 space-y-4 sm:space-y-6">
        <h3 className="text-md font-semibold tracking-wide uppercase text-muted-foreground/80 border-b border-border pb-2">
          Lead & Context Details
        </h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          
          <FieldRenderer
            label="Service Interested In"
            name="service"
            value={editData.service || ""}
            isEditing
            onChange={onChange}
            renderCustomEdit={
              <Select onValueChange={(v) => onSelectChange("service", v)} value={editData.service}>
                <SelectTrigger className="h-10 bg-card"><SelectValue placeholder="Select Service" /></SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="website">Website Development</SelectItem>
                  <SelectItem value="ecommerce">E-Commerce Development</SelectItem>
                  <SelectItem value="app">Mobile App Development</SelectItem>
                  <SelectItem value="seo">SEO & Marketing</SelectItem>
                  <SelectItem value="custom-software">Custom Software</SelectItem>
                </SelectContent>
              </Select>
            }
          />

          <FieldRenderer
            label="Budget Range"
            name="budget"
            value={editData.budget || ""}
            isEditing
            onChange={onChange}
            renderCustomEdit={
              <Select onValueChange={(v) => onSelectChange("budget", v)} value={editData.budget}>
                <SelectTrigger className="h-10 bg-card"><SelectValue placeholder="Select Budget" /></SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="under25">Under ₹25,000</SelectItem>
                  <SelectItem value="25to50">₹25,000 - ₹50,000</SelectItem>
                  <SelectItem value="50to100">₹50,000 - ₹1,00,000</SelectItem>
                  <SelectItem value="100plus">Above ₹1,00,000</SelectItem>
                </SelectContent>
              </Select>
            }
          />

          <FieldRenderer
            label="Project Timeline"
            name="timeline"
            value={editData.timeline || ""}
            isEditing
            onChange={onChange}
            renderCustomEdit={
              <Select onValueChange={(v) => onSelectChange("timeline", v)} value={editData.timeline}>
                <SelectTrigger className="h-10 bg-card"><SelectValue placeholder="Select Timeline" /></SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="1week">Within 1 Week</SelectItem>
                  <SelectItem value="2weeks">Within 2 Weeks</SelectItem>
                  <SelectItem value="1month">Within 1 Month</SelectItem>
                  <SelectItem value="flexible">Flexible / Ongoing</SelectItem>
                </SelectContent>
              </Select>
            }
          />

          <FieldRenderer
            label="Lead Source *"
            name="source"
            value={editData.source}
            isEditing
            onChange={onChange}
            renderCustomEdit={
              <Select onValueChange={(v) => onSelectChange("source", v)} value={editData.source}>
                <SelectTrigger className="h-10 bg-card"><SelectValue placeholder="Select Source" /></SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="google">Google Maps</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp Inquiry</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="social-media">Social Media</SelectItem>
                </SelectContent>
              </Select>
            }
          />

          <FieldRenderer
            label="Lead Status *"
            name="status"
            value={editData.status}
            isEditing
            onChange={onChange}
            renderCustomEdit={
              <Select onValueChange={(v) => onSelectChange("status", v)} value={editData.status}>
                <SelectTrigger className="h-10 bg-card"><SelectValue placeholder="Select Status" /></SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="converted">Qualified</SelectItem>
                  <SelectItem value="proposal">Proposal Sent</SelectItem>
                </SelectContent>
              </Select>
            }
          />

          <FieldRenderer
            label="Assigned To"
            name="assignedTo"
            value={editData.assignedTo || ""}
            isEditing
            onChange={onChange}
            renderCustomEdit={
              <Select onValueChange={(v) => onSelectChange("assignedTo", v)} value={editData.assignedTo}>
                <SelectTrigger className="h-10 bg-card"><SelectValue placeholder="Assign Owner" /></SelectTrigger>
                <SelectContent position="popper">
                  {["Mayank Kansal", "Dipish Bisht", "Dheeraj Patel", "Vinay Suyal", "Ravi Negi", "Rahul Rana"].map((user) => (
                    <SelectItem key={user} value={user.toLowerCase().replace(" ", "-")}>{user}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            }
          />
        </div>
      </div>

      {/* Block 3: Deadlines & Follow-ups */}
      <div className="p-4 sm:p-6 border border-border rounded-xl bg-background/50 space-y-4 sm:space-y-6">
        <h3 className="text-md font-semibold tracking-wide uppercase text-muted-foreground/80 border-b border-border pb-2">
          Follow Up Schedule
        </h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <FieldRenderer
            label="Follow Up Date"
            name="followUpDate"
            value={editData.followUpDate || ""}
            isEditing
            onChange={onChange}
            renderCustomEdit={<input type="date" name="followUpDate" value={editData.followUpDate || ""} onChange={onChange} className="h-10 w-full bg-card border border-input rounded-md px-3 text-sm focus-visible:ring-1 focus-visible:outline-none" />}
          />
          <FieldRenderer
            label="Follow Up Time"
            name="followUpTime"
            value={editData.followUpTime || ""}
            isEditing
            onChange={onChange}
            renderCustomEdit={<input type="time" name="followUpTime" value={editData.followUpTime || ""} onChange={onChange} className="h-10 w-full bg-card border border-input rounded-md px-3 text-sm focus-visible:ring-1 focus-visible:outline-none" />}
          />

          <FieldRenderer
            label="Priority"
            name="priority"
            value={editData.priority || ""}
            isEditing
            onChange={onChange}
            renderCustomEdit={
              <Select onValueChange={(v) => onSelectChange("priority", v)} value={editData.priority}>
                <SelectTrigger className="h-10 bg-card"><SelectValue placeholder="Select Priority" /></SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            }
          />

          <FieldRenderer
            label="Contact Method"
            name="contactMethod"
            value={editData.contactMethod || ""}
            isEditing
            onChange={onChange}
            renderCustomEdit={
              <Select onValueChange={(v) => onSelectChange("contactMethod", v)} value={editData.contactMethod}>
                <SelectTrigger className="h-10 bg-card"><SelectValue placeholder="Select Method" /></SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="call">Call</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            }
          />
        </div>
      </div>

      {/* Block 4: Directory & Social Media Links */}
      <div className="p-4 sm:p-6 border border-border rounded-xl bg-background/50 space-y-4 sm:space-y-6">
        <h3 className="text-md font-semibold tracking-wide uppercase text-muted-foreground/80 border-b border-border pb-2">
          Directory & Social Media Links
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          <FieldRenderer 
            label="Website URL" 
            name="website" 
            value={editData.website || ""} 
            isEditing 
            onChange={onChange} 
          />
          <FieldRenderer 
            label="Google Business Listing (GMB)" 
            name="gmbLink" 
            value={editData.gmbLink || ""} 
            isEditing 
            onChange={onChange} 
          />
          <FieldRenderer 
            label="Facebook Link" 
            name="socials.facebook" 
            value={editData.socials?.facebook || ""} 
            isEditing 
            onChange={onChange} 
            renderCustomEdit={
              <input 
                name="socials.facebook" 
                placeholder="https://facebook.com/username" 
                value={editData.socials?.facebook || ""} 
                onChange={onChange} 
                className="h-10 w-full bg-card border border-input rounded-md px-3 text-sm focus-visible:ring-1 focus-visible:outline-none" 
              />
            }
          />
          <FieldRenderer 
            label="Instagram Link" 
            name="socials.instagram" 
            value={editData.socials?.instagram || ""} 
            isEditing 
            onChange={onChange} 
            renderCustomEdit={
              <input 
                name="socials.instagram" 
                placeholder="https://instagram.com/username" 
                value={editData.socials?.instagram || ""} 
                onChange={onChange} 
                className="h-10 w-full bg-card border border-input rounded-md px-3 text-sm focus-visible:ring-1 focus-visible:outline-none" 
              />
            }
          />
          <FieldRenderer 
            label="LinkedIn Link" 
            name="socials.linkedin" 
            value={editData.socials?.linkedin || ""} 
            isEditing 
            onChange={onChange} 
            renderCustomEdit={
              <input 
                name="socials.linkedin" 
                placeholder="https://linkedin.com/in/username" 
                value={editData.socials?.linkedin || ""} 
                onChange={onChange} 
                className="h-10 w-full bg-card border border-input rounded-md px-3 text-sm focus-visible:ring-1 focus-visible:outline-none" 
              />
            }
          />
          <FieldRenderer 
            label="Twitter Link" 
            name="socials.twitter" 
            value={editData.socials?.twitter || ""} 
            isEditing 
            onChange={onChange} 
            renderCustomEdit={
              <input 
                name="socials.twitter" 
                placeholder="https://twitter.com/username" 
                value={editData.socials?.twitter || ""} 
                onChange={onChange} 
                className="h-10 w-full bg-card border border-input rounded-md px-3 text-sm focus-visible:ring-1 focus-visible:outline-none" 
              />
            }
          />
          <div className="md:col-span-2">
            <FieldRenderer 
              label="YouTube Link" 
              name="socials.youtube" 
              value={editData.socials?.youtube || ""} 
              isEditing 
              onChange={onChange} 
              renderCustomEdit={
                <input 
                  name="socials.youtube" 
                  placeholder="https://youtube.com/c/channelname" 
                  value={editData.socials?.youtube || ""} 
                  onChange={onChange} 
                  className="h-10 w-full bg-card border border-input rounded-md px-3 text-sm focus-visible:ring-1 focus-visible:outline-none" 
                />
              }
            />
          </div>
        </div>
      </div>

      {/* Block 5: Multi-line Textareas */}
      <div className="p-4 sm:p-6 border border-border rounded-xl bg-background/50 space-y-4 sm:space-y-6">
        <h3 className="text-md font-semibold tracking-wide uppercase text-muted-foreground/80 border-b border-border pb-2">
          Detailed Logs & Notes
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Project Requirements</label>
            <Textarea name="requirements" value={editData.requirements || ""} onChange={onChange} rows={4} className="bg-card resize-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Additional Notes</label>
            <Textarea name="notes" value={editData.notes || ""} onChange={onChange} rows={4} className="bg-card resize-none" />
          </div>
        </div>
      </div>

    </div>
  );
}