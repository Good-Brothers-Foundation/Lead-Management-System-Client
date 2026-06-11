import AllLeadsTable from "@/components/leads/all/AllLeadsTable";

export default function AllLeadsPage() {
  return (
    <div className="p-6 space-y-6 w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">All Leads</h1>
        <p className="text-muted-foreground mt-1">
          Monitor incoming customer records, change state parameters, and run routing checks.
        </p>
      </div>

      <AllLeadsTable />
    </div>
  );
}