import { NextResponse } from "next/server"; // Importa utilidades para responder en rutas Next.js
import dbConnect from "@/lib/mongodb";      // Importa la función para conectar a MongoDB
import Usuario from "@/models/User";     // Importa el modelo de usuarios