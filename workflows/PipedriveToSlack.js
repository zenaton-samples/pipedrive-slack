const pipedriveConnectorId = "76e13b10-2c94-4367-b258-a636a2ebb795";
const slackConnectorId = "104eb6e0-1cd4-11ea-9b7a-c17d2986804f";
const slackChannel = "CP5JDFLQ0";

let pipedrive = null;
let slack = null;

module.exports.handle = function*(user, dealDetails) {
  pipedrive = this.connector("pipedrive", pipedriveConnectorId);
  slack = this.connector("slack", slackConnectorId);

  // Create a person on pipedrive
  const person = yield* createPerson(user);

  // Create an organization and link it to the person created before
  const organization = yield* createOrganization(user.companyName, person);

  // Create a deal and add the organization and person in charge in it
  const deal = yield* createDeal(dealDetails, person, organization);

  // Send a slack message warning the internal team of a new lead
  yield* sendSlack(slackChannel, "New lead");

  // Create activity in pipedrive to follow up the lead
  yield* createActivities("New lead", deal, dealDetails)
};

function* createPerson(user) {
  return (yield pipedrive.post("/persons", {
    body: {
      name: user.name,
      email: user.email
    }
  })).data.data;
};

function* createOrganization(organizationName, person) {
  return (yield pipedrive.post("/organizations", {
    body: {
      name: organizationName,
      owner_id: person.id
    }
  })).data.data;
};

function* createDeal(deal, person, organization) {
  return (yield pipedrive.post("/deals", {
    body: {
      title: deal.name,
      person_id: person.id,
      org_id: organization.id
    }
  })).data.data;
};

function* sendSlack(channel, text) {
  return yield slack.post("chat.postMessage", {
    body: {
      text,
      as_user: false,
      channel
    }
  });
};

function* createActivities(subject, deal, dealDetails) {
  return yield pipedrive.post("/activities", {
    body: {
      subject: subject,
      deal_id: deal.id,
      due_date: dealDetails.due_date,
      due_time: dealDetails.due_time
    }
  });
};
