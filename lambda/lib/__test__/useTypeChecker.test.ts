import { expect, test, it } from "bun:test";
import { useTypeChecker } from "../useTypeChecker";

const { isTargetProgramLanguage } = useTypeChecker();

test("isTargetProgramLanguageのテスト", async () => {
  it("設定した言語の場合、trueを返す", () => {
    const INPUT = "typescript";

    const output = isTargetProgramLanguage(INPUT);

    expect(output).toBeTruthy();
  });

  it("設定していない言語の場合、falseを返す", () => {
    const INPUT = "japanese";

    const output = isTargetProgramLanguage(INPUT);

    expect(output).toBeFalsy();
  });
});
