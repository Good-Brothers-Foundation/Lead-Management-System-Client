import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Template from "@/lib/models/Template";
import { broadcast } from "@/lib/realtime";

export async function GET() {
  try {
    await connectDB();
    let templates = await Template.find().sort({ createdAt: -1 });

    if (templates.length === 0) {
      const defaultTemplates = [
        {
          name: "Website Development (Short)",
          content: encodeURIComponent("Hi {{leadName}},\n\nI noticed your GMB profile and wanted to connect regarding a professional website design/development. Are you available for a quick call?\n\nBest regards,\n{{assignedTo}}")
        },
        {
          name: "Social Media Management",
          content: encodeURIComponent("Hi {{leadName}},\n\nHope you're doing well. I'm reaching out to discuss your social media presence. We can help optimize your channels, design engaging content, and run targeted campaign ads to grow your business online.\n\nWould you be open to a brief call this week to explore how we can help?\n\nBest regards,\n{{assignedTo}}")
        },
        {
          name: "Social Media Management (Short)",
          content: encodeURIComponent("Hi {{leadName}},\n\nHope you're doing well. I wanted to reach out and see if you need help managing or growing your Instagram, Facebook, or GMB profiles to get more inquiries.\n\nAre you available for a quick chat?\n\nBest regards,\n{{assignedTo}}")
        }
      ];
      await Template.insertMany(defaultTemplates);
      templates = await Template.find().sort({ createdAt: -1 });
    }

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

    broadcast("template_created", template);

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
