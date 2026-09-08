const Gallery = require("../models/Gallery");

// @desc  Get gallery images (public, filter by category, infinite-scroll style pagination)
// @route GET /api/gallery
const getGallery = async (req, res, next) => {
  try {
    const { category, page = 1, limit = 12 } = req.query;
    const query = {};
    if (category) query.category = category;

    const pageNum = Math.max(parseInt(page), 1);
    const limitNum = Math.max(parseInt(limit), 1);

    const [images, total] = await Promise.all([
      Gallery.find(query)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Gallery.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: images,
      pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum), hasMore: pageNum * limitNum < total },
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Upload gallery image(s)
// @route POST /api/gallery
// @access Private
const uploadGalleryImages = async (req, res, next) => {
  try {
    if (!req.files?.length) {
      res.status(400);
      throw new Error("At least one image is required");
    }
    const { category, title = "" } = req.body;
    const docs = await Gallery.insertMany(
      req.files.map((f) => ({ image: `/uploads/${f.filename}`, category, title }))
    );
    res.status(201).json({ success: true, data: docs });
  } catch (err) {
    next(err);
  }
};

// @desc  Delete gallery image
// @route DELETE /api/gallery/:id
// @access Private
const deleteGalleryImage = async (req, res, next) => {
  try {
    const img = await Gallery.findByIdAndDelete(req.params.id);
    if (!img) {
      res.status(404);
      throw new Error("Image not found");
    }
    res.json({ success: true, message: "Image deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getGallery, uploadGalleryImages, deleteGalleryImage };
