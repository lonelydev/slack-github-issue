import { Trigger } from "deno-slack-api/types.ts";
import {
  TriggerContextData,
  TriggerEventTypes,
  TriggerTypes,
} from "deno-slack-api/mod.ts";

import ReactionCreateNewIssueWorkflow from "../workflows/reaction_create_new_issue.ts";

/**
 * get channelIds where reactions have to be listened to
 * This is expected to be stored as the app is configured.
 */
function getChannelIds(): string[] {
  return ["C06TPNJ88H4"];
}

/**
 * All about event triggers here:
 * https://api.slack.com/automation/triggers/event
 *
 * In order to create an event trigger, you need to provide:
 * - type - TriggerTypes.Event
 * - name
 * - workflow: path to the workflow that's triggered
 * - description
 * - inputs: to the workflow, can use with event response object
 * - event: event object
 */
const reactionCreateNewIssueTrigger: Trigger<
  typeof ReactionCreateNewIssueWorkflow.definition
> = {
  name: "Reactji added",
  type: TriggerTypes.Event,
  workflow:
    `#/workflows/${ReactionCreateNewIssueWorkflow.definition.callback_id}`,
  description: "a reaction was added to a message",
  event: {
    event_type: TriggerEventTypes.ReactionAdded,
    channel_ids: ["C06TPNJ88H4"],
  },
  inputs: {
    userId: {
      value: TriggerContextData.Event.ReactionAdded.user_id,
    },
    channelId: {
      value: TriggerContextData.Event.ReactionAdded.channel_id,
    },
    messageTs: {
      value: TriggerContextData.Event.ReactionAdded.message_ts,
    },
    messageCtx: {
      value: TriggerContextData.Event.ReactionAdded.message_context,
    },
    reaction: {
      value: TriggerContextData.Event.ReactionAdded.reaction,
    },
  },
};

export default reactionCreateNewIssueTrigger;
