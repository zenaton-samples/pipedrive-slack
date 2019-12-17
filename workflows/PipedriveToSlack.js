const pipedriveConnectorId = "<ENTER_YOUR_ZENATON_PIPEDRIVE_CONNECTOR_ID>";
const slackConnectorId = "<ENTER_YOUR_ZENATON_SLACK_CONNECTOR_ID>";
const slackChannel = "<ENTER_SLACK_CHANNEL_ID>";

let pipedrive = null;
let slack = null;

module.exports.handle = function*(user) {
  pipedrive = this.connector("pipedrive", pipedriveConnectorId);
  slack = this.connector("slack", slackConnectorId);

  let person = yield* findOneByEmail(user.email);

  if (person === null) {
    // Create a person on pipedrive
    person = yield* createPerson(user);

    // Create an organization and link it to the person created before
    const organization = yield* createOrganization(user.companyName, person);

    // Create a deal and add the organization and person in charge in it
    yield* createDeal(person, organization);

    // Send a slack message warning the internal team of a new lead
    yield* sendSlack(
      slackChannel,
      `A new user has signed-up: ${user.email} ${user.name} working at ${user.companyName}`
    );
  } else {
    // Create a deal and add the organization and person in charge in it
    const deal = yield* createDeal(person, person.org_name);

    // Add a note
    yield* addNote(person, deal);

    // Send a slack message warning the internal team of a new lead
    yield* sendSlack(
      slackChannel,
      `An existing user you already know has signed-up: ${user.email} ${user.name}: congrats! :) `
    );
  }

  // Wait for 5 seconds
  yield this.wait.for(5);

  // Send a follow-up slack message to the SDR
  yield* sendSlack(
    slackChannel,
    `Following his registration, the user ${user.email} needs to be contacted again`
  );
};

function* createPerson(user) {
  return (yield pipedrive.post("/persons", {
    body: {
      name: user.name,
      email: user.email
    }
  })).data.data;
}

function* createOrganization(name, person) {
  return (yield pipedrive.post("/organizations", {
    body: {
      name: name,
      owner_id: person.id
    }
  })).data.data;
}

function* createDeal(person, organization) {
  return (yield pipedrive.post("/deals", {
    body: {
      title: `${organization.name}'s Deal`,
      person_id: person.id,
      org_id: organization.id
    }
  })).data.data;
}

function* sendSlack(channel, text) {
  return yield slack.post("chat.postMessage", {
    body: {
      text,
      as_user: false,
      channel
    }
  });
}

function* findOneByEmail(email) {
  return (yield pipedrive.get("/persons/find", {
    query: {
      term: email,
      search_by_email: true
    }
  })).data.data[0];
}

function* addNote(user, deal) {
  return yield pipedrive.post("/notes", {
    body: {
      content: "This user has registered to the platform",
      user_id: user.id,
      deal_id: deal.id
    }
  });
}
