const express = require("express");
const router = express.Router();
const { trackVisit, getCount } = require("../controllers/visitorController");

router.post("/track", trackVisit);
router.get("/", getCount);

module.exports = router;
