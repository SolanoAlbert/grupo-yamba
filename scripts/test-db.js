// Script para probar la conexión a MongoDB y crear datos de prueba
import dbConnect from '../src/lib/mongodb';
import Usuario from '../src/models/usuario';
import Noticia from '../src/models/noticia';

async function testConnection() {
  try {
    await dbConnect();
    console.log('✅ Conexión a MongoDB exitosa');
    
    // Crear usuario admin de prueba
    const adminUser = new Usuario({
      nombre: 'Administrador',
      email: 'admin@grupoyamba.com',
      rol: 'admin',
      proveedor: 'local'
    });
    
    // await adminUser.save();
    console.log('✅ Modelos listos para usar');
    
  } catch (error) {
    console.error('❌ Error de conexión:', error);
  }
}

testConnection();