import { expect, test } from "bun:test";
import { useFetch } from "../useFetch";

test("fetch", async () => {
  const result = await useFetch({
    url: "http://api.randomuser.me/",
    options: {},
  });
  console.log(result)

  expect(result).toBeTruthy(true);
});
