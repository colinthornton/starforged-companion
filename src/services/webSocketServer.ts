import jsonPatch from "fast-json-patch";
import { WebSocket, WebSocketServer } from "ws";

import { ProgressTrack } from "../models/ProgressTrack";

let wss: WebSocketServer;

const crewState: {
  progressTracks: ProgressTrack[];
} = {
  progressTracks: [],
};

export type SocketServer = NonNullable<
  NonNullable<ConstructorParameters<typeof WebSocketServer>[0]>["server"]
>;

export function startWebSocketServer(server: SocketServer) {
  if (wss) return wss;
  wss = new WebSocketServer({ server, path: "/wss" });

  wss.on("connection", (client) => {
    initClient(client);

    client.on("message", (data) => {
      try {
        const operation = JSON.parse(String(data));
        jsonPatch.applyOperation(crewState, operation);
        wss.clients.forEach(sendCrewState);
      } catch {
        client.terminate();
      }
    });
  });

  return wss;
}

function initClient(client: WebSocket) {
  let timeout: NodeJS.Timeout;

  if (client.readyState === client.OPEN) {
    sendCrewState(client);
    timeout = heartbeat(client);
  } else {
    client.on("open", () => {
      sendCrewState(client);
      timeout = heartbeat(client);
    });
  }

  client.on("close", () => {
    clearTimeout(timeout);
  });
}

function sendCrewState(client: WebSocket) {
  client.send(JSON.stringify(crewState));
}

function heartbeat(client: WebSocket) {
  let ponged = false;
  client.once("pong", () => {
    ponged = true;
  });
  client.ping();

  return setTimeout(() => {
    if (ponged) {
      heartbeat(client);
    } else {
      client.terminate();
    }
  }, 30000);
}
