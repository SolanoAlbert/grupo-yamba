import "server-only";
import { v2 as cloudinary } from "cloudinary";

// Configure from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export async function uploadImage(
  file: string, // can be local path, remote URL, or base64 (data URI)
  options?: Parameters<typeof cloudinary.uploader.upload>[1]
) {
  return cloudinary.uploader.upload(file, options);
}

export async function deleteImage(publicId: string) {
  return cloudinary.uploader.destroy(publicId);
}
