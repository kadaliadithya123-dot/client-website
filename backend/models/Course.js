const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    image: { type: String, default: "" },
    description: { type: String, required: true },
    duration: { type: String, required: true }, // e.g. "6 Weeks"
    fee: { type: Number, required: true, default: 0 },
    level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
    trainer: { type: String, default: "" },
    technologies: [{ type: String }],
    syllabus: [{ type: String }], // list of topics/modules
    eligibility: { type: String, default: "" },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

courseSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Course", courseSchema);
