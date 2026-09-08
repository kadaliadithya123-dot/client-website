const cloudinary = require("../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isPdf = file.mimetype === "application/pdf";
    return {
      folder: "sritech",
      resource_type: isPdf ? "raw" : "image",
      public_id: `${Date.now()}-${file.originalname.split(".")[0].replace(/[^a-zA-Z0-9_-]/g, "-")}`,
    };
  },
});

const fileFilter = (req, file, cb) => {
  const allowedImage = /jpeg|jpg|png|webp|gif/;

  if (file.fieldname === "pdf") {
    if (file.mimetype === "application/pdf") return cb(null, true);
    return cb(new Error("Only PDF files are allowed for this field"));
  }
  if (allowedImage.test(file.mimetype)) return cb(null, true);
  return cb(new Error("Only image files (jpg, png, webp, gif) are allowed"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
});

module.exports = upload;
