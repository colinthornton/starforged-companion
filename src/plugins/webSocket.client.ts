export default defineNuxtPlugin(() => {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const host = window.location.host;
  const socket = new WebSocket(`${protocol}//${host}`);

  return {
    provide: {
      socket,
    },
  };
});
