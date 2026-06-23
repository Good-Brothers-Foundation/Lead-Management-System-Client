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
