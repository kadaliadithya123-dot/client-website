const path = require("path");
const fs = require("fs");
const multer = require("multer");

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .slice(0, 40);
    cb(null, `${base}-${Date.now()}-${Math.round(Math.random() * 1e5)}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedImage = /jpeg|jpg|png|webp|gif/;
  const allowedDoc = /pdf/;
  const ext = path.extname(file.originalname).toLowerCase().replace(".", "");

  if (file.fieldname === "pdf") {
    if (allowedDoc.test(ext)) return cb(null, true);
    return cb(new Error("Only PDF files are allowed for this field"));
  }
  if (allowedImage.test(ext)) return cb(null, true);
  return cb(new Error("Only image files (jpg, png, webp, gif) are allowed"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
});

module.exports = upload;
