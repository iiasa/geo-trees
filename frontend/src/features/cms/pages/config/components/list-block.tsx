import type { ComponentConfig } from "@measured/puck";
import { PUCK_COMPONENT_LABELS, PUCK_FIELD_LABELS } from "../../constants";

export const ListBlock: ComponentConfig = {
	label: PUCK_COMPONENT_LABELS.LIST,
	fields: {
		listType: {
			type: "select",
			label: PUCK_FIELD_LABELS.LIST_TYPE,
			options: [
				{ label: PUCK_FIELD_LABELS.UNORDERED, value: "unordered" },
				{ label: PUCK_FIELD_LABELS.ORDERED, value: "ordered" },
			],
		},
		items: {
			type: "array",
			label: PUCK_FIELD_LABELS.ITEMS,
			arrayFields: {
				text: {
					type: "text",
					label: PUCK_FIELD_LABELS.TEXT,
				},
			},
			// defaultItem: {
			// 	text: "List item",
			// },
		},
		variant: {
			type: "select",
			label: PUCK_FIELD_LABELS.VARIANT,
			options: [
				{ label: "Default", value: "default" },
				{ label: "Bulleted", value: "bulleted" },
				{ label: "Numbered", value: "numbered" },
			],
		},
	},
	defaultProps: {
		listType: "unordered",
		items: [
			{ text: "First item" },
			{ text: "Second item" },
			{ text: "Third item" },
		],
		variant: "default",
	},
	render: ({ listType, items, variant }) => {
		const listClass =
			variant === "bulleted"
				? "list-disc pl-5 space-y-1"
				: variant === "numbered"
					? "list-decimal pl-5 space-y-1"
					: "list-none pl-5 space-y-1";

		if (listType === "ordered") {
			return (
				<ol className={listClass}>
					{items.map((item: { text: string }, index: number) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: List items may not have unique IDs
						<li key={index}>{item.text}</li>
					))}
				</ol>
			);
		}

		return (
			<ul className={listClass}>
				{items.map((item: { text: string }, index: number) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: List items may not have unique IDs
					<li key={index}>{item.text}</li>
				))}
			</ul>
		);
	},
};
