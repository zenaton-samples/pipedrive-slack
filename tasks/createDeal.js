const pipedrive = require("../clients/pipedrive");

module.exports.handle = async (org, person) => {
  return (
    await pipedrive.post("/deals", {
      title: `${org.name}'s Deal`,
      person_id: person.id,
      org_id: org.id
    })
  ).data.data;
};
