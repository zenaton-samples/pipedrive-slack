const axios = require("axios");

const client = axios.create({
  baseURL: "https://slack.com/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.SLACK_API_TOKEN}`
  }
});

module.exports = client;
