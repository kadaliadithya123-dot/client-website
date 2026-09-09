const express = require("express");
const {
  getContentMap,
  getContentList,
  upsertContent,
  deleteContent,
} = require("../controllers/contentController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", getContentMap);
router.get("/admin", protect, getContentList);
router.post("/", protect, upsertContent);
router.delete("/:id", protect, deleteContent);

module.exports = router;
