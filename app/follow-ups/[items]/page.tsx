"use client";

import { useParams } from "next/navigation";

export default function FollowUps() {
  const params = useParams();
  console.log("FollowUps Params:", params);

  return (
    <main className="p-6">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold capitalize">
            {params?.items} Follow Ups
          </h1>

          <p className="text-muted-foreground">
            Manage and track follow-up activities.
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="mb-2 text-lg font-semibold">
            Follow Up List
          </h2>

          <p className="text-muted-foreground">
            No follow-up records available.
          </p>
        </div>
      </div>
    </main>
  );
}