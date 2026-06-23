import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Member from "@/lib/models/Member";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;
    const member = await Member.findById(id);

    if (!member) {
      return NextResponse.json(
        { success: false, message: "Member not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: member });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch member", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const member = await Member.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!member) {
      return NextResponse.json(
        { success: false, message: "Member not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "Member updated successfully",
      data: member,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update member",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;
    const member = await Member.findByIdAndDelete(id);

    if (!member) {
      return NextResponse.json(
        { success: false, message: "Member not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "Member deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete member",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
