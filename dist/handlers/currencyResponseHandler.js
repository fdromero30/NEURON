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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.currencySocketReponseHandler = currencySocketReponseHandler;
const superTrendService_1 = require("../services/superTrendService");
const axios_1 = __importDefault(require("axios"));
function currencySocketReponseHandler(data) {
    // console.log(`Precio del BTCUSDT en tiempo real:`, data);
    const prices = [];
    getLast14BTCPrices().then((res) => __awaiter(this, void 0, void 0, function* () {
        yield res.forEach((element) => {
            prices.push({
                close: element.close,
                high: element.high,
                low: element.low,
            });
        });
        console.log((0, superTrendService_1.calculateSupertrend)(prices, 14, 4));
    }));
}
function getLast14BTCPrices() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const symbol = "BTCUSDT";
            const interval = "1m";
            const limit = 100; // Limite de 100 períodos
            const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
            const response = yield axios_1.default.get(url);
            const klines = response.data;
            // Convertir las velas a un formato más manejable si es necesario
            const prices = klines.map((kline) => ({
                openTime: kline[0],
                closeTime: kline[1],
                open: parseFloat(kline[2]),
                high: parseFloat(kline[3]),
                low: parseFloat(kline[4]),
                close: parseFloat(kline[1]),
                volume: parseFloat(kline[6]),
            }));
            return prices;
        }
        catch (error) {
            console.error("Error obteniendo los precios de BTC:", error);
            throw error;
        }
    });
}
