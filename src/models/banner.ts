// importa mongoose y los tipos necesarios
import mongoose, { Schema, model, models } from "mongoose";

// Define la interfaz para el tipo de banner
export interface IBanner {
  _id?: string;
  titulo: string;
  imagen: string; // URL de Cloudinary
  enlace?: string; // URL opcional para redirección
  tipo: 'horizontal' | 'vertical';
  posicion: 'header' | 'sidebar' | 'footer' | 'contenido';
  activo: boolean;
  fechaInicio?: Date;
  fechaFin?: Date;
  orden: number; // Para ordenar múltiples banners
  clicks: number; // Contador de clicks para estadísticas
}

// Define el esquema para los banners
const BannerSchema = new Schema<IBanner>({
  titulo: { 
    type: String, 
    required: true, 
    trim: true,
    maxlength: 100 
  },
  imagen: { 
    type: String, 
    required: true 
  },
  enlace: { 
    type: String, 
    trim: true 
  },
  tipo: { 
    type: String, 
    enum: ['horizontal', 'vertical'], 
    required: true 
  },
  posicion: { 
    type: String, 
    enum: ['header', 'sidebar', 'footer', 'contenido'], 
    required: true,
    default: 'sidebar'
  },
  activo: { 
    type: Boolean, 
    default: true 
  },
  fechaInicio: { type: Date },
  fechaFin: { type: Date },
  orden: { 
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

// Índices para optimización
BannerSchema.index({ activo: 1, posicion: 1, orden: 1 });
BannerSchema.index({ fechaInicio: 1, fechaFin: 1 });

// Evitamos recompilar el modelo si ya existe
const Banner = models.Banner || model<IBanner>("Banner", BannerSchema);

// Exporta el modelo para ser usado en otras partes de la aplicación
export default Banner;