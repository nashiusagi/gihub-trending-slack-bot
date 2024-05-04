import { parse } from "node-html-parser";

export const useParser = async (body: string) => {
	const startTime = Date.now();
	const root = parse(body);
	// querySelectorAllよりgetElementsByTagNameが速い
	const articles = root.getElementsByTagName("h2");
	console.log(articles);

	const trends = await Promise.all(
		articles
			?.map((element) => String(element.textContent))
			.filter((text) => text.includes("/"))
			.map((textDirty, idx) => {
				const repoName = textDirty ? cleanInnerText(textDirty) : "";
				console.log(repoName);

				return {
					rank: idx + 1,
					title: repoName,
					link: `https://github.com/${repoName}`,
				};
			}),
	);
	const endTime = Date.now();
	console.log("parsing time: ", endTime - startTime);

	return trends;
};

/**
 * innerTextにはspanタグなど由来の\nや\sが紛れ込むので取っ払う
 */
const cleanInnerText = (innerText: string): string => {
	return innerText.replace(/\n/g, "").replace(/\s/g, "");
};
