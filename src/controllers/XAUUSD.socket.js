"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSocket = createSocket;
const ws_1 = __importDefault(require("ws"));
function createSocket() {
    // Conectar al WebSocket de Binance para datos en tiempo real del oro (en este caso, se usará un símbolo de oro como XAU/USD si está disponible en Binance)
    const ws = new ws_1.default("wss://stream.binance.com:9443/ws/btcusdt@kline_1m");
    ws.on("open", () => {
        console.log("Conectado al WebSocket");
    });
    ws.on("message", (data) => {
        var _a;
        const jsonData = JSON.parse(data);
        console.log(".");
        if ((_a = jsonData === null || jsonData === void 0 ? void 0 : jsonData.k) ===
            null || _a === void 0
            ? void 0
            : _a.x) {
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
