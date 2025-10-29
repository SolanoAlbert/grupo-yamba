import { MongoClient, Document as MongoDocument, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('❌ Please add your MongoDB URI to .env');
}

const uri = process.env.MONGODB_URI;
const options = {};

// Extraer nombre de la base de datos del URI
const getDatabaseName = (): string => {
  const match = uri.match(/\.net\/([^?]+)/);
  return match ? match[1] : 'GrupoYamba';
};

const dbName = getDatabaseName();

let client: MongoClient;
let clientPromise: Promise<MongoClient>;
let dbPromise: Promise<Db>;

// Declarar variable global para cacheo en desarrollo
declare global {
  
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  var _mongoDbPromise: Promise<Db> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  // Desarrollo: usar variables globales y garantizar que ambas promesas existan
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  if (!global._mongoDbPromise) {
    // Derivar la promesa de Db a partir del client ya existente
    global._mongoDbPromise = global._mongoClientPromise.then((c) => c.db(dbName));
  }
  // Aserciones no nulas: garantizadas por los guardas anteriores
  clientPromise = global._mongoClientPromise!;
  dbPromise = global._mongoDbPromise!;
  console.log(`✅ MongoDB client ready (development mode) - DB: ${dbName}`);
} else {
  // Producción: crear nueva conexión sin cacheo global
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
  dbPromise = clientPromise.then((c) => c.db(dbName));
  console.log(`✅ MongoDB client created (production mode) - DB: ${dbName}`);
}

// ✅ Exportar clientPromise para uso general
export default clientPromise;

// ✅ NUEVO: Exportar dbPromise para Better Auth
export { dbPromise };

/**
 * Helper to get the database instance
 * Useful for direct operations without Mongoose
 */
export async function getDatabase(customDbName?: string): Promise<Db> {
  const client = await clientPromise;
  return client.db(customDbName || dbName);
}

/**
 * Helper to get a specific collection
 */
export async function getCollection<T extends MongoDocument = MongoDocument>(collectionName: string, customDbName?: string) {
  const db = await getDatabase(customDbName);
  return db.collection<T>(collectionName);
}