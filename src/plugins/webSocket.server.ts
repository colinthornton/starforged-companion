import { startWebSocketServer } from "../services/webSocketServer";

export default defineNuxtPlugin(() => {
  if (process.dev) return;
  startWebSocketServer();
});
