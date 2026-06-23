import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Task from "@/lib/models/Task";
import Member from "@/lib/models/Member"; // Pre-register Member model for population
import Notification from "@/lib/models/Notification";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;
    const task = await Task.findById(id).populate("assignedTo");

    if (!task) {
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: task });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch task", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    if (body.assignedTo) {
      const memberExists = await Member.findById(body.assignedTo);
      if (!memberExists) {
        return NextResponse.json(
          { success: false, message: "Assigned member does not exist" },
          { status: 400 }
        );
      }
    }

    const originalTask = await Task.findById(id);

    const task = await Task.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).populate("assignedTo");

    if (!task) {
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 }
      );
    }

    if (task && originalTask) {
      const changes: string[] = [];
      if (body.status && body.status !== originalTask.status) {
        changes.push(`status moved to '${body.status}'`);
      }
      if (body.assignedTo && body.assignedTo !== String(originalTask.assignedTo)) {
        const assigneeName = typeof task.assignedTo === "object" && task.assignedTo ? (task.assignedTo as any).name : "Unassigned";
        changes.push(`assigned to ${assigneeName}`);
      }

      if (changes.length > 0) {
        await Notification.create({
          title: "Task Updated 📋",
          message: `Task '${task.title}': ${changes.join(", ")}`,
          type: "task_assigned",
          link: "/team/tasks",
        });
      }
    }
    return NextResponse.json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update task",
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
    const task = await Task.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

    if (!task) {
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete task",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
