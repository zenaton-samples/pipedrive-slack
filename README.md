# New user synch with Pipedrive (CRM) and Slack

This is an example of Zenaton project showcasing how you could synchronize your own backend and pipedrive (sales CRM).

## Development

The `boot.js` file is where you tell the Zenaton Agent where to find - by name - the source code of your tasks and workflows.

> If you add a task or a workflow to your project, do not forget to update the `boot.js` file.

Look at Zenaton documentation to learn how to implement [workflows](https://docs.zenaton.com/workflows/implementation/) and [tasks](https://docs.zenaton.com/tasks/implementation/).

## Run

### Requirements
A [Zenaton](https://app.zenaton.com/workflows) account.  

This example project uses Pipedrive API to sync your user data and Slack API to send a notification.

Before getting starting, make sure you have a Slack Incomming Webhook URL available to send the Slack notification.
If you don't have one yet, you can read the dedicated [Slack documentation](https://api.slack.com/messaging/webhooks)
to set up one.

You will also need a Pipedrive API key. If you don't have one yet, you can sign-in to your
Pipedrive account and get an API token [here](https://zenaton.pipedrive.com/settings/api).

### Starting the workflow

You can dispatch the workflows by name from within your application using [Zenaton API](https://docs.zenaton.com/client/graphql-api/).
They will be processed as soon as you run this project.

> Note: Workflows are dispatched in an environment (`AppEnv`) of your Zenaton application (`AppId`).
> They will be processed by this project, **if** you set it up with the same `AppId` and `AppEnv`. You must also provide an `Api Token`
> to authorize access to this application (found at https://app.zenaton.com/api)

### Run Locally

First, install dependencies:

```sh
npm install
```

Then, fill-in the environment variables referenced in the `.env` file.

Install a Zenaton Agent:

```sh
curl https://install.zenaton.com | sh
```

and run it:

```sh
zenaton listen --boot=boot.js
```
### Run on Heroku

Follow this button [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy), then fill in the env variables and click "deploy".

### Run in Docker

Create your `.env` file

```sh
cp -n .env.sample .env
```

and fill-in the environment variables referenced in the `.env` file.

Then start your container:

```sh
cd docker && docker-compose up
```

### Run on your hosting solution

Check our [documentation](https://docs.zenaton.com/going-to-production/) for more options (AWS, Google Cloud, Clever Cloud ...)

### Checking that your project is running

Whatever your installation method, you should see that a new Agent is listening from this url: https://app.zenaton.com/agents. If you do not
see it, please check again that you have selected the right application and environment.

## Dispatching Tasks and Workflows

### Using Zenaton API

The workflows can be dispatched by name from within your application using the [Zenaton API](https://docs.zenaton.com/client/graphql-api/) or our [Node.js SDK](https://github.com/zenaton/zenaton-node).

You can test it from your command line interface:

Dispatching a `PipedriveSync` workflow:

```bash
curl --request POST \
  --url https://gateway.zenaton.com/graphql \
  --header 'authorization: Bearer <API_TOKEN>' \
  --header 'content-type: application/json' \
  --data '{"query":"mutation($input: DispatchWorkflowInput!) {\n  dispatchWorkflow(input: $input) {\n    id\n  }\n}\n ","variables":{"input":{"appId":"<APP_ID>","environment":"dev","name":"PipedriveSync","input":"[{\"name\": \"John Cibot\", \"email\": \"john.cibot@gmail.com\", \"org_name\": \"Piedpiper\"}]"}}}'
```

> Do not forget to replace `<APP_ID>` and `<API_TOKEN>` by your Zenaton AppId and api token.

## Workflow Processing

Check your Zenaton [dashboard](https://app.zenaton.com/workflows) (if you do not see your dispatched tasks or workflows, please check that you have selected the right application and environment).
