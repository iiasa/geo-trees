import type { ComponentConfig } from "@measured/puck";
import { PUCK_COMPONENT_LABELS, PUCK_FIELD_LABELS } from "../../constants";

export const ContainerBlock: ComponentConfig = {
	label: PUCK_COMPONENT_LABELS.CONTAINER,
	fields: {
		backgroundColor: {
			type: "text",
			label: PUCK_FIELD_LABELS.BACKGROUND_COLOR,
		},
		padding: {
			type: "text",
			label: PUCK_FIELD_LABELS.PADDING,
		},
		margin: {
			type: "text",
			label: PUCK_FIELD_LABELS.MARGIN,
		},
		borderRadius: {
			type: "number",
			label: PUCK_FIELD_LABELS.BORDER_RADIUS,
		},
	},
	defaultProps: {
		backgroundColor: "#f9fafb",
		padding: "16px",
		margin: "0",
		borderRadius: 0,
	},
	render: ({ backgroundColor, padding, margin, borderRadius, children }) => {
		return (
			<div
				style={{
					backgroundColor,
					padding,
					margin,
					borderRadius: `${borderRadius}px`,
				}}
				className="my-4"
			>
				{children}
			</div>
		);
	},
};
