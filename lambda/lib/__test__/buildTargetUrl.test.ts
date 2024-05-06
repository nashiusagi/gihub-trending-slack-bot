import { expect, test, it } from "bun:test";
import { buildTargetUrl } from "../buildTargetUrl";

test("buildTargetUrlのテスト", async () => {
  it("言語名が渡された場合正常に値を返す", () => {
    const INPUT = "typescript";

    const targetUrl = buildTargetUrl(INPUT);

    expect(targetUrl).toBe(
      "https://github.com/trending/typescript?since=daily",
    );
  });
});
