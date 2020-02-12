const pipedrive = require("../clients/pipedrive");

module.exports.handle = async ({ name, email }, org) => {
  return (
    await pipedrive.post("/persons", {
      name: name,
      email: email,
      org_id: org.id
    })
  ).data.data;
};
