const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "logging.txt");

// GET logging middleware
function getLog(req, res, next) {
  // Ensure the log file exists
  if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, "", "utf8");
  }

  const id = req.query.id || "N/A";
  const logMessage = `[${new Date().toISOString()}] Request: GET, Query ID: ${id}`;
  fs.appendFile(logFilePath, logMessage + "\n", (err) => {
    if (err) console.error("Error writing GET log:", err);
  });

  next();
}

// POST logging middleware
function postLog(req, res, next) {
  // Ensure the log file exists
  if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, "", "utf8");
  }

  const logMessage = `[${new Date().toISOString()}] Request: POST, Body: ${JSON.stringify(
    req.body
  )}`;
  fs.appendFile(logFilePath, logMessage + "\n", (err) => {
    if (err) console.error("Error writing POST log:", err);
  });

  next();
}

module.exports = { getLog, postLog };
