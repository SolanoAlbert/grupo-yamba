// imports mongoose and necessary types
import  { Schema, model, models } from "mongoose";

// Define the interface for the banner type
export interface IBanner {
  _id?: string;
  title?: string;
  image: string; // Cloudinary URL
  link?: string; // Optional link
  type: 'horizontal' | 'vertical';
  position: 'header' | 'sidebar' | 'footer' | 'content';
  active: boolean;
  startDate?: Date;
  endDate?: Date;
  order: number; // Order of display
  clicks: number; // Click count for statistics
}

// Define the schema for banners
const BannerSchema = new Schema<IBanner>({
  title: { 
    type: String, 
    required: true, 
    trim: true,
    maxlength: 100 
  },
  image: { 
    type: String, 
    required: true 
  },
  link: { 
    type: String, 
    trim: true 
  },
  type: { 
    type: String, 
    enum: ['horizontal', 'vertical'], 
    required: true 
  },
  position: { 
    type: String, 
    enum: ['header', 'sidebar', 'footer', 'content'], 
    required: true,
    default: 'sidebar'
  },
  active: { 
    type: Boolean, 
    default: true 
  },
  startDate: { type: Date },
  endDate: { type: Date },
  order: { 
    type: Number, 
    default: 0 
  },
  clicks: { 
    type: Number, 
    default: 0 
  }
}, {
  timestamps: true
});

// Optimization indexes
BannerSchema.index({ active: 1, position: 1, order: 1 });
BannerSchema.index({ startDate: 1, endDate: 1 });

// Avoid recompiling the model if it already exists
const Banner = models.Banner || model<IBanner>("Banner", BannerSchema);

// Export the model to be used in other parts of the application
export default Banner;