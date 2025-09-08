const UrlService = require("../service/url-service");
const geoip = require("geoip-lite");
const Log = require("./../../Logging Middleware/index");

const urlService = new UrlService();

// Create and save a shortened URL
const saveUrlInfo = async (req, res) => {
  try {
    console.log(req.body)
    const url = await urlService.createShortUrl(req.body);
    await Log(
      "backend",
      "info",
      "controller",
      "Short URL created successfully"
    );
    res.status(201).json(url);
  } catch (error) {
    await Log("backend", "error", "controller", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Retrieve URL info + runtime metadata
const getUrlInfo = async (req, res) => {
  try {
    const url = await urlService.getUrlDetails(req.params.id);

    if (!url || !url.data) {
      await Log("backend", "warn", "controller", "URL not found or expired");
      return res.status(404).json({ error: "URL not found or expired" });
    }

    // Runtime metadata (not saved in DB)
    const timestamp = new Date().toISOString();
    const referrer = req.get("Referer") || "Direct";
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const geo = geoip.lookup(ip);
    const location = geo ? `${geo.country}, ${geo.city || ""}` : "Unknown";

    await Log(
      "backend",
      "info",
      "controller",
      "URL info retrieved successfully"
    );

    res.status(200).json({
      ...url.data,
      clickDetails: {
        timestamp,
        referrer,
        location,
      },
    });
  } catch (error) {
    await Log("backend", "error", "controller", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { saveUrlInfo, getUrlInfo };
