const express = require("express");
const axios = require("axios");
const https = require("https");
const app = express();
const PORT = 3000;

const agent = new https.Agent({
  rejectUnauthorized: false,
});

app.get("/scrape", async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).json({ error: "Missing URL" });

  try {
    const response = await axios.get(targetUrl, {
      httpsAgent: agent,
      proxy: {
        host: "unblock.smartproxy.com",
        port: 60000,
        auth: {
          username: "U0000252002",
          password: "PW_1ead89805589aff6b41df039430c89fe2"
        }
      },
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Accept-Encoding": "identity",
        "Referer": "https://www.leboncoin.fr/",
        "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7"
      },
      decompress: false,
      responseType: "text"
    });

    // Envoi à n8n : HTML brut + URL utilisée (pour filtrage plus tard)
    res.status(200).json({
      data: response.data,
      url: targetUrl
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Request failed" });
  }
});

app.listen(PORT, () => {
  console.log(`SmartProxy middleware running on port ${PORT}`);
});
