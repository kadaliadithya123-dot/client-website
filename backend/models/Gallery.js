const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    image: { type: String, required: true },
    category: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", gallerySchema);
