import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Activity from "@/lib/models/Activity";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;
    const activities = await Activity.find({ leadId: id }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: activities,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch activities",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;
    const { action, performedBy, details } = await req.json();

    if (!action || !performedBy) {
      return NextResponse.json(
        { success: false, message: "Action and performedBy are required" },
        { status: 400 }
      );
    }

    const activity = await Activity.create({
      leadId: id,
      action,
      performedBy,
      details,
    });

    return NextResponse.json({
      success: true,
      message: "Activity logged successfully",
      data: activity,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to log activity",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
