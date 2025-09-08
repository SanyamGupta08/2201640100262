const { URLinfo } = require("../models/index");
const { Op } = require("sequelize");
const Log = require("./../../Logging Middleware/index");
const { PORT}=require("../config/server-config");
class UrlRepository {
  async saveUrl({ url, shortCode, validity }) {
    try {
      const urlData = await URLinfo.create({
        originalUrl:url,
        shortendUrl:shortCode,
        expiryTime:validity,
      });
      await Log("backend", "info", "repository", "URL saved successfully");
      return {
        validity: validity, shortLink: `http://localhost:${PORT}/shorturls/${shortCode}`
       };
    } catch (err) {
      await Log("backend", "fatal", "repository", err.message);
      throw new Error("Error saving URL: " + err.message);
    }
  }

  async getUrlInfo(shortCode) {
    try {
      const urlData = await URLinfo.findByPk(shortCode);
      if (!urlData) {
        await Log("backend", "warn", "repository", "URL not found");
        return null;
      }

      urlData.clicked += 1;
      await urlData.save();

      await Log(
        "backend",
        "info",
        "repository",
        "URL retrieved and click incremented"
      );
      return {
        originalUrl: urlData.originalUrl,
        validity: urlData.expiryTime,
        clicked: urlData.clicked,
      };
    } catch (err) {
      await Log("backend", "error", "repository", err.message);
      throw new Error("Error retrieving URL info: " + err.message);
    }
  }

  async peekUrlInfo(shortendUrl) {
    try {
      const urlData = await URLinfo.findByPk(shortendUrl);
      if (!urlData) {
        await Log("backend", "warn", "repository", "Peek URL not found");
        return null;
      }

      await Log(
        "backend",
        "info",
        "repository",
        "Peek URL retrieved successfully"
      );
      return {
        originalUrl: urlData.originalUrl,
        validity: urlData.expiryTime,
        clicked: urlData.clicked,
      };
    } catch (err) {
      await Log("backend", "error", "repository", err.message);
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
      await Log(
        "backend",
        "info",
        "repository",
        `Deleted ${deletedCount} expired URLs`
      );
      return deletedCount;
    } catch (err) {
      await Log("backend", "error", "repository", err.message);
      throw new Error("Error deleting expired URLs: " + err.message);
    }
  }
  async existsByShortCode(shortendUrl) {
    const urlData = await URLinfo.findByPk(shortendUrl);
    return !!urlData;
  }
}

module.exports = UrlRepository;
