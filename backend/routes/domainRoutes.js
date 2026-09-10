const express = require("express");
const router = express.Router();
const { getDomains, createDomain, deleteDomain } = require("../controllers/domainController");
const { protect } = require("../middleware/auth");

router.get("/", getDomains);
router.post("/", protect, createDomain);
router.delete("/:id", protect, deleteDomain);

module.exports = router;
