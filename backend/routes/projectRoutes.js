const express = require("express");
const router = express.Router();
const {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

const projectUpload = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "images", maxCount: 8 },
  { name: "pdf", maxCount: 1 },
]);

router.get("/", getProjects);
router.get("/:slug", getProjectBySlug);
router.post("/", protect, projectUpload, createProject);
router.put("/:id", protect, projectUpload, updateProject);
router.delete("/:id", protect, deleteProject);

module.exports = router;
