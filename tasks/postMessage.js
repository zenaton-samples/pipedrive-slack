const slack = require("../clients/slack");

module.exports.handle = async (channel, text) => {
  return (
    await slack.post("/chat.postMessage", {
      text,
      channel,
      as_user: false
    })
  ).data;
};
