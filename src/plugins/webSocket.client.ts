export default defineNuxtPlugin(() => {
  let socket: WebSocket;
  if (process.dev) {
    socket = new WebSocket("ws://localhost:3001");
  } else {
    socket = new WebSocket(`wss://${window.location.host}`);
  }

  return {
    provide: {
      socket,
    },
  };
});
