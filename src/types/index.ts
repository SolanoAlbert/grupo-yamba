// Tipos globales para el proyecto
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Tipos para autenticación
export interface AuthUser {
  id: string;
  email: string;
  nombre: string;
  imagen?: string;
  rol: 'admin' | 'usuario';
  proveedor: 'google' | 'facebook' ;
}

// Tipos para formularios
export interface LoginForm {
  email: string;
  password: string;
}

export interface NoticiaForm {
  titulo: string;
  contenido: string;
  imagen?: string;
  resumen?: string;
  tags?: string[];
  comentariosHabilitados: boolean;
}

export interface ComentarioForm {
  contenido: string;
  noticiaId: string;
}

export interface BannerForm {
  titulo: string;
  imagen: File | string;
  enlace?: string;
  tipo: 'horizontal' | 'vertical';
  posicion: 'header' | 'sidebar' | 'footer' | 'contenido';
  fechaInicio?: Date;
  fechaFin?: Date;
  orden: number;
}

export interface TransmisionForm {
  titulo: string;
  descripcion?: string;
  tipo: 'radio' | 'video';
  fechaProgramada?: Date;
  thumbnailUrl?: string;
}

// Enums para mejor tipo de datos
export enum UserRole {
  ADMIN = 'admin',
  USUARIO = 'usuario'
}

export enum TransmisionEstado {
  PROGRAMADA = 'programada',
  EN_VIVO = 'en_vivo',
  FINALIZADA = 'finalizada'
}

export enum BannerTipo {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical'
}

export enum BannerPosicion {
  HEADER = 'header',
  SIDEBAR = 'sidebar',
  FOOTER = 'footer',
  CONTENIDO = 'contenido'
}