import { Nuxt } from "nuxt/schema";

import { startWebSocketServer } from "../services/webSocketServer";

/**
 * Handle starting and restarting the websocket server in dev
 */
export default (_inlineOptions: unknown, nuxt: Nuxt) => {
  nuxt.hook("listen", (server) => {
    const wss = startWebSocketServer(server);

    nuxt.hook("close", () => {
      wss.close();
    });
  });
};
