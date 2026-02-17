import type { ComponentConfig } from "@measured/puck";

export const ButtonBlock: ComponentConfig = {
	fields: {
		label: {
			type: "text",
			label: "Button Label",
		},
		href: {
			type: "text",
			label: "Link URL",
		},
		variant: {
			type: "select",
			label: "Variant",
			options: [
				{ label: "Default", value: "default" },
				{ label: "Outline", value: "outline" },
				{ label: "Destructive", value: "destructive" },
				{ label: "Secondary", value: "secondary" },
				{ label: "Ghost", value: "ghost" },
				{ label: "Link", value: "link" },
			],
		},
	},
	defaultProps: {
		label: "Click me",
		href: "#",
		variant: "default",
	},
	render: ({ label, href, variant }) => {
		return (
			<a
				href={href}
				className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors ${
					variant === "default"
						? "bg-primary text-primary-foreground hover:bg-primary/90"
						: variant === "outline"
							? "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
							: variant === "destructive"
								? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
								: variant === "secondary"
									? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
									: variant === "ghost"
										? "hover:bg-accent hover:text-accent-foreground"
										: "text-primary underline-offset-4 hover:underline"
				}`}
			>
				{label}
			</a>
		);
	},
};
