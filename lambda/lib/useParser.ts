import { parse } from "node-html-parser";

export const useParser = async (body: string) => {
	const root = parse(body);

	// querySelectorAllよりgetElementsByTagNameが速い
	const articles = root.getElementsByTagName("h2");

	const trends = await Promise.all(
		articles
			?.map((element) => String(element.textContent))
			.filter((text) => text.includes("/"))
			.map((textDirty, idx) => {
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
