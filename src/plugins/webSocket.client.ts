export default defineNuxtPlugin(() => {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const host = window.location.host;
  const socket = ref(new WebSocket(`${protocol}//${host}/wss`));

  window.addEventListener("focus", () => {
    const { readyState, CONNECTING, OPEN, CLOSING, CLOSED } = socket.value;
    console.log({ CONNECTING, OPEN, CLOSING, CLOSED, readyState });
    if (readyState === CONNECTING || readyState === OPEN) {
      console.log("still connected");
      return;
    }
    console.log("making new websocket");
    socket.value = new WebSocket(`${protocol}//${host}`);
  });

  return {
    provide: {
      socket,
    },
  };
});
