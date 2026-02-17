import type { ComponentConfig } from "@measured/puck";

export type SpacerBlockProps = {
	height: string;
	backgroundColor: string;
	borderTop: string;
	borderBottom: string;
};

export const SpacerBlock: ComponentConfig<SpacerBlockProps> = {
	fields: {
		height: {
			type: "text",
			label: "Height",
		},
		backgroundColor: {
			type: "text",
			label: "Background Color",
		},
		borderTop: {
			type: "text",
			label: "Top Border",
		},
		borderBottom: {
			type: "text",
			label: "Bottom Border",
		},
	},
	render: ({ height, backgroundColor, borderTop, borderBottom }) => {
		return (
			<div
				className="spacer-block w-full"
				style={{
					height,
					backgroundColor,
					borderTop,
					borderBottom,
				}}
			/>
		);
	},
	defaultProps: {
		height: "40px",
		backgroundColor: "transparent",
		borderTop: "none",
		borderBottom: "none",
	},
};
