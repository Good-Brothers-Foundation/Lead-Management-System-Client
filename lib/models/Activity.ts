import mongoose, { Schema, Document, Model } from "mongoose";

export interface ActivityDocument extends Document {
  leadId: mongoose.Types.ObjectId;
  action: string;
  performedBy: string;
  details?: string;
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new Schema<ActivityDocument>(
  {
    leadId: { type: Schema.Types.ObjectId, ref: "Lead", required: true },
    action: { type: String, required: true, trim: true },
    performedBy: { type: String, required: true, trim: true },
    details: { type: String, trim: true },
  },
  { timestamps: true }
);

const Activity: Model<ActivityDocument> =
  mongoose.models.Activity || mongoose.model<ActivityDocument>("Activity", activitySchema);

export default Activity;
