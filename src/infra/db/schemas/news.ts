// import mongoose and necessary types
import { Schema, model, models, Types } from "mongoose";

// Defines news interface
export interface INews {
  _id?: string;
  title: string;
  content: string;
  author: Types.ObjectId | string; // Reference to the user or string for compatibility
  date: Date;
  image?: string;
  slug?: string; // Friendly URL
  summary?: string; // Short summary for lists
  active: boolean; // For soft delete
  views: number; // View count
  tags?: string[]; // Categories or tags
  commentsEnabled: boolean; // Control of comments per news
}

// Defines news schema
const NewsSchema = new Schema<INews>({
  title: { 
    type: String, 
    required: true, 
    trim: true,
    maxlength: 200 
  },
  content: { 
    type: String, 
    required: true 
  },
  author: { 
    type: Schema.Types.Mixed, // Allows ObjectId or String for compatibility
    required: true 
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  image: { 
    type: String, 
    default: "" 
  },
  slug: { 
    type: String, 
    unique: true,
    sparse: true // Allows unique null/undefined values
  },
  summary: { 
    type: String, 
    maxlength: 300 
  },
  active: { 
    type: Boolean, 
    default: true 
  },
  views: { 
    type: Number, 
    default: 0 
  },
  tags: [{ 
    type: String, 
    trim: true 
  }],
  commentsEnabled: { 
    type: Boolean, 
    default: true 
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Optimization indexes
NewsSchema.index({ active: 1, date: -1 }); // For listing active news
NewsSchema.index({ slug: 1 }); // For searching by slug
NewsSchema.index({ tags: 1 }); // For searching by tags
NewsSchema.index({ author: 1 }); // For searching by author

// Middleware to automatically generate slug
NewsSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-')
      .substring(0, 100);
  }
  next();
});

// Avoid recompiling the model if it already exists
const News = models.News || model<INews>("News", NewsSchema);

// Export the model to be used in other parts of the application
export default News;
