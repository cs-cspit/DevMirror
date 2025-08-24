import mongoose, { Schema, Document } from "mongoose";

export interface IFile extends Document {
  userId: string;       // ✅ owner of the file
  projectId?: string;   // optional: if file belongs to a project
  name: string;
  path: string;
  size?: number;
  createdAt: Date;
  updatedAt: Date;
}

const FileSchema = new Schema<IFile>(
  {
    userId: { type: String, required: true },    // ✅ link to User
    projectId: { type: String },                 // link to Project (optional)
    name: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.models.File ||
  mongoose.model<IFile>("File", FileSchema);
