const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    thumbnail: { type: String, default: "" },
    description: { type: String, required: true },
    domain: {
      type: String,
      enum: [
        "8051 BASED PROJECTS",
        "PIC MICROCONTROLLER BASED PROJECTS",
        "ARDUINO BASED PROJECTS",
        "ESP32 BASED PROJECTS",
        "STM32 BASED PROJECTS",
        "RASPBEERY PI PICO BASED PROJECTS",
        "HARDWARE AND NETWORKING BASED PROJECTS",
        "LI-FI BASED PROJECTS",
        "ROBOTICS",
      ],
      required: true,
    },
    technologies: [{ type: String }],
    images: [{ type: String }],
    videoLink: { type: String, default: "" },
    difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Intermediate" },
    teamSize: { type: Number, default: 1 },
    pdfUrl: { type: String, default: "" },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

projectSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Project", projectSchema);
