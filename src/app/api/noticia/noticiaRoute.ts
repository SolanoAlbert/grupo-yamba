import cloudinary from "@/lib/cloudinary";  // Importa la librería de Cloudinary
import { NextResponse } from "next/server"; // Importa utilidades para responder en rutas Next.js
import dbConnect from "@/lib/mongodb";      // Importa la función para conectar a MongoDB
import Noticia from "@/models/noticia";     // Importa el modelo de noticias



// Función para asegurar el prefijo base64 en las imágenes
function asegurarPrefijoBase64(base64:string, tipoMime="image/jpeg") {
  if(!base64) return "";
  if(base64.startsWith("data")) return base64; // Si ya tiene el prefijo, lo devuelve tal cual
  return `data:${tipoMime};base64,${base64}`; // Si no, añade el prefijo adecuado
}




// Maneja las solicitudes GET a /api/noticias
export async function GET() {
try{
  await dbConnect();                        // Asegura la conexión a la base de datos
  const noticia = await Noticia.find({});  // Obtiene todas las noticias
  return NextResponse.json(noticia);       // Devuelve las noticias en formato JSON

} catch (error) {
  console.error(error); // Imprime el error en la consola
  return NextResponse.json({ error: "Error al obtener las noticias" }, { status: 500 }); // Devuelve un error si algo falla 
}
}





// Maneja las solicitudes POST a /api/noticias
export async function POST(req: Request) {
try {
  await dbConnect();                        // Asegura la conexión a la base de datos
  const body = await req.json();            // Obtiene el cuerpo de la solicitud (datos enviados)

  let imagenUrl = "";                       // Inicializa la variable para la URL de la imagen

// Solo sube la imagen a Cloudinary si existe en el body
  if(body.imagen){
    const imagenBase64 = asegurarPrefijoBase64(body.imagen); // Asegura que la imagen tenga el prefijo base64
    const subirResultado= await cloudinary.uploader.upload(imagenBase64); // Sube la imagen a Cloudinary
    if(!subirResultado.secure_url){                                      // Si no se obtiene una URL segura, lanza un error
      throw new Error("Error al subir la imagen a Cloudinary");
    }
    imagenUrl = subirResultado.secure_url;    // Obtiene la URL segura de la imagen subida

  }
  
  // Crea una nueva noticia con los datos recibidos
  const nuevaNoticia = await Noticia.create({
    titulo: body.titulo,
    contenido: body.contenido,
    autor: body.autor,
    imagen: imagenUrl, // Guarda la URL segura de la imagen subida
  });
  return NextResponse.json(nuevaNoticia);   // Devuelve la noticia creada en formato JSON
} catch (error) {
  console.error(error); // Imprime el error en la consola
  return NextResponse.json({ error: "Error al crear la noticia" }, { status: 500 }); // Devuelve un error si algo falla
}
}





// Maneja las solicitudes DELETE a /api/noticias
export async function DELETE(req: Request) {
  try {
    await dbConnect();                        // Asegura la conexión a la base de datos
    const { id } = await req.json();          // Obtiene el ID de la noticia a eliminar

    // Elimina la noticia con el ID proporcionado
    const resultado = await Noticia.findByIdAndDelete(id);
    if (!resultado) {
      return NextResponse.json({ error: "Noticia no encontrada" }, { status: 404 }); // Devuelve un error si no se encuentra la noticia
    }
    return NextResponse.json({ message: "Noticia eliminada" }); // Devuelve un mensaje de éxito
  } catch (error) {
    console.error(error); // Imprime el error en la consola
    return NextResponse.json({ error: "Error al eliminar la noticia" }, { status: 500 }); // Devuelve un error si algo falla
  }   
}




// Maneja las solicitudes UPDATE a /api/noticias

export async function UPDATE(req: Request) {
  try {
    await dbConnect();                        // Asegura la conexión a la base de datos
    const body = await req.json();            // Obtiene el cuerpo de la solicitud (datos enviados)
    const { id, titulo, contenido, autor,imagen } = body; // Desestructura los datos necesarios

    let imagenUrl = "";                       // Inicializa la variable para la URL de la imagen


    //Sube la imagen a Cloudinary si existe
    if(imagen){
      const imagenBase64 = asegurarPrefijoBase64(imagen); // Asegura que la imagen tenga el prefijo base64
      const subirResultado=await cloudinary.uploader.upload(imagenBase64);  // Sube la imagen a Cloudinary
      if(!subirResultado.secure_url){                                      // Si no se obtiene una URL segura, lanza un error
        throw new Error("Error al subir la imagen a Cloudinary");
      }
      imagenUrl = subirResultado.secure_url;    // Obtiene la URL segura de la imagen subida
    }

    // Prepara los campos a actualizar
    const actualizarCampos:{
      titulo?: string;
      contenido?: string;
      autor?: string;
      imagen?: string;
    }={titulo,contenido,autor};

    if(imagenUrl){
      actualizarCampos.imagen=imagenUrl;
    }

    // Actualiza la noticia con los nuevos datos
    const noticiaActualizada= await Noticia.findByIdAndUpdate(id,actualizarCampos,{new:true});
    if (!noticiaActualizada) {
      return NextResponse.json({ error: "Noticia no encontrada" }, { status: 404 }); // Devuelve un error si no se encuentra la noticia
    }
    return NextResponse.json(noticiaActualizada); // Devuelve la noticia actualizada en formato JSON
  } catch (error) {
    console.error(error); // Imprime el error en la consola
    return NextResponse.json({ error: "Error al actualizar la noticia" }, { status: 500 }); // Devuelve un error si algo falla
  }
}

