import type { ComponentConfig } from "@measured/puck";

export const HeadingBlock: ComponentConfig = {
	fields: {
		text: {
			type: "text",
			label: "Text",
		},
		level: {
			type: "select",
			label: "Heading Level",
			options: [
				{ label: "H1", value: "1" },
				{ label: "H2", value: "2" },
				{ label: "H3", value: "3" },
				{ label: "H4", value: "4" },
				{ label: "H5", value: "5" },
				{ label: "H6", value: "6" },
			],
		},
	},
	defaultProps: {
		text: "Heading",
		level: "2",
	},
	render: ({ text, level }) => {
		const levelNum = parseInt(level, 10);
		if (levelNum === 1) return <h1>{text}</h1>;
		if (levelNum === 2) return <h2>{text}</h2>;
		if (levelNum === 3) return <h3>{text}</h3>;
		if (levelNum === 4) return <h4>{text}</h4>;
		if (levelNum === 5) return <h5>{text}</h5>;
		return <h6>{text}</h6>;
	},
};
