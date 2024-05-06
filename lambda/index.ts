import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { HTTPException } from "hono/http-exception";
import { useFetch } from "./lib/useFetch";
import { useParser } from "./lib/useParser";
import {
  type Bindings,
  type Attachment,
  type Payload,
  type ProgramLanguageType,
  ProgramLanguagesArray,
} from "./types";

const app = new Hono<{ Bindings: Bindings }>();

const buildTargetUrl = (lang: ProgramLanguageType): string =>
  `https://github.com/trending/${lang}?since=daily`;

const feeding = async (
  slackBotToken: string,
  slackBotTargetChannelName: string,
  lang: ProgramLanguageType,
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

const isTargetProgramLanguage = (
  language: string,
): language is ProgramLanguageType => {
  return ProgramLanguagesArray.some((value) => value === language);
};

app.get("/", async (c) => {
  const trendingRepos = await Promise.all(
    ProgramLanguagesArray.map((lang) => {
      return feeding(
        process.env.SLACK_BOT_ACCESS_TOKEN ?? "",
        process.env.SLACK_BOT_ACCESS_CHANNEL ?? "",
        lang,
      );
    }),
  );
  return c.text(String(trendingRepos));
});

app.get("/:language", async (c) => {
  const language: string = c.req.param("language");
  if (!isTargetProgramLanguage(language)) {
    throw new HTTPException(400, { message: "Unsupported Language" });
  }

  const repos = await feeding(
    process.env.SLACK_BOT_ACCESS_TOKEN ?? "",
    process.env.SLACK_BOT_ACCESS_CHANNEL ?? "",
    language,
  );

  return c.text(repos);
});

export const handler = handle(app);
