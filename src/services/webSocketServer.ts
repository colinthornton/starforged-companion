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

    ws.on("message", (data) => {
      try {
        const parsed = JSON.parse(String(data));
        switch (parsed.action) {
          case "GET_PROGRESS_TRACKS":
            ws.send(
              JSON.stringify({
                action: "SET_PROGRESS_TRACKS",
                payload: progressTracks,
              })
            );
          case "SET_PROGRESS_TRACKS":
            try {
              progressTracks = z
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
              for (const client of clients) {
                client.send(
                  JSON.stringify({
                    action: "SET_PROGRESS_TRACKS",
                    payload: progressTracks,
                  })
                );
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
