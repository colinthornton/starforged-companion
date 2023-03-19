import { Nuxt } from "nuxt/schema";

import { startWebSocketServer } from "../services/webSocketServer";

export default (_inlineOptions: unknown, nuxt: Nuxt) => {
  nuxt.hook("listen", () => {
    const wss = startWebSocketServer();

    nuxt.hook("close", () => {
      wss.close();
    });
  });
};
