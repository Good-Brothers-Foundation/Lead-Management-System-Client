import { Button } from "@/components/ui/button";

interface FormActionsProps {
  isSubmitting?: boolean;
}

export default function FormActions({ isSubmitting = false }: FormActionsProps) {
  return (
    <div className="flex justify-end items-center gap-4 pt-4 border-t border-border">
      <Button
        type="button"
        className="h-11 px-6 border font-medium transition-colors rounded-md cursor-pointer"
        style={{
          backgroundColor: "var(--button-secondary)",
          color: "#ffffff",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--button-secondary-hover)")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--button-secondary)")}
      >
        Cancel
      </Button>

      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="h-11 px-6 font-medium text-white shadow-sm transition-colors rounded-md cursor-pointer"
        style={{
          backgroundColor: "var(--button-primary)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--button-primary-hover)")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--button-primary)")}
      >
        {isSubmitting ? "Adding Lead..." : "Add Lead"}
      </Button>
    </div>
  );
}
