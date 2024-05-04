import { expect, test } from "bun:test";
import { useFetch } from "../useFetch";

test("fetch", async () => {
	const result = await useFetch({
		url: "http://api.randomuser.me/",
		options: {},
	});

	expect(result).toBeTruthy(true);
});
