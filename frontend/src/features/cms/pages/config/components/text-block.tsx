import type { ComponentConfig } from "@measured/puck";

export const TextBlock: ComponentConfig = {
	fields: {
		text: {
			type: "textarea",
			label: "Text",
		},
	},
	defaultProps: {
		text: "Enter your text here",
	},
	render: ({ text }) => {
		return <p className="mb-4">{text}</p>;
	},
};
