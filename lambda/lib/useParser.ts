import { parse, type HTMLElement } from "node-html-parser";

interface RepoInfo {
  rank: number;
  title: string;
  link: string;
}

export const useParser = async (body: string): Promise<Array<RepoInfo>> => {
  const root: HTMLElement = parse(body);

  // NOTE: querySelectorAllよりgetElementsByTagNameが速い
  const articles: Array<HTMLElement> = root.getElementsByTagName("h2");

  if (!articles || articles.length === 0) {
    return Promise.resolve<RepoInfo[]>([]);
  }

  const dirtyRepoTitles: Array<string> =
    selectRepoNamesFromHtmlElements(articles);

  const trends = await Promise.all(
    dirtyRepoTitles.map((textDirty, idx) => {
      const repoName = textDirty ? cleanInnerText(textDirty) : "";

      return {
        rank: idx + 1,
        title: repoName,
        link: `https://github.com/${repoName}`,
      };
    }),
  );

  return trends;
};

/**
 * innerTextにはspanタグなど由来の\nや\sが紛れ込むので取っ払う
 */
const cleanInnerText = (innerText: string): string => {
  return innerText.replace(/\n/g, "").replace(/\s/g, "");
};

/**
 * h2タグにはリポジトリ名以外のものも含まれるので、それを排除する。
 * "userName / repoName" となっていればリポジトリ名なので、
 * "/"の有無で識別する。
 */
const selectRepoNamesFromHtmlElements = (
  h2Elements: Array<HTMLElement>,
): Array<string> => {
  return h2Elements
    .map((htmlElement) => String(htmlElement.textContent))
    .filter((text) => text.includes("/"));
};
