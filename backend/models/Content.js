const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    value: { type: String, default: "" },
    page: { type: String, default: "General" },
    label: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Content", contentSchema);
