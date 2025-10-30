import { Schema, model, models } from "mongoose";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  image?: string;
  role: 'admin' | 'user';
  provider: 'google' | 'facebook';
  providerId?: string;
  registrationDate: Date;
  active: boolean;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  image: { type: String, default: "" },
  role: { type: String, enum: ['admin', 'user'], default: 'user', required: true },
  provider: { type: String, enum: ['google', 'facebook', 'local'], required: true },
  providerId: { type: String },
  registrationDate: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
}, { timestamps: true });

UserSchema.index({ email: 1 });
UserSchema.index({ providerId: 1, provider: 1 });

const User = models.User || model<IUser>("User", UserSchema);
export default User;
