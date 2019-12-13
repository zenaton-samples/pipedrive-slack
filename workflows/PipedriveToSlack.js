const pipedriveConnectorId = "<ENTER_YOUR_ZENATON_PIPEDRIVE_CONNECTOR_ID>";
    const slackConnectorId = "<ENTER_YOUR_ZENATON_SLACK_CONNECTOR_ID>";
    const slackChannel = "<ENTER_SLACK_CHANNEL_ID>";
    
    let pipedrive = null;
    let slack = null;
    
    module.exports.handle = function*(user) {
      pipedrive = this.connector("pipedrive", pipedriveConnectorId);
      slack = this.connector("slack", slackConnectorId);
    
      // Create a person on pipedrive
      const person = yield* createPerson(user);
    this.aperson = person;
    
      // Create an organization and link it to the person created before
      const organization = yield* createOrganization(user.companyName, person);
    this.org = organization;
      // Create a deal and add the organization and person in charge in it
      const deal = yield* createDeal(person, organization);
    this.adeal = deal;
    
      // Send a slack message warning the internal team of a new lead
      yield* sendSlack(slackChannel, `A new user has signed-up: ${user.email} ${user.name} working at ${user.companyName}`);
    
      // Create activity in pipedrive to follow up the lead
      this.activity = yield* createActivities('New Lead', deal, user)
      
      
      // Wait for 2 days
      yield this.wait.for(2 * 24 * 3600)
    
      // Send a follow-up slack message to the SDR
      yield slack.post("chat.postMessage", `The user ${user.email} needs to be contacted `);
     
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
          title: organization.name,
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
    }
