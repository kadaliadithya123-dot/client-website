const GalleryCategory = require("../models/GalleryCategory");
const Gallery = require("../models/Gallery");

const getCategories = async (req, res, next) => {
  try {
    const categories = await GalleryCategory.find().sort({ name: 1 });
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      res.status(400);
      throw new Error("Category name is required");
    }
    const category = await GalleryCategory.create({ name: name.trim() });
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400);
      return next(new Error("That category already exists"));
    }
    next(err);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      res.status(400);
      throw new Error("Category name is required");
    }
    const category = await GalleryCategory.findById(req.params.id);
    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }
    const newName = name.trim();
    if (category.name !== newName) {
      const clash = await GalleryCategory.findOne({ name: newName });
      if (clash) {
        res.status(400);
        throw new Error("That category name already exists");
      }
      const oldName = category.name;
      category.name = newName;
      await category.save();
      await Gallery.updateMany({ category: oldName }, { category: newName });
    }
    res.json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await GalleryCategory.findById(req.params.id);
    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }
    const inUse = await Gallery.countDocuments({ category: category.name });
    if (inUse > 0) {
      res.status(400);
      throw new Error(`Can't delete - ${inUse} image(s) still use this category. Reassign or delete them first.`);
    }
    await category.deleteOne();
    res.json({ success: true, message: "Category deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
