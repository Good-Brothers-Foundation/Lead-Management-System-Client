import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Member from "@/lib/models/Member";

export async function GET() {
  try {
    await connectDB();
    const members = await Member.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: members.length,
      data: members,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch members",
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
    const member = await Member.create(body);

    return NextResponse.json(
      { success: true, message: "Member added successfully", data: member },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add member",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
