import mongoose, { Schema, Document, Model } from "mongoose";

export interface LeadDocument extends Document {
  fullName: string;
  phone: string;
  source: string;
  status: string;

  alternatePhone?: string;
  email?: string;
  company?: string;
  service?: string;
  budget?: string;
  timeline?: string;
  assignedTo?: string;
  followUpDate?: string;
  followUpTime?: string;
  priority?: string;
  contactMethod?: string;
  requirements?: string;
  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}

const leadSchema: Schema<LeadDocument> = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    source: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      required: false,
      trim: true,
    },

    alternatePhone: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    company: {
      type: String,
      trim: true,
    },

    service: {
      type: String,
      trim: true,
    },

    budget: {
      type: String,
      trim: true,
    },

    timeline: {
      type: String,
      trim: true,
    },

    assignedTo: {
      type: String,
      trim: true,
    },

    followUpDate: {
      type: String,
    },

    followUpTime: {
      type: String,
    },

    priority: {
      type: String,
      trim: true,
    },

    contactMethod: {
      type: String,
      trim: true,
    },

    requirements: {
      type: String,
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Lead: Model<LeadDocument> =
  mongoose.models.Lead || mongoose.model<LeadDocument>("Lead", leadSchema);

export default Lead;
