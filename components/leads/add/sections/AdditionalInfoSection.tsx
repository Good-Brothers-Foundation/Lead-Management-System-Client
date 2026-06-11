import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LeadFormData } from "@/lib/types/lead";

interface AdditionalInfoProps {
  formData: LeadFormData;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function AdditionalInfoSection({ formData, onChange }: AdditionalInfoProps) {
  return (
    <div className="p-6 border border-border rounded-xl bg-background/50 space-y-6">
      <h3 className="text-md font-semibold tracking-wide uppercase text-muted-foreground/80 border-b border-border pb-2">
        Additional Information
      </h3>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="requirements" className="text-sm font-medium">Project Requirements</Label>
          <Textarea
            id="requirements"
            name="requirements"
            rows={4}
            placeholder="Describe project requirements..."
            value={formData.requirements}
            onChange={onChange}
            className="bg-card border-input resize-none focus-visible:ring-1"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes" className="text-sm font-medium">Additional Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            rows={4}
            placeholder="Additional notes..."
            value={formData.notes}
            onChange={onChange}
            className="bg-card border-input resize-none focus-visible:ring-1"
          />
        </div>
      </div>
    </div>
  );
}