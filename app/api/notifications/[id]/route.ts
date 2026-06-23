import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Notification from "@/lib/models/Notification";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;

    if (id === "read-all") {
      await Notification.updateMany({ read: false }, { read: true });
      return NextResponse.json({
        success: true,
        message: "All notifications marked as read",
      });
    }

    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json(
        { success: false, message: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update notification",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
