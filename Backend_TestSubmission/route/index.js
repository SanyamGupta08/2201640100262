const express = require("express");
const router = express.Router();
const { getUrlInfo, saveUrlInfo } = require("../controller/index");

// No need for getLog / postLog here anymore
router.post("/", saveUrlInfo);
router.get("/:id", getUrlInfo);

module.exports = router;
