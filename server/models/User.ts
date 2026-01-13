import mongoose, { Schema, Document } from 'mongoose';

export type Role = 'owner' | 'admin' | 'editor';

export interface UserDocument extends Document {
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['owner', 'admin', 'editor'], required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

export const UserModel = mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema);
