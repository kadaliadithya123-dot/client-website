const express = require("express");
const router = express.Router();
const { submitEnrollment, getEnrollments, markAsRead, deleteEnrollment } = require("../controllers/enrollmentController");
const { protect } = require("../middleware/auth");

router.post("/", submitEnrollment);
router.get("/", protect, getEnrollments);
router.put("/:id/read", protect, markAsRead);
router.delete("/:id", protect, deleteEnrollment);

module.exports = router;
