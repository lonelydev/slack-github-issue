import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

const ReactionCreateNewIssueWorkflow = DefineWorkflow({
  callback_id: "reaction_create_new_issue_workflow",
  title: "Creates a new GitHub Issue",
  description: "Create new GitHub Issue",
  input_parameters: {
    properties: {
      userId: { type: Schema.slack.types.user_id },
      channelId: { type: Schema.slack.types.channel_id },
      messageTs: { type: Schema.types.string },
      reaction: { type: Schema.types.string },
      messageCtx: { type: Schema.slack.types.message_context },
    },
    required: ["channelId", "messageTs", "reaction", "userId"],
  },
});

export default ReactionCreateNewIssueWorkflow;
