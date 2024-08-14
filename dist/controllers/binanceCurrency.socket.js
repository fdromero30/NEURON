"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSocket = createSocket;
const ws_1 = __importDefault(require("ws"));
const currencyResponseHandler_1 = require("../handlers/currencyResponseHandler");
const RECONNECT_INTERVAL = 5000; // Intervalo de reconexión en milisegundos
let ws = null;
let currency = "";
/**
 * Crea una nueva conexión WebSocket y maneja los eventos.
 * @param currencyInput - El par de divisas para suscribirse.
 */
function createSocket(currencyInput) {
    currency = currencyInput;
    const url = `wss://stream.binance.com:9443/ws/${currency}@kline_1m`;
    ws = new ws_1.default(url);
    ws.on("open", () => {
        console.log("Conectado al WebSocket");
    });
    ws.on("message", (data) => handleMessage(data));
    ws.on("error", (error) => {
        console.error("Error en el WebSocket:", error);
    });
    ws.on("close", (code, reason) => handleClose(code, reason));
}
/**
 * Maneja los mensajes recibidos a través del WebSocket.
 * @param data - Datos recibidos del WebSocket.
 */
function handleMessage(data) {
    var _a;
    try {
        const jsonData = JSON.parse(data.toString());
        if (typeof jsonData === "string") {
            if (jsonData === "ping") {
                console.log("Received ping from server, sending pong.");
                ws === null || ws === void 0 ? void 0 : ws.send("pong");
            }
        }
        else if ((_a = jsonData === null || jsonData === void 0 ? void 0 : jsonData.k) === null || _a === void 0 ? void 0 : _a.x) {
            (0, currencyResponseHandler_1.currencySocketReponseHandler)(jsonData);
        }
        else {
            console.log('.');
        }
    }
    catch (error) {
        console.error("Error procesando el mensaje:", error);
    }
}
/**
 * Maneja el cierre del WebSocket y reintenta la conexión.
 * @param code - Código de cierre del WebSocket.
 * @param reason - Razón del cierre del WebSocket.
 */
function handleClose(code, reason) {
    console.log(`WebSocket cerrado. Código: ${code}, Razón: ${reason}`);
    // Intentar reconectar
    setTimeout(() => {
        console.log("Intentando reconectar...");
        createSocket(currency);
    }, RECONNECT_INTERVAL);
}
