const express = require("express");
const router = express.Router();
const { getLog, postLog } = require("../../Logging Middleware/index");
const { getUrlInfo, saveUrlInfo } = require("../controller/index");
router.post("/", postLog, saveUrlInfo);
router.get("/:id", getLog, getUrlInfo);

module.exports = router;
