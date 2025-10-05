// importa mongoose y los tipos necesarios
import mongoose, { Schema, model, models } from "mongoose";

// Define la interfaz para el tipo de usuario
export interface IUsuario {
  _id?: string;
  nombre: string;
  email: string;
  imagen?: string;
  rol: 'admin' | 'usuario';
  proveedor: 'google' | 'facebook' | 'local';
  providerId?: string;
  fechaRegistro: Date;
  activo: boolean;
}

// Define el esquema para los usuarios
const UsuarioSchema = new Schema<IUsuario>({
  nombre: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  imagen: { type: String, default: "" },
  rol: { 
    type: String, 
    enum: ['admin', 'usuario'], 
    default: 'usuario',
    required: true 
  },
  proveedor: { 
    type: String, 
    enum: ['google', 'facebook', 'local'], 
    required: true 
  },
  providerId: { type: String }, // ID del proveedor OAuth
  fechaRegistro: { type: Date, default: Date.now },
  activo: { type: Boolean, default: true }
}, {
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});

// Índices para optimización
UsuarioSchema.index({ email: 1 });
UsuarioSchema.index({ providerId: 1, proveedor: 1 });

// Evitamos recompilar el modelo si ya existe
const Usuario = models.Usuario || model<IUsuario>("Usuario", UsuarioSchema);

// Exporta el modelo para ser usado en otras partes de la aplicación
export default Usuario;