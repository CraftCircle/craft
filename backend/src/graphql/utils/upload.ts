import multer from "multer";
import cloudinary from "../../config/cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { Request, Response } from "express";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: Request, file) => {
    return {
      folder: "posts",
      format: "auto",
      public_id: `${Date.now()}-${file.originalname}`,
      resource_type: file.mimetype.startsWith("video/") ? "video" : "image",
    };
  },
});

//multer setup
const upload = multer({
  storage: storage,
  fileFilter: (req: Request, file, cb) => {
    if (
      file.mimetype.startsWith("image") ||
      file.mimetype.startsWith("video")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Not an image or video! Please upload an image or video."));
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 10, //10MB
  },
});

//function to upload files
export const handleFileUpload = async (req: Request, res: Response) => {
  try {
    return await new Promise<string[]>((resolve, reject) => {
      upload.any()(req, res, (err) => {
        if (err) {
          return reject(err);
        }
        const files = req.files as Express.Multer.File[];
        const uploadedUrls = files.map((file) => file.path);
        resolve(uploadedUrls);
      });
    });
  } catch (error) {
    console.error("Error uploading files: ", error);
    throw new Error("Error uploading files");
  }
};
