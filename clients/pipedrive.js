const axios = require("axios");

const client = axios.create({
  baseURL: "https://api.pipedrive.com/v1",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

client.interceptors.request.use(config => {
  config.params = {
    api_token:
      process.env.PIPEDRIVE_API_TOKEN,
    ...config.params
  };
  return config;
});

module.exports = client;
