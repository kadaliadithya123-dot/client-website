const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    image: { type: String, required: true },
    category: {
      type: String,
      enum: ["Events", "Workshops", "Projects", "Labs", "Students"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", gallerySchema);
