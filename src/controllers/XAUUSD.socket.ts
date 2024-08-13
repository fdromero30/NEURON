import WebSocket, { WebSocketServer } from "ws";
import { wsResponse } from "../models/webSocketResponse";

export function createSocket() {
  // Conectar al WebSocket de Binance para datos en tiempo real del oro (en este caso, se usará un símbolo de oro como XAU/USD si está disponible en Binance)
  const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@kline_1m");
  ws.on("open", () => {
    console.log("Conectado al WebSocket");
  });
  ws.on("message", (data: any) => {
    var _a;
    const jsonData = JSON.parse(data) as wsResponse;
    console.log(".");
    if (
      (_a = jsonData === null || jsonData === void 0 ? void 0 : jsonData.k) ===
        null || _a === void 0
        ? void 0
        : _a.x
    ) {
      console.log("Precio del BTC en tiempo real:", jsonData);
    }
  });
  ws.on("error", (error) => {
    console.error("Error en el WebSocket:", error);
  });
  ws.on("close", () => {
    console.log("WebSocket cerrado");
  });

  return ws;
}
