import type { ComponentConfig } from "@measured/puck";
import { PUCK_COMPONENT_LABELS, PUCK_FIELD_LABELS } from "../../constants";

export const QuoteBlock: ComponentConfig = {
	label: PUCK_COMPONENT_LABELS.QUOTE,
	fields: {
		text: {
			type: "textarea",
			label: PUCK_FIELD_LABELS.TEXT,
		},
		author: {
			type: "text",
			label: PUCK_FIELD_LABELS.AUTHOR,
		},
		source: {
			type: "text",
			label: PUCK_FIELD_LABELS.SOURCE,
		},
		variant: {
			type: "select",
			label: PUCK_FIELD_LABELS.VARIANT,
			options: [
				{ label: "Default", value: "default" },
				{ label: "Large", value: "large" },
				{ label: "With Border", value: "border" },
			],
		},
	},
	defaultProps: {
		text: "This is a quote that can be used to highlight important information.",
		author: "Author Name",
		source: "",
		variant: "default",
	},
	render: ({ text, author, source, variant }) => {
		const quoteClass =
			variant === "large"
				? "text-2xl font-light italic my-6"
				: variant === "border"
					? "border-l-4 border-primary pl-4 italic my-4"
					: "italic my-4";

		return (
			<blockquote className={quoteClass}>
				<p>"{text}"</p>
				{(author || source) && (
					<footer className="text-sm text-muted-foreground mt-2">
						{author && <span>— {author}</span>}
						{author && source && <span>, </span>}
						{source && <cite>{source}</cite>}
					</footer>
				)}
			</blockquote>
		);
	},
};
