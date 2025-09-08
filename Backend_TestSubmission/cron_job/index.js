const cron = require("node-cron");
const UrlService = require("../service/url-service");

const urlService = new UrlService();

// ✅ Run every hour (minute 0 of every hour)
cron.schedule("0 * * * *", async () => {
  try {
    const result = await urlService.cleanupExpiredUrls();
    console.log(`[CRON] ${new Date().toISOString()} - ${result.message}`);
  } catch (err) {
    console.error("[CRON] Error cleaning expired URLs:", err.message);
  }
});

// Keep process alive
console.log("Cron job started: cleaning expired URLs every hour...");
