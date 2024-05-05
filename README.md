# Slack app to create Github Issues

This is actually a follow along of the [GitHub Issue](https://api.slack.com/tutorials/tracks/create-github-issues-in-workflows) 
slack app tutorial. This was created from the [blank template](#clone-the-template) using Slack CLI.

I modified the README.md to match the instructions in the slack tutorial where possible.

**Guide Outline**:

- [Blank Template](#blank-template)
  - [Setup](#setup)
    - [Install the Slack CLI](#install-the-slack-cli)
    - [Clone the Template](#clone-the-template)
  - [Create GitHub PAT](#create-github-pat)
  - [Architect the solution](#architect-the-solution)
    - [Define the custom function](#define-the-custom-function)
    - [Scaffold the workflow](#scaffold-the-workflow)
    - [Make the manifest](#make-the-manifest)
    - [Add steps and define Function](#add-steps-and-define-function)
    - [Create a trigger](#create-a-trigger)
  - [Running Your Project Locally](#running-your-project-locally)
  - [Creating Triggers](#creating-triggers)
    - [Link Triggers](#link-triggers)
    - [Manual Trigger Creation](#manual-trigger-creation)
  - [Datastores](#datastores)
  - [Testing](#testing)
  - [Deploying Your App](#deploying-your-app)
  - [Viewing Activity Logs](#viewing-activity-logs)
  - [Project Structure](#project-structure)
    - [`.slack/`](#slack)
    - [`datastores/`](#datastores-1)
    - [`functions/`](#functions)
    - [`triggers/`](#triggers)
    - [`workflows/`](#workflows)
    - [`manifest.ts`](#manifestts)
    - [`slack.json`](#slackjson)
  - [Resources](#resources)

---

## Status as of today

So I tried creating a simple reaction trigger on top of the original shortcut workflow which works fine today.

The reaction trigger consistently failed every time stating `invalid_statement` as an error. I'm unable to find much help to proceed on slack documentation. I have tried some variations of the event trigger's filter to make this work. However, that has not changed anything.

I feel like I am spending way too much time trying to figure this out. So I'm going to park this here.

| Trigger | Function | Workflow |
| ------- | -------- | -------- |
| [[`reaction_create_new_issue.ts`](/triggers/reaction_create_new_issue.ts) | NA | [`reaction_create_new_issue.ts`](/workflows/reaction_create_new_issue.ts) |

The project was created by following [Github Issues Tutorial](https://api.slack.com/tutorials/tracks/create-github-issues-in-workflows) on Slack Developer portal.

## Setup

Before getting started, first make sure you have a development workspace where
you have permission to install apps. **Please note that the features in this
project require that the workspace be part of
[a Slack paid plan](https://slack.com/pricing).**

### Install the Slack CLI

To use this template, you need to install and configure the Slack CLI.
Step-by-step instructions can be found in our
[Quickstart Guide](https://api.slack.com/automation/quickstart).

### Clone the Template

Start by cloning this repository:

```zsh
# Clone this project onto your machine
$ slack create my-app -t slack-samples/deno-blank-template

# Change into the project directory
$ cd my-app
```

## Create GitHub PAT

Read more about setting up a [GitHub Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).

There are *Fine-grained Tokens* and *Tokens (classic)*. I chose to create the latter as that's how the slack tutorial described
the permissions to the app. The fine-grained token settings make it really difficult to map the scopes listed there to the ones described in the slack tutorial.

Created a personal access token (classic) named `slack-github-functions-app` with an expiry date of 30 days. The following scopes were granted:

- `public_repo`, `repo:invite`
- `read:org`
- `read:user`, `user:email`
- `read:enterprise`

Save this access token in something like 1Password for access later.

## Architect the solution

Look at the solution at a high level. What do we need to do? What is the structure of the application? 

### Define the custom function

The workflow must create a new GitHub issue. So let's define the custom function that does just that.

In order to create a GitHub issue, we need to know the following:

- GitHub repository
- Description of the issue

Once the issue is created, the function should output:

- an issue number
- a link to the issue

Checkout `functions/create_issue/definition.ts`.

### Scaffold the workflow

Create a skeleton of the workflow. It has to have a couple of steps:

- Open a form to seek input regarding the issue
- Create the issue
- Post the issue number and link back to the user

Checkout `workflows/create_new_issue.ts`.

### Make the manifest

Import the function, the workflow and include any outside urls.

### Add steps and define Function

Add the steps to your workflow and define the function.

Checkout `functions/create_issue/mod.ts`

### Create a trigger

Triggers are what calls your workflows. A workflow can have multiple triggers.

Checkout `triggers/create_new_issue_shortcut.ts`.

Run the trigger create command in your terminal:

```zsh
slack trigger create --trigger-def "triggers/create_new_issue_shortcut.ts"
```

This should give you a shortcut URL to trigger your workflow. Save it for testing.

## Running Your Project Locally

While building your app, you can see your changes appear in your workspace in
real-time with `slack run`. You'll know an app is the development version if the
name has the string `(local)` appended.

```zsh
# Run app locally
$ slack run

Connected, awaiting events
```

To stop running locally, press `<CTRL> + C` to end the process.

## Creating Triggers

[Triggers](https://api.slack.com/automation/triggers) are what cause workflows
to run. These triggers can be invoked by a user, or automatically as a response
to an event within Slack.

When you `run` or `deploy` your project for the first time, the CLI will prompt
you to create a trigger if one is found in the `triggers/` directory. For any
subsequent triggers added to the application, each must be
[manually added using the `trigger create` command](#manual-trigger-creation).

When creating triggers, you must select the workspace and environment that you'd
like to create the trigger in. Each workspace can have a local development
version (denoted by `(local)`), as well as a deployed version. _Triggers created
in a local environment will only be available to use when running the
application locally._

### Link Triggers

A [link trigger](https://api.slack.com/automation/triggers/link) is a type of
trigger that generates a **Shortcut URL** which, when posted in a channel or
added as a bookmark, becomes a link. When clicked, the link trigger will run the
associated workflow.

Link triggers are _unique to each installed version of your app_. This means
that Shortcut URLs will be different across each workspace, as well as between
[locally run](#running-your-project-locally) and
[deployed apps](#deploying-your-app).

With link triggers, after selecting a workspace and environment, the output
provided will include a Shortcut URL. Copy and paste this URL into a channel as
a message, or add it as a bookmark in a channel of the workspace you selected.
Interacting with this link will run the associated workflow.

**Note: triggers won't run the workflow unless the app is either running locally
or deployed!**

### Manual Trigger Creation

To manually create a trigger, use the following command:

```zsh
$ slack trigger create --trigger-def triggers/<YOUR_TRIGGER_FILE>.ts
```

## Datastores

For storing data related to your app, datastores offer secure storage on Slack
infrastructure. The use of a datastore requires the
`datastore:write`/`datastore:read` scopes to be present in your manifest.

## Testing

Test filenames should be suffixed with `_test`.

Run all tests with `deno test`:

```zsh
$ deno test
```

## Deploying Your App

Once development is complete, deploy the app to Slack infrastructure using
`slack deploy`:

```zsh
$ slack deploy
```

When deploying for the first time, you'll be prompted to
[create a new link trigger](#creating-triggers) for the deployed version of your
app. When that trigger is invoked, the workflow should run just as it did when
developing locally (but without requiring your server to be running).

## Viewing Activity Logs

Activity logs of your application can be viewed live and as they occur with the
following command:

```zsh
$ slack activity --tail
```

## Project Structure

### `.slack/`

Contains `apps.dev.json` and `apps.json`, which include installation details for
development and deployed apps.

### `datastores/`

[Datastores](https://api.slack.com/automation/datastores) securely store data
for your application on Slack infrastructure. Required scopes to use datastores
include `datastore:write` and `datastore:read`.

### `functions/`

[Functions](https://api.slack.com/automation/functions) are reusable building
blocks of automation that accept inputs, perform calculations, and provide
outputs. Functions can be used independently or as steps in workflows.

### `triggers/`

[Triggers](https://api.slack.com/automation/triggers) determine when workflows
are run. A trigger file describes the scenario in which a workflow should be
run, such as a user pressing a button or when a specific event occurs.

### `workflows/`

A [workflow](https://api.slack.com/automation/workflows) is a set of steps
(functions) that are executed in order.

Workflows can be configured to run without user input or they can collect input
by beginning with a [form](https://api.slack.com/automation/forms) before
continuing to the next step.

### `manifest.ts`

The [app manifest](https://api.slack.com/automation/manifest) contains the app's
configuration. This file defines attributes like app name and description.

### `slack.json`

Used by the CLI to interact with the project's SDK dependencies. It contains
script hooks that are executed by the CLI and implemented by the SDK.

## Resources

To learn more about developing automations on Slack, visit the following:

- [Automation Overview](https://api.slack.com/automation)
- [CLI Quick Reference](https://api.slack.com/automation/cli/quick-reference)
- [Samples and Templates](https://api.slack.com/automation/samples)
