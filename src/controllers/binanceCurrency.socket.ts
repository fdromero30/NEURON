import WebSocket from "ws";
import { wsResponse } from "../models/webSocketResponse";

const RECONNECT_INTERVAL = 5000; // Intervalo de reconexión en milisegundos
let ws: WebSocket | null = null;
let currency: string = "";

/**
 * Crea una nueva conexión WebSocket y maneja los eventos.
 * @param currencyInput - El par de divisas para suscribirse.
 */
export function createSocket(currencyInput: string): void {
  currency = currencyInput;
  const url = `wss://stream.binance.com:9443/ws/${currency}@kline_1m`;

  ws = new WebSocket(url);

  ws.on("open", () => {
    console.log("Conectado al WebSocket");
  });

  ws.on("message", (data: WebSocket.RawData) => handleMessage(data));

  ws.on("error", (error) => {
    console.error("Error en el WebSocket:", error);
  });

  ws.on("close", (code: number, reason: string) => handleClose(code, reason));
}

/**
 * Maneja los mensajes recibidos a través del WebSocket.
 * @param data - Datos recibidos del WebSocket.
 */
function handleMessage(data: WebSocket.RawData): void {
  try {
    const jsonData: wsResponse | string = JSON.parse(data.toString());

    if (typeof jsonData === "string") {
      if (jsonData === "ping") {
        console.log("Received ping from server, sending pong.");
        ws?.send("pong");
      }
    } else if (jsonData?.k?.x) {
      console.log(`Precio del ${currency} en tiempo real:`, jsonData);
    }
  } catch (error) {
    console.error("Error procesando el mensaje:", error);
  }
}

/**
 * Maneja el cierre del WebSocket y reintenta la conexión.
 * @param code - Código de cierre del WebSocket.
 * @param reason - Razón del cierre del WebSocket.
 */
function handleClose(code: number, reason: string): void {
  console.log(`WebSocket cerrado. Código: ${code}, Razón: ${reason}`);
  // Intentar reconectar
  setTimeout(() => {
    console.log("Intentando reconectar...");
    createSocket(currency);
  }, RECONNECT_INTERVAL);
}
