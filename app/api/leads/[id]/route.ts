import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lead from "@/lib/models/Lead";
import Activity from "@/lib/models/Activity";
import Notification from "@/lib/models/Notification";
import { broadcast } from "@/lib/realtime";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;
    const lead = await Lead.findById(id);

    if (!lead) {
      return NextResponse.json(
        { success: false, message: "Lead not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: lead });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch lead", error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const originalLead = await Lead.findById(id);
    if (!originalLead) {
      return NextResponse.json(
        { success: false, message: "Lead not found" },
        { status: 404 },
      );
    }

    const lead = await Lead.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!lead) {
      return NextResponse.json(
        { success: false, message: "Lead not found" },
        { status: 404 },
      );
    }

    // Determine what was updated
    const changes: string[] = [];
    if (body.status && body.status !== originalLead.status) {
      changes.push(`status changed from '${originalLead.status}' to '${body.status}'`);
    }
    if (body.assignedTo && body.assignedTo !== originalLead.assignedTo) {
      changes.push(`assigned owner changed from '${originalLead.assignedTo || "Unassigned"}' to '${body.assignedTo}'`);
    }
    if (body.service && body.service !== originalLead.service) {
      changes.push(`service interested changed from '${originalLead.service}' to '${body.service}'`);
    }
    if (body.followUpDate && body.followUpDate !== originalLead.followUpDate) {
      changes.push(`follow up scheduled for ${body.followUpDate}`);
    }

    const details = changes.length > 0 ? changes.join(", ") : "Lead details updated";

    // Log Lead Activity
    await Activity.create({
      leadId: lead._id,
      action: "Lead Updated",
      performedBy: body.assignedTo || lead.assignedTo || "System / Admin",
      details,
    });

    // Log System Notification on major changes
    if (changes.length > 0) {
      const notification = await Notification.create({
        title: "Lead Updated 📝",
        message: `${lead.fullName}: ${details}`,
        type: "lead_status_changed",
        link: "/leads/all",
      });
      broadcast("notification_created", notification);
    }

    // Broadcast lead update in real-time
    broadcast("lead_updated", lead);

    return NextResponse.json({
      success: true,
      message: "Lead updated successfully",
      data: lead,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update lead",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;
    const lead = await Lead.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!lead) {
      return NextResponse.json(
        { success: false, message: "Lead not found" },
        { status: 404 },
      );
    }

    // Create system notification for lead deletion
    const notification = await Notification.create({
      title: "Lead Removed ❌",
      message: `Lead ${lead.fullName} has been deleted from the pipeline`,
      type: "lead_status_changed",
      link: "/leads/all",
    });
    broadcast("notification_created", notification);

    // Broadcast lead deletion in real-time
    broadcast("lead_deleted", { id });

    return NextResponse.json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete lead",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
