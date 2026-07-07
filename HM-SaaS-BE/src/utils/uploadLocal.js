import multer from "multer";
import path from "path";
import fs from "fs";

// Use the environment variable, or default to public/uploads/
const uploadDir = process.env.UPLOAD_PATH || "public/uploads/";

// Automatically create the folder if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save in public/uploads/
  },
  filename: (req, file, cb) => {
    // Creates a safe, unique filename (e.g., 1700000000-12345.jpg)
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadLocal = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, JPG, or WEBP images are allowed."));
    }
  }
});

export default uploadLocal;