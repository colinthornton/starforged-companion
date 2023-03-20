import { SocketServer, startWebSocketServer } from "@/services/webSocketServer";

/**
 * Handle booting the websocket server in prod
 */
export default defineEventHandler((event) => {
  if (process.dev) return;

  if (!event.node.res.socket) {
    throw new Error("Socket not found");
  }
  // @ts-expect-error
  const server: SocketServer = event.node.res.socket.server;
  if (!server) {
    throw new Error("Socket server not found");
  }
  startWebSocketServer(server);
});
