import { WebSocket, WebSocketServer } from "ws";

import { ProgressTrack } from "../models/ProgressTrack";

let clients: WebSocket[] = [];
let progressTracks: ProgressTrack[] = [];

export function startWebSocketServer() {
  const wss = new WebSocketServer({ port: 3001 });

  console.log(wss.address());

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

  return wss;
}
