import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Task from "@/lib/models/Task";
import Member from "@/lib/models/Member"; // Pre-register Member model for population
import Notification from "@/lib/models/Notification";
import { broadcast } from "@/lib/realtime";

export async function GET() {
  try {
    await connectDB();
    const tasks = await Task.find().populate("assignedTo").sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch team tasks",
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
    
    // Validate if member exists
    const memberExists = await Member.findById(body.assignedTo);
    if (!memberExists) {
      return NextResponse.json(
        { success: false, message: "Assigned member does not exist" },
        { status: 400 }
      );
    }

    const task = await Task.create(body);
    const populatedTask = await Task.findById(task._id).populate("assignedTo");

    // Push system notification for task creation
    if (populatedTask) {
      const assigneeName = typeof populatedTask.assignedTo === "object" && populatedTask.assignedTo ? (populatedTask.assignedTo as any).name : "Unassigned";
      const notification = await Notification.create({
        title: "Task Assigned 📋",
        message: `Task '${populatedTask.title}' assigned to ${assigneeName}`,
        type: "task_assigned",
        link: "/team/tasks",
      });
      
      // Broadcast events
      broadcast("task_created", populatedTask);
      if (notification) {
        broadcast("notification_created", notification);
      }
    }

    return NextResponse.json(
      { success: true, message: "Task created successfully", data: populatedTask },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create task",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
