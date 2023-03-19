module.exports = {
  apps: [
    {
      name: "space.colinthornton.site",
      port: "3000",
      exec_mode: "cluster",
      instances: "max",
      script: "./.output/server/index.mjs",
    },
  ],
};
