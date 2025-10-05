// importa mongoose y los tipos necesarios
import { Schema, model, models, Types } from "mongoose";

// Define la interfaz para el tipo de noticia
export interface INoticia {
  _id?: string;
  titulo: string;
  contenido: string;
  autor: Types.ObjectId | string; // Referencia al usuario admin o string para compatibilidad
  fecha: Date;
  imagen?: string;
  slug?: string; // Para URLs amigables
  resumen?: string; // Resumen corto para listas
  activa: boolean; // Para borrado suave
  vistas: number; // Contador de visualizaciones
  tags?: string[]; // Etiquetas para categorización
  comentariosHabilitados: boolean; // Control de comentarios por noticia
}

// Define el esquema para las noticias
const NoticiaSchema = new Schema<INoticia>({
  titulo: { 
    type: String, 
    required: true, 
    trim: true,
    maxlength: 200 
  },
  contenido: { 
    type: String, 
    required: true 
  },
  autor: { 
    type: Schema.Types.Mixed, // Permite ObjectId o String para compatibilidad
    required: true 
  },
  fecha: { 
    type: Date, 
    default: Date.now 
  },
  imagen: { 
    type: String, 
    default: "" 
  },
  slug: { 
    type: String, 
    unique: true,
    sparse: true // Permite valores null/undefined únicos
  },
  resumen: { 
    type: String, 
    maxlength: 300 
  },
  activa: { 
    type: Boolean, 
    default: true 
  },
  vistas: { 
    type: Number, 
    default: 0 
  },
  tags: [{ 
    type: String, 
    trim: true 
  }],
  comentariosHabilitados: { 
    type: Boolean, 
    default: true 
  }
}, {
  timestamps: true // Agrega createdAt y updatedAt
});

// Índices para optimización
NoticiaSchema.index({ activa: 1, fecha: -1 }); // Para listar noticias activas
NoticiaSchema.index({ slug: 1 }); // Para búsqueda por slug
NoticiaSchema.index({ tags: 1 }); // Para búsqueda por etiquetas
NoticiaSchema.index({ autor: 1 }); // Para buscar por autor

// Middleware para generar slug automáticamente
NoticiaSchema.pre('save', function(next) {
  if (this.isModified('titulo') && !this.slug) {
    this.slug = this.titulo
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-')
      .substring(0, 100);
  }
  next();
});

// Evitamos recompilar el modelo si ya existe
const Noticia = models.Noticia || model<INoticia>("Noticia", NoticiaSchema);

// Exporta el modelo para ser usado en otras partes de la aplicación
export default Noticia;
