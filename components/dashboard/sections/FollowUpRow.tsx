import { Badge } from "@/components/ui/badge";
import { LeadFormData } from "@/lib/types/lead";
import { formatLabel, normalizeStatus } from "@/lib/lead-insights";
import { STATUS_STYLES } from "@/lib/data/dashboard.color";
import { Phone, Calendar, Clock } from "lucide-react";

export function FollowUpRow({ lead }: { lead: LeadFormData }) {
  const status = normalizeStatus(lead.status);

  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/60 py-3 last:border-b-0 hover:bg-muted/30 px-3 -mx-3 rounded-xl transition-all duration-200 group">
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-bold text-foreground group-hover:text-[#fd6102] transition-colors">
            {lead.fullName}
          </p>
          <Badge
            variant="outline"
            className={`capitalize text-[10px] py-0 px-2 font-semibold ${STATUS_STYLES[status] || "bg-muted text-muted-foreground"}`}
          >
            {formatLabel(status)}
          </Badge>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="truncate max-w-[150px] font-medium text-foreground/75">
            {lead.company || "Individual"}
          </span>
          <span className="flex items-center gap-1">
            <Phone className="h-3 w-3 shrink-0" />
            {lead.phone}
          </span>
        </div>
      </div>
      
      <div className="shrink-0 flex flex-col items-end text-xs text-muted-foreground gap-1">
        <div className="flex items-center gap-1 text-foreground font-semibold">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{lead.followUpDate || "No date"}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span>{lead.followUpTime || "Any time"}</span>
        </div>
      </div>
    </div>
  );
}