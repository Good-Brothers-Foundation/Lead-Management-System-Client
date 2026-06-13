import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lead from "@/lib/models/Lead";

export async function GET() {
  try {
    await connectDB();
    const leads = await Lead.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error: any) {
    console.error("Failed to fetch leads:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch leads",
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const lead = await Lead.create(body);

    return NextResponse.json(
      {
        success: true,
        message: "Lead created successfully",
        data: lead,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Failed to create lead:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create lead",
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}
