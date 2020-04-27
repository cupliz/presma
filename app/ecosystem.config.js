module.exports = {
  apps: [{
    name: "presma-app",
    script: "serve",
    env: {
      PM2_SERVE_PATH: 'build',
      PM2_SERVE_PORT: 4400,
      PM2_SERVE_SPA: 'true',
      PM2_SERVE_HOMEPAGE: './index.html',
    },
  }]
}
