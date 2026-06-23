import mongoose, { Schema, Document, Model } from "mongoose";

export interface MemberDocument extends Document {
  name: string;
  email?: string;
  role: string;
  status: "Active" | "Inactive";
  createdAt: Date;
  updatedAt: Date;
}

const memberSchema = new Schema<MemberDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    role: { type: String, default: "Member", trim: true },
    status: { type: String, default: "Active", enum: ["Active", "Inactive"] },
  },
  { timestamps: true }
);

const Member: Model<MemberDocument> =
  mongoose.models.Member || mongoose.model<MemberDocument>("Member", memberSchema);

export default Member;
