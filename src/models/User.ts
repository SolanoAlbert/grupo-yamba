// import mongoose y and necessary types
import{ Schema, model, models } from "mongoose";

// Defines user interface
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

// Defines user schema
const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  image: { type: String, default: "" },
  role: { 
    type: String, 
    enum: ['admin', 'user'], 
    default: 'user',
    required: true 
  },
  provider: { 
    type: String, 
    enum: ['google', 'facebook', 'local'], 
    required: true 
  },
  providerId: { type: String }, // OAuth provider ID
  registrationDate: { type: Date, default: Date.now },
  active: { type: Boolean, default: true }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Indexes for optimization
UserSchema.index({ email: 1 });
UserSchema.index({ providerId: 1, provider: 1 });

// Avoid recompiling the model if it already exists
const User = models.User || model<IUser>("User", UserSchema);

// Export the model to be used in other parts of the application
export default User;