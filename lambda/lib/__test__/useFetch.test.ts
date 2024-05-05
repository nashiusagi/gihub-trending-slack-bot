import { expect, test } from "bun:test";
import { useFetch } from "../useFetch";

test("fetch", async () => {
  const result = await useFetch({
    url: "http://api.randomuser.me/",
    options: {},
  });
  const resultJson = JSON.parse(result);

  expect(resultJson.results.length).toBe(1);
});
