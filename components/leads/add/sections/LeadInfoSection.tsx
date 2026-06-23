import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeadFormData } from "@/lib/types/lead";

interface LeadInfoProps {
  formData: LeadFormData;
  onSelectChange: (field: string, value: string) => void;
}

export default function LeadInfoSection({
  formData,
  onSelectChange,
}: LeadInfoProps) {
  return (
    <div className="p-6 border border-border rounded-xl bg-background/50 space-y-6">
      <h3 className="text-md font-semibold tracking-wide uppercase text-muted-foreground/80 border-b border-border pb-2">
        Lead Information
      </h3>
      <div className="grid gap-x-6 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Service Interested In</Label>
          <Select
            onValueChange={(v) => onSelectChange("service", v)}
            value={formData.service}
          >
            <SelectTrigger id="service" className="h-10 bg-card border-input">
              <SelectValue placeholder="Select Service" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              sideOffset={4}
              className="w-[--radix-select-trigger-width]"
            >
              <SelectItem value="unidentified">UnIdentified</SelectItem>
              <SelectItem value="website">Website Development</SelectItem>
              <SelectItem value="ecommerce">E-Commerce Development</SelectItem>
              <SelectItem value="app">Mobile App Development</SelectItem>
              <SelectItem value="seo">SEO</SelectItem>
              <SelectItem value="uiux">UI/UX Design</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Budget Range</Label>
          <Select
            onValueChange={(v) => onSelectChange("budget", v)}
            value={formData.budget}
          >
            <SelectTrigger id="budget" className="h-10 bg-card border-input">
              <SelectValue placeholder="Select Budget" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              sideOffset={4}
              className="w-[--radix-select-trigger-width]"
            >
              <SelectItem value="unidentified">UnIdentified</SelectItem>
              <SelectItem value="under25">Under ₹25,000</SelectItem>
              <SelectItem value="25to50">₹25,000 - ₹50,000</SelectItem>
              <SelectItem value="50to100">₹50,000 - ₹1,00,000</SelectItem>
              <SelectItem value="100plus">Above ₹1,0,000</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Project Timeline</Label>
          <Select
            onValueChange={(v) => onSelectChange("timeline", v)}
            value={formData.timeline}
          >
            <SelectTrigger id="timeline" className="h-10 bg-card border-input">
              <SelectValue placeholder="Select Timeline" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              sideOffset={4}
              className="w-[--radix-select-trigger-width]"
            >
              <SelectItem value="unidentified">UnIdentified</SelectItem>
              <SelectItem value="1week">Within 1 Week</SelectItem>
              <SelectItem value="2weeks">Within 2 Weeks</SelectItem>
              <SelectItem value="1month">Within 1 Month</SelectItem>
              <SelectItem value="3months">2-3 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Required Field with Validation Anchor */}
        <div className="space-y-2 relative">
          <Label className="text-sm font-medium">Lead Source *</Label>
          <Select
            onValueChange={(v) => onSelectChange("source", v)}
            value={formData.source}
          >
            <SelectTrigger id="source" className="h-10 bg-card border-input">
              <SelectValue placeholder="Lead Source" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              sideOffset={4}
              className="w-[--radix-select-trigger-width]"
            >
              <SelectItem value="google-maps">Google Maps</SelectItem>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
            </SelectContent>
          </Select>
          <input
            tabIndex={-1}
            required
            value={formData.source}
            onChange={() => {}}
            className="absolute inset-x-0 bottom-0 h-0 w-full opacity-0 pointer-events-none"
          />
        </div>

        {/* Required Field with Validation Anchor */}
        <div className="space-y-2 relative">
          <Label className="text-sm font-medium">Lead Status *</Label>
          <Select
            onValueChange={(v) => onSelectChange("status", v)}
            value={formData.status}
          >
            <SelectTrigger id="status" className="h-10 bg-card border-input">
              <SelectValue placeholder="Lead Status" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              sideOffset={4}
              className="w-[--radix-select-trigger-width]"
            >
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="proposal">Proposal Sent</SelectItem>
            </SelectContent>
          </Select>
          <input
            tabIndex={-1}
            required
            value={formData.status}
            onChange={() => {}}
            className="absolute inset-x-0 bottom-0 h-0 w-full opacity-0 pointer-events-none"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Assigned To</Label>
          <Select
            onValueChange={(v) => onSelectChange("assignedTo", v)}
            value={formData.assignedTo}
          >
            <SelectTrigger
              id="assignedTo"
              className="h-10 bg-card border-input"
            >
              <SelectValue placeholder="Assign Lead" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              sideOffset={4}
              className="w-[--radix-select-trigger-width]"
            >
              <SelectItem value="unassigned">Unassigned</SelectItem>
              <SelectItem value="mayank-kansal">Mayank Kansal</SelectItem>
              <SelectItem value="dipish-bisht">Dipish Bisht</SelectItem>
              <SelectItem value="dheeraj-patel">Dheeraj Patel</SelectItem>
              <SelectItem value="vinay-suyal">Vinay Suyal</SelectItem>
              <SelectItem value="ravi-negi">Ravi Negi</SelectItem>
              <SelectItem value="rahul-rana">Rahul Rana</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
