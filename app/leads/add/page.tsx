import AddLeadForm from "@/components/leads/add/AddLeadForm";

export default function AddLead() {
  return (
    <div className="p-6 space-y-4 w-full">
      <div>
        <h1 className="text-3xl font-bold capitalize tracking-tight">Add New Lead</h1>
        <p className="text-muted-foreground mt-1">Enter lead information below.</p>
      </div>
      <AddLeadForm />
    </div>
  );
}