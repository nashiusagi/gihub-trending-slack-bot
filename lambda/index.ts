import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { useFetch } from "./lib/useFetch";
import { useParser } from "./lib/useParser";
import type { Bindings, Attachment, Payload, ProgramLanguage } from "./types";

const app = new Hono<{ Bindings: Bindings }>();

const buildTargetUrl = (lang: ProgramLanguage): string =>
  `https://github.com/trending/${lang}?since=daily`;

const feeding = async (
  slackBotToken: string,
  slackBotTargetChannelName: string,
  lang: ProgramLanguage,
): Promise<string> => {
  const result = await useFetch({
    url: buildTargetUrl(lang),
    options: {},
  });

  const repos = {
    articles: await useParser(result),
  };
  const attachment: Attachment = {
    title: `GitHub Trending [ ${lang} ] `,
    text: JSON.stringify(repos),
    author_name: "GitHub Trending Feeder",
    color: "#00FF00",
  };

  const payload: Payload = {
    channel: slackBotTargetChannelName,
    attachments: [attachment],
  };

  await useFetch({
    url: "https://slack.com/api/chat.postMessage",
    options: {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${slackBotToken}`,
        Accept: "application/json",
      },
    },
  });

  return JSON.stringify(repos);
};

app.get("/", async (c) => {
  const languages: Array<ProgramLanguage> = ["typescript", "scala", "go"];
  const trendingRepos = await Promise.all(
    languages.map((lang) => {
      return feeding(
        process.env.SLACK_BOT_ACCESS_TOKEN ?? "",
        process.env.SLACK_BOT_ACCESS_CHANNEL ?? "",
        lang,
      );
    }),
  );
  return c.text(String(trendingRepos));
});

export const handler = handle(app);
