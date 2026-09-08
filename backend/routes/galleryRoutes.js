const express = require("express");
const router = express.Router();
const { getGallery, uploadGalleryImages, deleteGalleryImage } = require("../controllers/galleryController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/", getGallery);
router.post("/", protect, upload.array("images", 12), uploadGalleryImages);
router.delete("/:id", protect, deleteGalleryImage);

module.exports = router;
