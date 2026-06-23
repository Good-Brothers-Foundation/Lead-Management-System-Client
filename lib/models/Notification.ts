import mongoose, { Schema, Document, Model } from "mongoose";

export interface NotificationDocument extends Document {
  title: string;
  message: string;
  type: string;
  read: boolean;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<NotificationDocument>(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: { type: String, required: true },
    read: { type: Boolean, default: false },
    link: { type: String },
  },
  { timestamps: true }
);

const Notification: Model<NotificationDocument> =
  mongoose.models.Notification || mongoose.model<NotificationDocument>("Notification", notificationSchema);

export default Notification;
