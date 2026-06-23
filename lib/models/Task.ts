import mongoose, { Schema, Document, Model } from "mongoose";

export interface TaskDocument extends Document {
  title: string;
  description?: string;
  assignedTo: mongoose.Types.ObjectId;
  status: "backlog" | "pending" | "completed";
  priority: "low" | "medium" | "high";
  dueDate?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<TaskDocument>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "Member", required: true },
    status: { 
      type: String, 
      default: "backlog", 
      enum: ["backlog", "pending", "completed"] 
    },
    priority: { 
      type: String, 
      default: "medium", 
      enum: ["low", "medium", "high"] 
    },
    dueDate: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Task: Model<TaskDocument> =
  mongoose.models.Task || mongoose.model<TaskDocument>("Task", taskSchema);

export default Task;
