import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { useFetch } from "./lib/useFetch";
import { useParser } from "./lib/useParser";
import type { Bindings, Attachment, Payload } from "./types";

const app = new Hono<{ Bindings: Bindings }>();

const targetUrl = "https://github.com/trending/typescript?since=daily";

const feeding = async (
	slackBotToken: string,
	slackBotTargetChannelName: string,
): Promise<string> => {
	console.log("start fetching...");
	const result = await useFetch({
		url: targetUrl,
		options: {},
	});
	console.log(result);

	const repos = {
		articles: await useParser(result),
	};
	const attachment: Attachment = {
		title: "GitHub Trending [ TypeScript ] ",
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
	const repos = await feeding(
		process.env.SLACK_BOT_ACCESS_TOKEN,
		process.env.SLACK_BOT_ACCESS_CHANNEL,
	);
	return c.text(repos);
});

export const handler = handle(app);
