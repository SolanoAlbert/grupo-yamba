// Importa mongoose para manejar la conexión con MongoDB
import mongoose from "mongoose";

// Define una interfaz que describe la estructura del caché
interface MongooseCache {
  conn: typeof mongoose | null;    // Almacena la conexión
  promise: Promise<typeof mongoose> | null;  // Almacena la promesa de conexión
}

// Extiende el objeto global para incluir la variable mongoose
declare global {
  var mongoose: MongooseCache | undefined;
}

// Verifica que existe la variable de entorno MONGODB_URI
if (!process.env.MONGODB_URI) {
  throw new Error("❌ Debes definir MONGODB_URI en tu archivo .env.local");
}

// Obtiene el caché existente del objeto global
let cached = global.mongoose;

// Si no existe el caché, inicializa uno nuevo
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Función asíncrona para conectar a la base de datos
async function dbConnect() {
  // Si ya existe una conexión, la retorna
  if (cached!.conn) {
    return cached!.conn;
  }

  // Si no hay una promesa de conexión pendiente, crea una nueva
  if (!cached!.promise) {
    cached!.promise = mongoose.connect(process.env.MONGODB_URI as string);
  }

  // Espera a que se resuelva la promesa y guarda la conexión
  cached!.conn = await cached!.promise;
  // Retorna la conexión
  return cached!.conn;
}

// Exporta la función para ser usada en otros archivos
export default dbConnect;