import { expect, test } from "bun:test";
import { useParser } from "../useParser";

const Body = `
<div>
  <article class='Box-row'><h2>\n    \n      \n    \n\n\n      \n        testUser /\n\n      test-repo\n  </h2></article>
  <article class='Box-row'><h2>test2 / test2-repo</h2></article>
  <article class='Box-row'><h2>test3 / test3-repo</h2></article>
</div>
`;

test("useParserのテスト", async () => {
  const result = await useParser(Body);
  console.log(result)

  expect(result.length).toBe(3);
});
