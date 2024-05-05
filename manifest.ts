import { Manifest } from "deno-slack-sdk/mod.ts";
import CreateIssueDefinition from "./functions/create_issue/definition.ts";
import CreateNewIssueWorkflow from "./workflows/create_new_issue.ts";
import ReactionCreateNewIssueWorkflow from "./workflows/reaction_create_new_issue.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/future/manifest
 */
export default Manifest({
  name: "github-functions-app",
  description: "A blank template for building Slack apps with Deno",
  icon: "assets/default_new_app_icon.png",
  functions: [CreateIssueDefinition],
  workflows: [CreateNewIssueWorkflow, ReactionCreateNewIssueWorkflow],
  /**
   * if your organistaion uses a separate Github enterprise domain, then add
   * the github api url here so your function can access github api
   */
  outgoingDomains: ["api.github.com"],
  botScopes: ["commands", "chat:write", "chat:write.public", "reactions:read"],
});
