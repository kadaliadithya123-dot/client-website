const mongoose = require("mongoose");

// Single-document collection holding site-wide, admin-editable settings
const settingsSchema = new mongoose.Schema(
  {
    companyName: { type: String, default: "Sritech Solutions" },
    tagline: { type: String, default: "Bridging Theory and Industrial Innovation" },
    about: { type: String, default: "" },
    address: { type: String, default: "Sritech Solutions, Ratnaveni Complex, 1st Lane, Dwarakanagar, Visakhapatnam - 530016" },
    phone: { type: String, default: "99488-32456 / 86886-32456" },
    email: { type: String, default: "sritechsolutions9@gmail.com" },
    whatsapp: { type: String, default: "+91 99488-32456" },
    mapEmbedUrl: { type: String, default: "" },
    studentsTrained: { type: Number, default: 500 },
    projectsDelivered: { type: Number, default: 120 },
    industryPartners: { type: Number, default: 15 },
    branchesSupported: { type: Number, default: 8 },
    social: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "https://instagram.com/sritech_projects" },
      linkedin: { type: String, default: "" },
      youtube: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },
    stats: {
      studentsTrained: { type: Number, default: 500 },
      projectsDelivered: { type: Number, default: 120 },
      industryPartners: { type: Number, default: 15 },
      branchesSupported: { type: Number, default: 8 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
