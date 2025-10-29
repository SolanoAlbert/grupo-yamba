//import mongoose and necessary types
import { Schema, model, models, Types } from "mongoose";

// Define the interface for a transmission
export interface ITransmission {
  _id?: string;
  title: string;
  description?: string;
  type: 'radio' | 'video';
  status: 'scheduled' | 'live' | 'finished';
  streamUrl?: string; // Video or radio stream URL
  streamKey?: string; // Stream key (admins only)
  thumbnailUrl?: string; // Thumbnail for the transmission
  administrator: Types.ObjectId; // Who schedules/controls the transmission
  scheduledDate?: Date;
  startDate?: Date;
  endDate?: Date;
  viewersCount: number; // Viewers count
  duration?: number; //  Minutes
  active: boolean;
}

// Define the schema for a transmission
const TransmissionSchema = new Schema<ITransmission>({
  title: { 
    type: String, 
    required: true, 
    trim: true,
    maxlength: 200 
  },
  description: { 
    type: String, 
    trim: true,
    maxlength: 1000 
  },
  type: { 
    type: String, 
    enum: ['radio', 'video'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['scheduled', 'live', 'finished'], 
    default: 'scheduled',
    required: true 
  },
  streamUrl: { type: String },
  streamKey: { type: String }, // Sensitive field
  thumbnailUrl: { type: String },
  administrator: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  scheduledDate: { type: Date },
  startDate: { type: Date },
  endDate: { type: Date },
  viewersCount: { 
    type: Number, 
    default: 0 
  },
  duration: { type: Number }, //  Minutes
  active: { 
    type: Boolean, 
    default: true 
  }
}, {
  timestamps: true
});

// Optimization indexes
TransmissionSchema.index({ status: 1, scheduledDate: 1 });
TransmissionSchema.index({ type: 1, active: 1 });
TransmissionSchema.index({ administrator: 1 });

// Avoid recompiling the model if it already exists
const Transmission = models.Transmission || model<ITransmission>("Transmission", TransmissionSchema);

// Export the model to be used in other parts of the application
export default Transmission;