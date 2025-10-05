// importa mongoose y los tipos necesarios
import { Schema, model, models, Types } from "mongoose";

// Define la interfaz para el tipo de transmisión
export interface ITransmision {
  _id?: string;
  titulo: string;
  descripcion?: string;
  tipo: 'radio' | 'video';
  estado: 'programada' | 'en_vivo' | 'finalizada';
  streamUrl?: string; // URL del stream para video
  streamKey?: string; // Clave del stream (solo para admins)
  thumbnailUrl?: string; // Miniatura de la transmisión
  administrador: Types.ObjectId; // Quien programa/controla la transmisión
  fechaProgramada?: Date;
  fechaInicio?: Date;
  fechaFin?: Date;
  viewersCount: number; // Contador de espectadores
  duracion?: number; // Duración en minutos
  activa: boolean;
}

// Define el esquema para las transmisiones
const TransmisionSchema = new Schema<ITransmision>({
  titulo: { 
    type: String, 
    required: true, 
    trim: true,
    maxlength: 200 
  },
  descripcion: { 
    type: String, 
    trim: true,
    maxlength: 1000 
  },
  tipo: { 
    type: String, 
    enum: ['radio', 'video'], 
    required: true 
  },
  estado: { 
    type: String, 
    enum: ['programada', 'en_vivo', 'finalizada'], 
    default: 'programada',
    required: true 
  },
  streamUrl: { type: String },
  streamKey: { type: String }, // Campo sensible
  thumbnailUrl: { type: String },
  administrador: { 
    type: Schema.Types.ObjectId, 
    ref: 'Usuario', 
    required: true 
  },
  fechaProgramada: { type: Date },
  fechaInicio: { type: Date },
  fechaFin: { type: Date },
  viewersCount: { 
    type: Number, 
    default: 0 
  },
  duracion: { type: Number }, // En minutos
  activa: { 
    type: Boolean, 
    default: true 
  }
}, {
  timestamps: true
});

// Índices para optimización
TransmisionSchema.index({ estado: 1, fechaProgramada: 1 });
TransmisionSchema.index({ tipo: 1, activa: 1 });
TransmisionSchema.index({ administrador: 1 });

// Evitamos recompilar el modelo si ya existe
const Transmision = models.Transmision || model<ITransmision>("Transmision", TransmisionSchema);

// Exporta el modelo para ser usado en otras partes de la aplicación
export default Transmision;