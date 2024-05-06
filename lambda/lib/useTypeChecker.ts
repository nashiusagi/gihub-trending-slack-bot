import { type ProgramLanguageType, ProgramLanguagesArray } from "../types";

export const useTypeChecker = () => {
  const isTargetProgramLanguage = (
    language: string,
  ): language is ProgramLanguageType => {
    return ProgramLanguagesArray.some((value) => value === language);
  };

  return { isTargetProgramLanguage };
};
