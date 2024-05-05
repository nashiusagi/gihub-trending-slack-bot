import { expect, test } from "bun:test";
import { useFetch } from "../useFetch";

test("useFetchのテスト", async () => {
  const result = await useFetch({
    url: "http://api.randomuser.me/",
    options: {},
  });
  const resultJson = JSON.parse(result);

  expect(resultJson.results.length).toBe(1);
});

test("リソースが存在しないとき、404が返ってくる", async () => {
  const NO_RESOURCE_URL = "http://api.randomuser.me/test";

  const result = await useFetch({
    url: NO_RESOURCE_URL,
    options: {},
  });

  expect(result).toBe("Not Found");
});

test("fetch error", async () => {
  const INVALID_URL = "http://api.test.me";

  const result = await useFetch({
    url: INVALID_URL,
    options: {},
  });

  expect(result).toBe("Network Error");
});
