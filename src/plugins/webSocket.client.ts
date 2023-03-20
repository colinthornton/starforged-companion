export default defineNuxtPlugin(() => {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const host = window.location.host;
  const socket = ref(new WebSocket(`${protocol}//${host}`));

  window.addEventListener("focus", () => {
    if (socket.value.readyState !== socket.value.OPEN) {
      socket.value = new WebSocket(`${protocol}//${host}`);
    }
  });

  return {
    provide: {
      socket,
    },
  };
});
