const UrlRepository = require("../repository/url-repository");

class UrlService {
  constructor() {
    this.urlRepository = new UrlRepository();
  }

  // Create and save a shortened URL
  async createShortUrl({ url, validity = 30, shortcode }) {
    try {
      // expiry time in ISO format
      const expiryTime = new Date(Date.now() + validity * 60000).toISOString();

      // generate shortcode if not provided, ensure uniqueness
      const shortCode = shortcode || (await this.generateUniqueShortCode());

      // construct shortLink
      const shortLink = `https://hostname:port/${shortCode}`;

      // save in repository
      await this.urlRepository.saveUrl(url, shortCode, expiryTime);

      return {
        shortLink,
        expiry: expiryTime,
      };
    } catch (err) {
      throw new Error("Error creating short URL: " + err.message);
    }
  }

  // Random shortcode generator
  generateShortCode(length = 6) {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Ensure generated code is unique
  async generateUniqueShortCode(length = 6) {
    let code;
    let exists = true;
    while (exists) {
      code = this.generateShortCode(length);
      exists = await this.urlRepository.existsByShortCode(code);
    }
    return code;
  }

  // Retrieve URL info (increments clicks)
  async getUrlDetails(shortendUrl) {
    try {
      const urlInfo = await this.urlRepository.getUrlInfo(shortendUrl);
      if (!urlInfo) {
        return { message: "Short URL not found", data: null };
      }

      // Check expiry
      const now = new Date();
      const expiry = new Date(urlInfo.validity);
      if (expiry && now > expiry) {
        return { message: "Short URL has expired", data: null };
      }

      return {
        message: "Short URL details fetched",
        data: urlInfo,
      };
    } catch (err) {
      throw new Error("Error fetching URL details: " + err.message);
    }
  }

  // Delete expired URLs
  async cleanupExpiredUrls() {
    try {
      const deletedCount = await this.urlRepository.deleteExpiredUrls();
      return {
        message: `Deleted ${deletedCount} expired URLs`,
        deletedCount,
      };
    } catch (err) {
      throw new Error("Error cleaning expired URLs: " + err.message);
    }
  }
}

module.exports = UrlService;
