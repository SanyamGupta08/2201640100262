const axios = require("axios");

const LOG_API = "http://20.244.56.144/evaluation-service/logs";
const TOKEN = process.env.AUTH_TOKEN; // ensure in .env file

async function Log(stack, level, pkg, message) {
  try {
    const payload = {
      stack: stack.toLowerCase(), // must be lowercase
      level: level.toLowerCase(),
      package: pkg.toLowerCase(),
      message,
    };

    await axios.post(LOG_API, payload, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Logging failed:", error.response?.data || error.message);
  }
}

module.exports = Log;
