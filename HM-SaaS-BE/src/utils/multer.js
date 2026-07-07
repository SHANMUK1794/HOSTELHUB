import multer from "multer";

// Use memory storage because we need 'file.buffer' to send the image directly to Cloudinary
const storage = multer.memoryStorage();

// Limit: 2MB and only image files
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
    
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, JPG, or WEBP image files are allowed."));
    }
  }
});

export default upload;