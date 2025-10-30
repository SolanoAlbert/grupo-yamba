import { Schema, model, models, Types } from "mongoose";

export interface ITransmission {
  _id?: string;
  title: string;
  description?: string;
  type: 'radio' | 'video';
  status: 'scheduled' | 'live' | 'finished';
  streamUrl?: string;
  streamKey?: string;
  thumbnailUrl?: string;
  administrator: Types.ObjectId;
  scheduledDate?: Date;
  startDate?: Date;
  endDate?: Date;
  viewersCount: number;
  duration?: number;
  active: boolean;
}

const TransmissionSchema = new Schema<ITransmission>({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, trim: true, maxlength: 1000 },
  type: { type: String, enum: ['radio', 'video'], required: true },
  status: { type: String, enum: ['scheduled', 'live', 'finished'], default: 'scheduled', required: true },
  streamUrl: { type: String },
  streamKey: { type: String },
  thumbnailUrl: { type: String },
  administrator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  scheduledDate: { type: Date },
  startDate: { type: Date },
  endDate: { type: Date },
  viewersCount: { type: Number, default: 0 },
  duration: { type: Number },
  active: { type: Boolean, default: true },
}, { timestamps: true });

TransmissionSchema.index({ status: 1, scheduledDate: 1 });
TransmissionSchema.index({ type: 1, active: 1 });
TransmissionSchema.index({ administrator: 1 });

const Transmission = models.Transmission || model<ITransmission>("Transmission", TransmissionSchema);
export default Transmission;
