import { Schema, model, models, Types } from "mongoose";

export interface INews {
  _id?: string;
  title: string;
  content: string;
  author: Types.ObjectId | string;
  date: Date;
  image?: string;
  slug?: string;
  summary?: string;
  active: boolean;
  views: number;
  tags?: string[];
  commentsEnabled: boolean;
}

const NewsSchema = new Schema<INews>({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  content: { type: String, required: true },
  author: { type: Schema.Types.Mixed, required: true },
  date: { type: Date, default: Date.now },
  image: { type: String, default: "" },
  slug: { type: String, unique: true, sparse: true },
  summary: { type: String, maxlength: 300 },
  active: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  tags: [{ type: String, trim: true }],
  commentsEnabled: { type: Boolean, default: true },
}, { timestamps: true });

NewsSchema.index({ active: 1, date: -1 });
NewsSchema.index({ slug: 1 });
NewsSchema.index({ tags: 1 });
NewsSchema.index({ author: 1 });

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

const News = models.News || model<INews>("News", NewsSchema);
export default News;
