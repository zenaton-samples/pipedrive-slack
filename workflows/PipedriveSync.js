const { duration } = require("zenaton");

module.exports.handle = function*({ name, email, org_name }) {
  // Search for the organization in pipedrive
  let organization = yield this.run.task("FindOrganizationByName", org_name);
  if (!organization) {
    // Create the organization if it doesn't exist
    organization = yield this.run.task("CreateOrganization", org_name);
  }

  // Search for the person in pipedrive
  let person = yield this.run.task("FindPersonByEmail", email);
  if (!person) {
    // Create the person if it doesn't exist and link it to the organization
    person = yield this.run.task("CreatePerson", { name, email }, organization);

    // Create a deal and add the organization and assign a person to follow up
    yield this.run.task("CreateDeal", organization, person);

    // Send a slack message notifiying the team of a new lead
    yield this.run.task(
      "PostMessage",
      `A new user has signed-up: ${person.email[0].value} ${person.name} working at ${person.org_name}`
    );
  } else {
    // Send a slack message notifying team that an existing lead has signed up
    yield this.run.task(
      "PostMessage",
      `An existing lead has signed-up: ${person.email} ${person.name}: congrats! :) `
    );
  }

  // Add a note
  yield this.run.task(
    "AddNote",
    person,
    "This user has registered to the platform."
  );

  // Wait 2 days
  yield this.wait.for(duration.days(2));

  // Send a follow-up slack message to the SDR
  yield this.run.task(
    "PostMessage",
    `The lead ${person.name} signed up 2 days ago. Did you contact them?`
  );
};
