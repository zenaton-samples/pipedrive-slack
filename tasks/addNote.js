const pipedrive = require("../clients/pipedrive");

module.exports.handle = async (person, content) => {
  return (
    await pipedrive.post("/notes", {
      content: content,
      person_id: person.id,
      org_id: person.org_id
    })
  ).data.data;
};
