import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";

const CreateIssueDefinition = DefineFunction({
  callback_id: "create_issue",
  title: "Create GitHub Issue",
  description: "Create a new GitHub issue in a repository",
  source_file: "functions/create_issue/mod.ts",
  input_parameters: {
    properties: {
      url: {
        type: Schema.types.string,
        description: "Repository URL",
      },
      title: {
        type: Schema.types.string,
        description: "Issue Title",
      },
      description: {
        type: Schema.types.string,
        description: "Issue Description",
      },
      assignees: {
        type: Schema.types.string,
        description: "Assignees",
      },
    },
    required: ["url", "title"],
  },
  output_parameters: {
    properties: {
      GitHubIssueNumber: {
        type: Schema.types.number,
        description: "Issue number",
      },
      GitHubIssueLink: {
        type: Schema.types.string,
        description: "Issue link",
      },
    },
    required: ["GitHubIssueLink", "GitHubIssueNumber"],
  },
});

export default CreateIssueDefinition;
