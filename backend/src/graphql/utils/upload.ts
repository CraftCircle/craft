import { FileUpload } from "graphql-upload-minimal";
import cloudinary from "../../config/cloudinary";

interface UploadResult {
  url: string;
  filename: string;
}

export const uploadFile = async (
  file: FileUpload,
  resourceType: "image" | "video" | "audio"
): Promise<UploadResult> => {
  const { createReadStream, filename, mimetype } = file;

  const allowedTypes = {
    image: ["image/jpeg", "image/png", "image/gif"],
    video: ["video/mp4", "video/mpeg", "video/avi"],
    audio: ["audio/mpeg", "audio/wav"],
  };

  if (!allowedTypes[resourceType].includes(mimetype)) {
    throw new Error(`Unsupported file type: ${mimetype}`);
  }

  const stream = createReadStream();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "auto", folder: `${resourceType}s` },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(new Error("Failed to upload file to Cloudinary"));
        } else {
          // Return both the URL and the filename
          resolve({
            url: result!.secure_url,
            filename: result!.original_filename,
          });
        }
      }
    );

    stream.pipe(uploadStream);
  });
};
