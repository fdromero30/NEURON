const neuronCurrencyBinanceSocket = require("./controllers/binanceCurrency.socket");
const puppeteer = require("puppeteer-extra");
const cheerio = require("cheerio");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const express = require("express");
const app = express();
const port = 3000;

puppeteer.use(StealthPlugin());

app.get("/", (req, res) => {
  res.send("¡Hola Mundo!");
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
  neuronCurrencyBinanceSocket.createSocket("btcusdt");
});

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });

  const page = await browser.newPage();
  await page.goto("https://www.etoro.com/markets/gold/chart/", {
    waitUntil: "networkidle2",
  });

  const getPrices = async () => {
    const data = await page.evaluate(() => {
      const element = document.querySelector(".buy-sell-indicators");
      return element ? element.innerHTML : null;
    });

    if (data) {
      const $ = cheerio.load(data);
      const text = $("span").text().split(" ");
      return {
        sell: text[3] || "N/A",
        buy: text[7] || "N/A",
      };
    }
    return { sell: "N/A", buy: "N/A" };
  };

  // Use a self-contained function to periodically update prices
  const updatePrices = async () => {
    while (true) {
      const prices = await getPrices();
      console.log(prices);
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds
    }
  };

  updatePrices().catch((err) => console.error(err));
})();
