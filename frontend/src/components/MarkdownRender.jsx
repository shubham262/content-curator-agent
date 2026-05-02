import { memo } from "react";

import Image from "next/image";

import "katex/dist/katex.min.css";
import { default as ReactMarkdown } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import "./markdown.css";

const baseComponents = {
	pre: ({ children }) => (
		<div className="code-block-wrapper">
			<pre className="markdown-pre">{children}</pre>
		</div>
	),
	hr: () => <hr className="markdown-hr" />,
	ol: ({ children, ...props }) => (
		<ol className="markdown-ol" {...props}>
			{children}
		</ol>
	),
	li: ({ children, ...props }) => (
		<li className="markdown-li" {...props}>
			{children}
		</li>
	),
	ul: ({ children, ...props }) => (
		<ul className="markdown-ul" {...props}>
			{children}
		</ul>
	),
	strong: ({ children, ...props }) => (
		<strong className="markdown-strong" {...props}>
			{children}
		</strong>
	),
	a: ({ children, ...props }) => (
		<a className="markdown-link" target="_blank" rel="noreferrer" {...props}>
			{children}
		</a>
	),
	h1: ({ children, ...props }) => (
		<h1 className="markdown-h1" {...props}>
			{children}
		</h1>
	),
	h2: ({ children, ...props }) => (
		<h2 className="markdown-h2" {...props}>
			{children}
		</h2>
	),
	h3: ({ children, ...props }) => (
		<h3 className="markdown-h3" {...props}>
			{children}
		</h3>
	),
	h4: ({ children, ...props }) => (
		<h4 className="markdown-h4" {...props}>
			{children}
		</h4>
	),
	h5: ({ children, ...props }) => (
		<h5 className="markdown-h5" {...props}>
			{children}
		</h5>
	),
	h6: ({ children, ...props }) => (
		<h6 className="markdown-h6" {...props}>
			{children}
		</h6>
	),
	p: ({ children, ...props }) => (
		<p className="markdown-p" {...props}>
			{children}
		</p>
	),
	img: ({ src, alt, ...props }) => (
		<div className="markdown-image-wrapper">
			<Image
				className="markdown-image"
				src={src}
				alt={alt || "img"}
				width={800}
				height={600}
				style={{ maxWidth: "100%", height: "auto", borderRadius: "12px" }}
				{...props}
			/>
		</div>
	),
	table: ({ children, ...props }) => (
		<div className="markdown-table-container">
			<table className="markdown-table" {...props}>
				{children}
			</table>
		</div>
	),
	thead: ({ children, ...props }) => (
		<thead className="markdown-thead" {...props}>
			{children}
		</thead>
	),
	th: ({ children, ...props }) => (
		<th className="markdown-th" {...props}>
			{children}
		</th>
	),
	td: ({ children, ...props }) => (
		<td className="markdown-td" {...props}>
			{children}
		</td>
	),
	tr: ({ children, ...props }) => (
		<tr className="markdown-tr" {...props}>
			{children}
		</tr>
	),
	blockquote: ({ children, ...props }) => (
		<blockquote className="markdown-blockquote" {...props}>
			{children}
		</blockquote>
	),
	code({ inline, className, children, ...props }) {
		const match = /language-(\w+)/.exec(className || "");
		return !inline && match ? (
			<SyntaxHighlighter
				style={oneLight}
				language={match[1]}
				PreTag="div"
				customStyle={{
					margin: 0,
					padding: "16px",
					borderRadius: "8px",
					fontSize: "14px",
					lineHeight: "1.5",
					backgroundColor: "#f8fafc",
					border: "1px solid #e2e8f0",
				}}
			>
				{String(children).replace(/\n$/, "")}
			</SyntaxHighlighter>
		) : (
			<code className="markdown-inline-code" {...props}>
				{children}
			</code>
		);
	},
};

const remarkPlugins = [remarkGfm, remarkMath];
const rehypePlugins = [rehypeKatex];

const NonMemoizedMarkdown = ({
	className = "",
	children,
	userType = "assistant",
}) => {
	return (
		<div className={`markdown-container ${className}`}>
			<ReactMarkdown
				remarkPlugins={remarkPlugins}
				rehypePlugins={rehypePlugins}
				components={baseComponents}
			>
				{children}
			</ReactMarkdown>
		</div>
	);
};

export const Markdown = memo(NonMemoizedMarkdown);

export default Markdown;
