import type { ComponentConfig } from "@measured/puck";
import { PUCK_COMPONENT_LABELS, PUCK_FIELD_LABELS } from "../../constants";

// Mapping of column values to Tailwind classes
const columnClasses = {
	"1": "grid-cols-1",
	"2": "grid-cols-1 md:grid-cols-2",
	"3": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
	"4": "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
};

export const GridBlock: ComponentConfig = {
	label: PUCK_COMPONENT_LABELS.GRID,
	fields: {
		columns: {
			type: "select",
			label: PUCK_FIELD_LABELS.COLUMNS,
			options: [
				{ label: "1", value: "1" },
				{ label: "2", value: "2" },
				{ label: "3", value: "3" },
				{ label: "4", value: "4" },
			],
		},
		gap: {
			type: "number",
			label: PUCK_FIELD_LABELS.GAP,
		},
	},
	defaultProps: {
		columns: "2",
		gap: 16,
	},
	render: ({ columns, gap, children }) => {
		// Use the mapping to get the appropriate class
		const gridClass =
			columnClasses[columns as keyof typeof columnClasses] ||
			columnClasses["2"];

		return (
			<div className={gridClass} style={{ gap: `${gap}px` }}>
				{children}
			</div>
		);
	},
};
