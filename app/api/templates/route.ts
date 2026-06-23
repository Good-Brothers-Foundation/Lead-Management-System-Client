import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Template from "@/lib/models/Template";

export async function GET() {
  try {
    await connectDB();
    const templates = await Template.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: templates,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch templates",
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
    const template = await Template.create(body);

    return NextResponse.json(
      {
        success: true,
        message: "Template created successfully",
        data: template,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create template",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
