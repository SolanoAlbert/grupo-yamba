// importa mongoose y los tipos necesarios
import mongoose, { Schema, model, models, Types } from "mongoose";

// Define la interfaz para el tipo de comentario
export interface IComentario {
  _id?: string;
  contenido: string;
  autor: Types.ObjectId; // Referencia al usuario
  noticia: Types.ObjectId; // Referencia a la noticia
  fecha: Date;
  activo: boolean; // Para soft delete por moderación
  editado: boolean;
  fechaEdicion?: Date;
}

// Define el esquema para los comentarios
const ComentarioSchema = new Schema<IComentario>({
  contenido: { 
    type: String, 
    required: true, 
    trim: true,
    maxlength: 1000 // Límite de caracteres
  },
  autor: { 
    type: Schema.Types.ObjectId, 
    ref: 'Usuario', 
    required: true 
  },
  noticia: { 
    type: Schema.Types.ObjectId, 
    ref: 'Noticia', 
    required: true 
  },
  fecha: { type: Date, default: Date.now },
  activo: { type: Boolean, default: true },
  editado: { type: Boolean, default: false },
  fechaEdicion: { type: Date }
}, {
  timestamps: true
});

// Índices para optimización
ComentarioSchema.index({ noticia: 1, fecha: -1 }); // Para mostrar comentarios por noticia
ComentarioSchema.index({ autor: 1 }); // Para buscar comentarios de un usuario
ComentarioSchema.index({ activo: 1 }); // Para filtrar comentarios activos

// Evitamos recompilar el modelo si ya existe
const Comentario = models.Comentario || model<IComentario>("Comentario", ComentarioSchema);

// Exporta el modelo para ser usado en otras partes de la aplicación
export default Comentario;