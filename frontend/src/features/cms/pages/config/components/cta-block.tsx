import type { ComponentConfig } from "@measured/puck";
import { PUCK_COMPONENT_LABELS, PUCK_FIELD_LABELS } from "../../constants";

export const CTABlock: ComponentConfig = {
	label: PUCK_COMPONENT_LABELS.CTA,
	fields: {
		heading: {
			type: "text",
			label: "Heading",
		},
		description: {
			type: "textarea",
			label: PUCK_FIELD_LABELS.DESCRIPTION,
		},
		buttonText: {
			type: "text",
			label: "Button Text",
		},
		buttonLink: {
			type: "text",
			label: "Button Link",
		},
		buttonVariant: {
			type: "select",
			label: "Button Style",
			options: [
				{ label: "Default", value: "default" },
				{ label: "Outline", value: "outline" },
				{ label: "Secondary", value: "secondary" },
			],
		},
		alignment: {
			type: "select",
			label: "Text Alignment",
			options: [
				{ label: "Left", value: "left" },
				{ label: "Center", value: "center" },
				{ label: "Right", value: "right" },
			],
		},
		backgroundColor: {
			type: "select",
			label: "Background",
			options: [
				{ label: "None", value: "none" },
				{ label: "Muted", value: "muted" },
				{ label: "Primary", value: "primary" },
				{ label: "Accent", value: "accent" },
			],
		},
		padding: {
			type: "select",
			label: "Padding",
			options: [
				{ label: "Small", value: "sm" },
				{ label: "Medium", value: "md" },
				{ label: "Large", value: "lg" },
				{ label: "Extra Large", value: "xl" },
			],
		},
	},
	defaultProps: {
		heading: "Ready to get started?",
		description:
			"Join thousands of satisfied customers and take your business to the next level.",
		buttonText: "Get Started",
		buttonLink: "#",
		buttonVariant: "default",
		alignment: "center",
		backgroundColor: "muted",
		padding: "lg",
	},
	render: ({
		heading,
		description,
		buttonText,
		buttonLink,
		buttonVariant,
		alignment,
		backgroundColor,
		padding,
	}) => {
		const alignmentClass =
			alignment === "center"
				? "text-center items-center"
				: alignment === "right"
					? "text-right items-end"
					: "text-left items-start";

		const backgroundClass =
			backgroundColor === "muted"
				? "bg-muted"
				: backgroundColor === "primary"
					? "bg-primary text-primary-foreground"
					: backgroundColor === "accent"
						? "bg-accent text-accent-foreground"
						: "";

		const paddingClass =
			padding === "sm"
				? "p-6"
				: padding === "md"
					? "p-8"
					: padding === "lg"
						? "p-12"
						: "p-16";

		const buttonClass =
			buttonVariant === "default"
				? "bg-primary text-primary-foreground hover:bg-primary/90"
				: buttonVariant === "outline"
					? "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
					: "bg-secondary text-secondary-foreground hover:bg-secondary/80";

		return (
			<div className={`rounded-lg ${backgroundClass} ${paddingClass}`}>
				<div className={`flex flex-col gap-4 ${alignmentClass}`}>
					<h2 className="text-3xl font-bold tracking-tight">{heading}</h2>
					{description && (
						<p className="text-lg opacity-90 max-w-2xl">{description}</p>
					)}
					{buttonText && (
						<div className="mt-2">
							<a
								href={buttonLink}
								className={`inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium transition-colors ${buttonClass}`}
							>
								{buttonText}
							</a>
						</div>
					)}
				</div>
			</div>
		);
	},
};
