"use client";

import { useParams } from "next/navigation";

export default function Leads() {
  const params = useParams();

  const title =
    params.item === "new"
      ? "New Leads"
      : params.item === "qualified"
      ? "Qualified Leads"
      : "All Leads";

  return (
    <main className="p-6">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">
            {title}
          </h1>

          <p className="text-muted-foreground">
            Manage and track lead information.
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="mb-2 text-lg font-semibold">
            Lead List
          </h2>

          <p className="text-muted-foreground">
            No leads available.
          </p>
        </div>
      </div>
    </main>
  );
}