import { Schema, model, models, Types } from "mongoose";

export interface IComment {
  _id?: string;
  content: string;
  author: Types.ObjectId;
  news: Types.ObjectId;
  date: Date;
  active: boolean;
  edit: boolean;
  editedAt?: Date;
}

const CommentSchema = new Schema<IComment>({
  content: { type: String, required: true, trim: true, maxlength: 1000 },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  news: { type: Schema.Types.ObjectId, ref: 'News', required: true },
  date: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
  edit: { type: Boolean, default: false },
  editedAt: { type: Date },
}, { timestamps: true });

CommentSchema.index({ news: 1, date: -1 });
CommentSchema.index({ author: 1 });
CommentSchema.index({ active: 1 });

const Comment = models.Comment || model<IComment>("Comment", CommentSchema);
export default Comment;
