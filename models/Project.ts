import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  userId: string;       // ✅ must always be a string (matches session.user.id)
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    userId: { type: String, required: true },   // ✅ enforced in DB too
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Project ||
  mongoose.model<IProject>("Project", ProjectSchema);
