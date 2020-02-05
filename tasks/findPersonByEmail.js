const pipedrive = require("../clients/pipedrive");

module.exports.handle = async email => {
  const users = (
    await pipedrive.get("/persons/find", {
      params: { term: email, search_by_email: true }
    })
  ).data.data;

  return users && users.length > 0 ? users[0] : null;
};
