const mongoose = require("mongoose");

// Single-document collection holding site-wide, admin-editable settings
const settingsSchema = new mongoose.Schema(
  {
    companyName: { type: String, default: "SriTech Embedded Projects" },
    tagline: { type: String, default: "Bridging Theory and Industrial Innovation" },
    about: { type: String, default: "" },
    address: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    mapEmbedUrl: { type: String, default: "" },
    social: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      youtube: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
