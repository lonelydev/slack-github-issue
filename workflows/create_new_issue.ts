import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import CreateIssueDefinition from "../functions/create_issue/definition.ts";
import schema_types from "deno-slack-sdk/schema/slack/schema_types.ts";

const CreateNewIssueWorkflow = DefineWorkflow({
  callback_id: "create_new_issue_workflow",
  title: "Create new GitHub Issue",
  description: "Create a new GitHub Issue",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["interactivity", "channel"],
  },
});

/**
 * 1. Open a form
 */

const issueFormData = CreateNewIssueWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Create an issue",
    interactivity: CreateNewIssueWorkflow.inputs.interactivity,
    submit_label: "Create",
    description: "Create a new issue inside a GitHub repository",
    fields: {
      elements: [
        {
          name: "url",
          title: "Repository URL",
          description: "The GitHub URL of the repository",
          type: Schema.types.string,
        },
        {
          name: "title",
          title: "Issue title",
          type: Schema.types.string,
        },
        {
          name: "description",
          title: "Issue Description",
          type: Schema.types.string,
        },
        {
          name: "assignees",
          title: "Issue assignees",
          type: Schema.types.string,
        },
      ],
      required: ["url", "title"],
    },
  },
);

/**
 * 2. Call function to create new issue
 * This step uses the output of the previous step. In a workflow, a step can access values
 * from its previous step.
 */

const gitHubIssue = CreateNewIssueWorkflow.addStep(
  CreateIssueDefinition,
  {
    url: issueFormData.outputs.fields.url,
    title: issueFormData.outputs.fields.title,
    description: issueFormData.outputs.fields.description,
    assignees: issueFormData.outputs.fields.assignees,
  },
);

/**
 * 3. Post issue number and link back to the channel
 */

CreateNewIssueWorkflow.addStep(
  Schema.slack.functions.SendMessage,
  {
    channel_id: CreateNewIssueWorkflow.inputs.channel,
    message:
      `Issue #${gitHubIssue.outputs.GitHubIssueNumber} has been created successfully. \n` +
      `Link to the issue: ${gitHubIssue.outputs.GitHubIssueLink}`,
  },
);

export default CreateNewIssueWorkflow;
