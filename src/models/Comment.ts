// import mongoose and its types
import{ Schema, model, models, Types } from "mongoose";

// Defines the comment interface
export interface IComment {
  _id?: string;
  content: string;
  author: Types.ObjectId; // Reference to the user
  news: Types.ObjectId; // Reference to the news
  date: Date;
  active: boolean; // For soft delete by moderation
  edit: boolean;
  editedAt?: Date;
}

// Defines the schema for comments
const CommentSchema = new Schema<IComment>({
  content: { 
    type: String, 
    required: true, 
    trim: true,
    maxlength: 1000 // Max length for a comment
  },
  author: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  news: { 
    type: Schema.Types.ObjectId, 
    ref: 'News', 
    required: true 
  },
  date: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
  edit: { type: Boolean, default: false },
  editedAt: { type: Date }
}, {
  timestamps: true
});

// Optimization indexes
CommentSchema.index({ news: 1, date: -1 }); // To show comments by news
CommentSchema.index({ author: 1 }); // To find comments by a user
CommentSchema.index({ active: 1 }); // To filter active comments

// Avoid recompiling the model if it already exists
const Comment = models.Comment || model<IComment>("Comment", CommentSchema);

// Export the model to be used in other parts of the application
export default Comment;