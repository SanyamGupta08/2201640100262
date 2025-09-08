const { URLinfo } = require("../models/index");
const { Op } = require("sequelize");

class UrlRepository {
  async saveUrl(originalUrl, shortendUrl, expiryTime) {
    try {
      const urlData = await URLinfo.create({
        originalUrl,
        shortendUrl,
        expiryTime,
      });
      return urlData;
    } catch (err) {
      throw new Error("Error saving URL: " + err.message);
    }
  }

  async getUrlInfo(shortendUrl) {
    try {
      const urlData = await URLinfo.findByPk(shortendUrl);
      if (!urlData) {
        return null;
      }

      urlData.clicked += 1;
      await urlData.save();

      return {
        originalUrl: urlData.originalUrl,
        validity: urlData.expiryTime,
        clicked: urlData.clicked,
      };
    } catch (err) {
      throw new Error("Error retrieving URL info: " + err.message);
    }
  }

  async peekUrlInfo(shortendUrl) {
    try {
      const urlData = await URLinfo.findByPk(shortendUrl);
      if (!urlData) return null;

      return {
        originalUrl: urlData.originalUrl,
        validity: urlData.expiryTime,
        clicked: urlData.clicked,
      };
    } catch (err) {
      throw new Error("Error peeking URL info: " + err.message);
    }
  }

  async deleteExpiredUrls() {
    try {
      const now = new Date();
      const deletedCount = await URLinfo.destroy({
        where: {
          expiryTime: {
            [Op.lte]: now, // expiryTime <= now
          },
        },
      });
      return deletedCount; // number of deleted rows
    } catch (err) {
      throw new Error("Error deleting expired URLs: " + err.message);
    }
  }

  // ✅ New helper to check if a shortcode exists
  async existsByShortCode(shortendUrl) {
    const urlData = await URLinfo.findByPk(shortendUrl);
    return !!urlData;
  }
}

module.exports = UrlRepository;
