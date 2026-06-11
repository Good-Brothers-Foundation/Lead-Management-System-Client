"use client";

import { useParams } from "next/navigation";

export default function Tasks() {
  const params = useParams();

  const title =
    params.item === "pending"
      ? "Pending Tasks"
      : params.item === "completed"
      ? "Completed Tasks"
      : "My Tasks";

  return (
    <main className="p-6">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">
            {title}
          </h1>

          <p className="text-muted-foreground">
            Manage and monitor assigned tasks.
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="mb-2 text-lg font-semibold">
            Task List
          </h2>

          <p className="text-muted-foreground">
            No tasks available.
          </p>
        </div>
      </div>
    </main>
  );
}