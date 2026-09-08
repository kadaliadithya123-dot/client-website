const express = require("express");
const router = express.Router();
const { getCourses, getCourseBySlug, createCourse, updateCourse, deleteCourse } = require("../controllers/courseController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/", getCourses);
router.get("/:slug", getCourseBySlug);
router.post("/", protect, upload.single("image"), createCourse);
router.put("/:id", protect, upload.single("image"), updateCourse);
router.delete("/:id", protect, deleteCourse);

module.exports = router;
