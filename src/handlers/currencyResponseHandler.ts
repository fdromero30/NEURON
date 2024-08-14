import { wsResponse } from "../models/webSocketResponse";
import { calculateSupertrend } from "../services/superTrendService";
import axios from "axios";

export function currencySocketReponseHandler(data: wsResponse) {
  // console.log(`Precio del BTCUSDT en tiempo real:`, data);

  const prices: PriceData[] = [];

  getLast14BTCPrices().then(async (res) => {
    await res.forEach((element: Kline) => {
      prices.push({
        close: element.close,
        high: element.high,
        low: element.low,
      });
    });
    console.log(calculateSupertrend(prices, 14, 4));
  });
}

async function getLast14BTCPrices(): Promise<any> {
  try {
    const symbol = "BTCUSDT";
    const interval = "1m";
    const limit = 100; // Limite de 100 períodos
    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;

    const response = await axios.get(url);
    const klines: Kline[] = response.data;
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
  } catch (error) {
    console.error("Error obteniendo los precios de BTC:", error);
    throw error;
  }
}
