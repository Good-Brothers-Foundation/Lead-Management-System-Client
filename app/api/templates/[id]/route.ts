import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Template from "@/lib/models/Template";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const template = await Template.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!template) {
      return NextResponse.json(
        { success: false, message: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Template updated successfully",
      data: template,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update template",
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
    const template = await Template.findByIdAndDelete(id);

    if (!template) {
      return NextResponse.json(
        { success: false, message: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Template deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete template",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
