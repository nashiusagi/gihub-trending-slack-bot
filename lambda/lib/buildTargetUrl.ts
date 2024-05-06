import type { ProgramLanguageType } from "../types";

export const buildTargetUrl = (lang: ProgramLanguageType): string =>
  `https://github.com/trending/${lang}?since=daily`;
