import { NextRequest, NextResponse } from "next/server";
import { acquireLock, releaseLock, broadcast, getLocks } from "@/lib/realtime";

type RouteParams = {
  params: Promise<{ id: string }>;
};

// POST /api/leads/[id]/lock - Acquire an edit lock on a lead
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { clientId, userEmail } = await req.json();

    if (!clientId || !userEmail) {
      return NextResponse.json(
        { success: false, message: "clientId and userEmail are required" },
        { status: 400 }
      );
    }

    const acquired = acquireLock(id, clientId, userEmail);

    if (acquired) {
      // Broadcast lock event to other active clients
      broadcast("lead_locked", { leadId: id, userEmail });
      return NextResponse.json({ success: true, message: "Lock acquired" });
    } else {
      const activeLocks = getLocks();
      const currentLock = activeLocks.find((l) => l.leadId === id);
      return NextResponse.json(
        {
          success: false,
          message: "Lead is currently locked by another user",
          lockedBy: currentLock?.userEmail || "Another user",
        },
        { status: 423 } // 423 Locked
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to acquire lock", error: String(error) },
      { status: 500 }
    );
  }
}

// DELETE /api/leads/[id]/lock?clientId=... - Release the edit lock on a lead
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("clientId");

    if (!clientId) {
      return NextResponse.json(
        { success: false, message: "clientId is required" },
        { status: 400 }
      );
    }

    const released = releaseLock(id, clientId);
    if (released) {
      broadcast("lead_unlocked", { leadId: id });
    }

    return NextResponse.json({ success: true, message: "Lock released" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to release lock", error: String(error) },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
