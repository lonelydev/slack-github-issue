import { SlackFunction } from "deno-slack-sdk/mod.ts";
import CreateIssueDefinition from "./definition.ts";
import Logger from "https://deno.land/x/logger@v1.1.5/logger.ts";

/**
 * The mod.ts filename is a convention to declare the entry point
 * to your function in functions/create_issue.
 * https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#create-an-issue
 */

export default SlackFunction(
  CreateIssueDefinition,
  async ({ inputs, env }) => {
    const headers = {
      Accept: "application/vnd.github+json",
      Authorization: "Bearer " + env.GITHUB_TOKEN,
      "Content-Type": "application/json",
    };
    const inputObjectString = JSON.stringify(inputs, null, 2);
    const logger = new Logger();

    logger.info("[create_issue] inputs: ", inputObjectString);
    // destructure all inputs
    const { url, title, description, assignees } = inputs;

    try {
      logger.info("[create_issue] url: ", url);
      const urlObject = new URL(url);
      const urlObjectString = JSON.stringify(urlObject, null, 2);
      logger.info(
        "[create_issue] urlObject: ",
        urlObjectString,
      );

      const { hostname, pathname } = new URL(url);

      logger.info("[create_issue] hostname: ", hostname);
      logger.info("[create_issue] pathname: ", pathname);

      const [_, owner, repo] = pathname.split("/");

      logger.info("[create_issue] _:", _);
      logger.info("[create_issue] owner: ", owner);
      logger.info("[create_issue] repo: ", repo);

      const apiURL = hostname === "github.com"
        ? "api.github.com"
        : `${hostname}/api/v3`;
      const issueEndpoint = `https://${apiURL}/repos/${owner}/${repo}/issues`;

      const body = JSON.stringify({
        title,
        body: description,
        assignees: assignees?.split(",").map((assignee: string) => {
          return assignee.trim();
        }),
      });

      logger.info("[create_issue] Making a call to: ", issueEndpoint);

      const issue = await fetch(issueEndpoint, {
        method: "POST",
        headers,
        body,
      }).then((res: Response) => {
        if (res.status === 201) return res.json();
        else throw new Error(`${res.status}: ${res.statusText}`);
      });

      /**
       * response schema:
       * https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#create-an-issue
       */

      return {
        outputs: {
          GitHubIssueNumber: issue.number,
          GitHubIssueLink: issue.html_url,
        },
      };
    } catch (err) {
      logger.error(err);
      return {
        error:
          `An error was encountered during issue creation: \`${err.message}\``,
      };
    }
  },
);
