// Global types for the application
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Authenticated user type
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  image?: string;
  role: 'admin' | 'user';
  provider: 'google' | 'facebook';
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface NewsForm {
  title: string;
  content: string;
  image?: string;
  summary?: string;
  tags?: string[];
  commentsEnabled: boolean;
}

export interface CommentForm {
  content: string;
  newsId: string;
}

export interface BannerForm {
  title: string;
  image: File | string;
  link?: string;
  bannerType: 'horizontal' | 'vertical';
  position: 'header' | 'sidebar' | 'footer' | 'contenido';
  startDate?: Date;
  endDate?: Date;
  order: number;
}

export interface TransmissionForm {
  title: string;
  description?: string;
  transmissionType: 'radio' | 'video';
  scheduledDate?: Date;
  thumbnailUrl?: string;
}

// Enums for various types and roles
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export enum TransmissionStatus {
  SCHEDULED = 'scheduled',
  LIVE = 'live',
  FINISHED = 'finished'
}

export enum BannerType {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical'
}

export enum BannerPosition {
  HEADER = 'header',
  SIDEBAR = 'sidebar',
  FOOTER = 'footer',
  CONTENT = 'content'
}