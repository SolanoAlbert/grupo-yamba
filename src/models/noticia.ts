// importa mongoose y los tipos necesarios
import mongoose, { Schema, model, models } from "mongoose";

// Define el esquema para las noticias
const NoticiaSchema = new Schema({
  titulo: { type: String, required: true },
  contenido: { type: String, required: true },
  autor: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  imagen: { type: String, default: "" }, // Campo opcional para la imagen
});

// Evitamos recompilar el modelo si ya existe
const Noticia = models.Noticia || model("Noticia", NoticiaSchema);

// Exporta el modelo para ser usado en otras partes de la aplicación
export default Noticia;
