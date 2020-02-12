const axios = require("axios");

module.exports.handle = async text => {
  return (
    await axios.post(process.env.SLACK_INCOMING_WEBHOOK, {
      text
    })
  ).data;
};
