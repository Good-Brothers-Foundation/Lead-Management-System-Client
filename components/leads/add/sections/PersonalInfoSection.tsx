import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LeadFormData } from "@/lib/types/lead";

interface PersonalInfoProps {
  formData: LeadFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PersonalInfoSection({ formData, onChange }: PersonalInfoProps) {
  return (
    <div className="p-6 border border-border rounded-xl bg-background/50 space-y-6">
      <h3 className="text-md font-semibold tracking-wide uppercase text-muted-foreground/80 border-b border-border pb-2">
        Personal Information
      </h3>
      <div className="grid gap-x-6 gap-y-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm font-medium">Full Name *</Label>
          <Input
            id="fullName"
            name="fullName"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={onChange}
            required
            className="h-10 bg-card border-input focus-visible:ring-1"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
          <Input
            id="phone"
            name="phone"
            placeholder="+91 9876543210"
            value={formData.phone}
            onChange={onChange}
            required
            className="h-10 bg-card border-input focus-visible:ring-1"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="alternatePhone" className="text-sm font-medium">Alternate Phone</Label>
          <Input
            id="alternatePhone"
            name="alternatePhone"
            placeholder="+91 9876543210"
            value={formData.alternatePhone}
            onChange={onChange}
            className="h-10 bg-card border-input focus-visible:ring-1"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={onChange}
            className="h-10 bg-card border-input focus-visible:ring-1"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="company" className="text-sm font-medium">Company Name</Label>
          <Input
            id="company"
            name="company"
            placeholder="ABC Pvt Ltd"
            value={formData.company}
            onChange={onChange}
            className="h-10 bg-card border-input focus-visible:ring-1"
          />
        </div>
      </div>
    </div>
  );
}