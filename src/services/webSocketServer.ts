import { WebSocket, WebSocketServer } from "ws";
import { z } from "zod";

import { ChallengeRank } from "../models/ChallengeRank";
import {
  ProgressTrack,
  PROGRESS_TRACK_TICKS_MAX,
  PROGRESS_TRACK_TICKS_MIN,
} from "../models/ProgressTrack";

let wss: WebSocketServer;
let clients: WebSocket[] = [];
let progressTracks: ProgressTrack[] = [];

export type SocketServer = NonNullable<
  NonNullable<ConstructorParameters<typeof WebSocketServer>[0]>["server"]
>;

export function startWebSocketServer(server: SocketServer) {
  if (wss) return wss;
  wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    clients.push(ws);

    if (ws.readyState === ws.OPEN) {
      sendProgressTracks(ws);
    } else {
      ws.on("open", () => {
        sendProgressTracks(ws);
      });
    }

    ws.on("message", (data) => {
      try {
        const parsed = JSON.parse(String(data));
        switch (parsed.action) {
          case "SET_PROGRESS_TRACKS":
            try {
              const payload = z
                .array(
                  z.object({
                    name: z.string().min(1),
                    challengeRank: z
                      .number()
                      .min(ChallengeRank.Troublesome)
                      .max(ChallengeRank.Epic),
                    ticks: z
                      .number()
                      .min(PROGRESS_TRACK_TICKS_MIN)
                      .max(PROGRESS_TRACK_TICKS_MAX),
                  })
                )
                .parse(parsed.payload);
              progressTracks = payload;
              for (const client of clients) {
                sendProgressTracks(client);
              }
            } finally {
              break;
            }
        }
      } catch {}
    });

    ws.on("close", () => {
      clients = clients.filter((client) => client !== ws);
    });
  });

  return wss;
}

function sendProgressTracks(ws: WebSocket) {
  ws.send(
    JSON.stringify({ action: "SET_PROGRESS_TRACKS", payload: progressTracks })
  );
}
