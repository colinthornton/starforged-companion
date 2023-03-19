import { Nuxt } from "nuxt/schema";
import { WebSocket, WebSocketServer } from "ws";

import { ProgressTrack } from "../models/ProgressTrack";

export default (_inlineOptions: unknown, nuxt: Nuxt) => {
  let clients: WebSocket[] = [];
  let progressTracks: ProgressTrack[] = [];

  nuxt.hook("listen", (server) => {
    const wss = new WebSocketServer({ server });

    nuxt.hook("close", () => {
      wss.close();
    });

    wss.on("connection", (ws) => {
      clients.push(ws);

      ws.send(
        JSON.stringify({
          action: "SET_PROGRESS_TRACKS",
          payload: progressTracks,
        })
      );

      ws.on("message", (data) => {
        try {
          const parsed = JSON.parse(String(data));
          switch (parsed.action) {
            case "SET_PROGRESS_TRACKS":
              progressTracks = parsed.payload;
              for (const client of clients) {
                client.send(
                  JSON.stringify({
                    action: "SET_PROGRESS_TRACKS",
                    payload: progressTracks,
                  })
                );
              }
              break;
          }
        } catch (error) {}
      });

      ws.on("close", () => {
        clients = clients.filter((client) => client !== ws);
      });
    });
  });
};
