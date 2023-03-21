export default defineNuxtPlugin(() => {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const host = window.location.host;
  const socket = ref(new WebSocket(`${protocol}//${host}`));

  window.addEventListener("focus", () => {
    const { readyState, OPEN, CONNECTING } = socket.value;
    if (readyState === CONNECTING || readyState === OPEN) {
      return;
    }
    socket.value = new WebSocket(`${protocol}//${host}`);
  });

  return {
    provide: {
      socket,
    },
  };
});
