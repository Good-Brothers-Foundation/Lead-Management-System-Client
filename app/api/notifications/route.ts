import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Notification from "@/lib/models/Notification";

export async function GET() {
  try {
    await connectDB();
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch notifications",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const notification = await Notification.create(body);

    return NextResponse.json(
      {
        success: true,
        message: "Notification created successfully",
        data: notification,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create notification",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
