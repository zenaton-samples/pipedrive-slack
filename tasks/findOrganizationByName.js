const pipedrive = require("../clients/pipedrive");

module.exports.handle = async name => {
  const orgs = (
    await pipedrive.get("/organizations/find", {
      params: { term: name }
    })
  ).data.data;

  return orgs && orgs.length > 0 ? orgs[0] : null;
};
