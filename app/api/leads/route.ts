import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lead from "@/lib/models/Lead";
import Activity from "@/lib/models/Activity";
import Notification from "@/lib/models/Notification";

export async function GET() {
  try {
    await connectDB();
    const leads = await Lead.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch leads",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const lead = await Lead.create(body);

    // Create lead activity audit log
    await Activity.create({
      leadId: lead._id,
      action: "Lead Created",
      performedBy: lead.assignedTo || "System / Admin",
      details: `Lead created for ${lead.fullName} requesting service: ${lead.service || "unspecified"}`,
    });

    // Create system notification
    await Notification.create({
      title: "New Lead Added 👤",
      message: `${lead.fullName} has been added to the pipeline for ${lead.service || "unspecified"}`,
      type: "lead_created",
      link: "/leads/all",
    });

    return NextResponse.json(
      { success: true, message: "Lead created successfully", data: lead },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create lead",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
