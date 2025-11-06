module.exports = {
  apps: [
    {
      name: "complexo-abilio-junqueira-frontend",
      cwd: __dirname,
      script: "npm",
      args: "start",
      watch: false,
      env_production: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};
