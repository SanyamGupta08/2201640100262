const UrlRepository = require("../repository/url-repository");
const Log = require("./../../Logging Middleware/index");

class UrlService {
  constructor() {
    this.urlRepository = new UrlRepository();
  }

  // Create and save a shortened URL
  async createShortUrl({ url, validity = 30, shortcode }) {
    try {
      const expiryTime = new Date(Date.now() + validity * 60000).toISOString();
      const shortCode = `${shortcode}${Date.now()}`;

      // Directly store the shortcode, no full URL added
      const urlData=await this.urlRepository.saveUrl({ url: url, shortCode: shortCode, validity: expiryTime });
      await Log("backend", "info", "service", "Short URL created");

      return urlData; // Return shortcode only
    } catch (err) {
      await Log("backend", "error", "service", err.message);
      throw new Error("Error creating short URL: " + err.message);
    }
  }

  generateShortCode(length = 6) {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async generateUniqueShortCode(length = 6) {
    let code;
    let exists = true;
    while (exists) {
      code = this.generateShortCode(length);
      exists = await this.urlRepository.existsByShortCode(code);
    }
    return code;
  }

  async getUrlDetails(shortCode) {
    try {
      const urlInfo = await this.urlRepository.getUrlInfo(shortCode);
      if (!urlInfo) {
        await Log("backend", "warn", "service", "Short URL not found");
        return { message: "Short URL not found", data: null };
      }

      const now = new Date();
      const expiry = new Date(urlInfo.validity);
      if (expiry && now > expiry) {
        await Log("backend", "warn", "service", "Short URL expired");
        return { message: "Short URL has expired", data: null };
      }

      await Log("backend", "info", "service", "Short URL details fetched");
      return { message: "Short URL details fetched", data: urlInfo };
    } catch (err) {
      await Log("backend", "error", "service", err.message);
      throw new Error("Error fetching URL details: " + err.message);
    }
  }

  async cleanupExpiredUrls() {
    try {
      const deletedCount = await this.urlRepository.deleteExpiredUrls();
      await Log(
        "backend",
        "info",
        "service",
        `Cleaned ${deletedCount} expired URLs`
      );
      return {
        message: `Deleted ${deletedCount} expired URLs`,
        deletedCount,
      };
    } catch (err) {
      await Log("backend", "error", "service", err.message);
      throw new Error("Error cleaning expired URLs: " + err.message);
    }
  }
}

module.exports = UrlService;
