import type { ComponentConfig } from "@measured/puck";
import { createCheckboxField } from "@/shared/components/puck-utils";

export type WelcomeBlockProps = {
	title: string;
	description: string;
	showTips: boolean;
	alignment: "left" | "center" | "right";
	backgroundColor: string;
	textColor: string;
	padding: string;
	borderRadius: string;
};

export const WelcomeBlock: ComponentConfig<WelcomeBlockProps> = {
	fields: {
		title: {
			type: "text",
			label: "Title",
		},
		description: {
			type: "text",
			label: "Description",
		},
		showTips: createCheckboxField("Show Tips"),
		alignment: {
			type: "select",
			label: "Alignment",
			options: [
				{ label: "Left", value: "left" },
				{ label: "Center", value: "center" },
				{ label: "Right", value: "right" },
			],
		},
		backgroundColor: {
			type: "text",
			label: "Background Color",
		},
		textColor: {
			type: "text",
			label: "Text Color",
		},
		padding: {
			type: "text",
			label: "Padding",
		},
		borderRadius: {
			type: "text",
			label: "Border Radius",
		},
	},
	render: ({
		title,
		description,
		showTips,
		alignment,
		backgroundColor,
		textColor,
		padding,
		borderRadius,
	}) => {
		const alignmentClass =
			alignment === "left"
				? "text-left"
				: alignment === "right"
					? "text-right"
					: "text-center";

		return (
			<div
				style={{
					backgroundColor,
					color: textColor,
					padding,
					borderRadius,
				}}
				className={`welcome-block ${alignmentClass}`}
			>
				<h1 className="text-2xl font-bold mb-4">{title}</h1>
				<p className="text-lg mb-4">{description}</p>
				{showTips && (
					<div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200">
						<h3 className="text-sm font-medium text-blue-800 mb-2">Tips:</h3>
						<ul className="text-sm text-blue-700 space-y-1">
							<li>• Click on any component to edit its properties</li>
							<li>• Drag and drop components to reorder them</li>
							<li>• Use the sidebar to add new components</li>
						</ul>
					</div>
				)}
			</div>
		);
	},
	defaultProps: {
		title: "Welcome to Your New Page",
		description:
			"Start building your page by adding components from the sidebar.",
		showTips: true,
		alignment: "center",
		backgroundColor: "#f8fafc",
		textColor: "#1f2937",
		padding: "48px 24px",
		borderRadius: "8px",
	},
};
