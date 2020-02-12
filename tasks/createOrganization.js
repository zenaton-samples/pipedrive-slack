const pipedrive = require("../clients/pipedrive");

module.exports.handle = async name => {
  return (await pipedrive.post("/organizations", { name: name })).data.data;
};
