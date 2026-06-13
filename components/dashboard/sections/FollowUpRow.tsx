import { Badge } from "@/components/ui/badge";
import { LeadFormData } from "@/lib/types/lead";
import { formatLabel, normalizeStatus } from "@/lib/lead-insights";
import { STATUS_STYLES } from "@/lib/data/dashboard.color";

export function FollowUpRow({ lead }: { lead: LeadFormData }) {
  const status = normalizeStatus(lead.status);

  return (
    <div className="flex items-center justify-between gap-4 border-b border-border px-1 py-3 last:border-b-0">
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-semibold text-foreground">
            {lead.fullName}
          </p>
          <Badge
            variant="outline"
            className={`capitalize ${STATUS_STYLES[status] || "bg-muted text-muted-foreground"}`}
          >
            {formatLabel(status)}
          </Badge>
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {lead.company || "Individual Account"} - {lead.phone}
        </p>
      </div>
      <div className="shrink-0 text-right text-xs text-muted-foreground">
        <p className="font-semibold text-foreground">{lead.followUpDate || "No date"}</p>
        <p>{lead.followUpTime || "Any time"}</p>
      </div>
    </div>
  );
}