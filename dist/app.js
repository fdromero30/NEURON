"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
(() => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer.launch({
        headless: false,
        defaultViewport: null,
        executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    });
    const page = yield browser.newPage();
    yield page.goto("https://www.etoro.com/markets/gold/chart/", {
        waitUntil: "networkidle2",
    });
    const getPrices = () => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield page.evaluate(() => {
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
    });
    // Use a self-contained function to periodically update prices
    const updatePrices = () => __awaiter(void 0, void 0, void 0, function* () {
        while (true) {
            const prices = yield getPrices();
            console.log(prices);
            yield new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds
        }
    });
    updatePrices().catch((err) => console.error(err));
}))();
