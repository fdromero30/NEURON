import { wsResponse } from "../models/webSocketResponse";

export function currencySocketReponseHandler(data: wsResponse) {
  console.log(`Precio del BTCUSDT en tiempo real:`, data);
}
