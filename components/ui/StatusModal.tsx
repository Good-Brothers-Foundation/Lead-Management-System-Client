"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "success" | "error";
  title?: string;
  description?: string;
}

export default function StatusModal({
  isOpen,
  onClose,
  type,
  title,
  description,
}: StatusModalProps) {
  const isSuccess = type === "success";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-sm translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-card p-6 shadow-lg duration-200 sm:rounded-lg">
        <DialogHeader className="flex flex-col items-center justify-center text-center space-y-3">
          
          {/* Status Icon Wrapper */}
          <div className="p-1 rounded-full">
            {isSuccess ? (
              <CheckCircle2 className="h-16 w-16 text-success" style={{ color: "var(--success)" }} />
            ) : (
              <XCircle className="h-16 w-16 text-error" style={{ color: "var(--error)" }} />
            )}
          </div>

          {/* Context Titles */}
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            {title || (isSuccess ? "Lead Added Successfully" : "Action Failed")}
          </DialogTitle>
          
          <DialogDescription className="text-sm text-muted-foreground">
            {description || (isSuccess ? "The new lead profile has been safely logged into the database engine workspace." : "Something went wrong while processing your request. Please check fields and try again.")}
          </DialogDescription>
        </DialogHeader>

        {/* Operational Central Action Trigger */}
        <div className="mt-2 flex justify-center">
          <Button
            onClick={onClose}
            className="w-full h-10 font-medium text-white transition-colors rounded-md cursor-pointer"
            style={{
              backgroundColor: isSuccess ? "var(--button-secondary)" : "var(--button-primary)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isSuccess ? "var(--button-secondary-hover)" : "var(--button-primary-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isSuccess ? "var(--button-secondary)" : "var(--button-primary)")}
          >
            {isSuccess ? "Dismiss Window" : "Try Again"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}