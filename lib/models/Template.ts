import mongoose, { Schema, Document, Model } from "mongoose";

export interface TemplateDocument extends Document {
  name: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const templateSchema = new Schema<TemplateDocument>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    content: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const Template: Model<TemplateDocument> =
  mongoose.models.Template || mongoose.model<TemplateDocument>("Template", templateSchema);

export default Template;
