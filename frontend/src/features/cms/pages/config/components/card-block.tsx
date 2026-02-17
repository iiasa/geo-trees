import type { ComponentConfig } from "@measured/puck";
import { PUCK_COMPONENT_LABELS, PUCK_FIELD_LABELS } from "../../constants";

export const CardBlock: ComponentConfig = {
	label: PUCK_COMPONENT_LABELS.CARD,
	fields: {
		title: {
			type: "text",
			label: PUCK_FIELD_LABELS.TITLE,
		},
		description: {
			type: "textarea",
			label: PUCK_FIELD_LABELS.DESCRIPTION,
		},
		imageUrl: {
			type: "text",
			label: PUCK_FIELD_LABELS.IMAGE_URL,
		},
		linkUrl: {
			type: "text",
			label: PUCK_FIELD_LABELS.LINK_URL,
		},
		variant: {
			type: "select",
			label: PUCK_FIELD_LABELS.VARIANT,
			options: [
				{ label: "Default", value: "default" },
				{ label: "Outlined", value: "outlined" },
				{ label: "Elevated", value: "elevated" },
			],
		},
	},
	defaultProps: {
		title: "Card Title",
		description: "Card description goes here",
		imageUrl: "",
		linkUrl: "#",
		variant: "default",
	},
	render: ({ title, description, imageUrl, linkUrl, variant }) => {
		const cardClass =
			variant === "outlined"
				? "border rounded-lg p-4"
				: variant === "elevated"
					? "shadow-lg rounded-lg p-4"
					: "bg-card rounded-lg p-4 border";

		return (
			<div className={cardClass}>
				{imageUrl && (
					<img
						src={imageUrl}
						alt={title}
						className="w-full h-48 object-cover rounded-md mb-4"
					/>
				)}
				<h3 className="text-lg font-semibold mb-2">{title}</h3>
				<p className="text-muted-foreground mb-4">{description}</p>
				{linkUrl && (
					<a href={linkUrl} className="text-primary hover:underline">
						Learn more
					</a>
				)}
			</div>
		);
	},
};
