import Markdown from "./MarkdownRender";

const normalizeMarkdown = (content) => {
	if (!content) return "";
	return (
		content
			// Replace 2+ consecutive blank lines with a single blank line
			.replace(/\n{3,}/g, "\n\n")
			// Remove blank lines between list items (the main culprit)
			.replace(/(\n[*\-\d][^\n]*)\n\n(?=[*\-\d])/g, "$1\n")
			.replace(/(\n\d+\.[^\n]*)\n\n(?=\d+\.)/g, "$1\n")
	);
};

const ContentView = ({ content }) => (
	<div className="max-w-none py-6">
		<Markdown>{normalizeMarkdown(content)}</Markdown>
	</div>
);

export default ContentView;
