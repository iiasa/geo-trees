import type { ComponentConfig } from "@measured/puck";
import { PUCK_COMPONENT_LABELS, PUCK_FIELD_LABELS } from "../../constants";

export const DividerBlock: ComponentConfig = {
	label: PUCK_COMPONENT_LABELS.DIVIDER,
	fields: {
		variant: {
			type: "select",
			label: PUCK_FIELD_LABELS.VARIANT,
			options: [
				{ label: PUCK_FIELD_LABELS.SOLID, value: "solid" },
				{ label: PUCK_FIELD_LABELS.DASHED, value: "dashed" },
				{ label: PUCK_FIELD_LABELS.DOTTED, value: "dotted" },
			],
		},
		thickness: {
			type: "number",
			label: PUCK_FIELD_LABELS.THICKNESS,
			min: 1,
			max: 10,
		},
		color: {
			type: "text",
			label: PUCK_FIELD_LABELS.COLOR,
		},
	},
	defaultProps: {
		variant: "solid",
		thickness: 1,
		color: "#e5e7eb",
	},
	render: ({ variant, thickness, color }) => {
		const borderStyle =
			variant === "dashed"
				? "border-dashed"
				: variant === "dotted"
					? "border-dotted"
					: "border-solid";

		return (
			<hr
				className={`my-6 ${borderStyle}`}
				style={{
					borderWidth: `${thickness}px`,
					borderColor: color,
				}}
			/>
		);
	},
};
