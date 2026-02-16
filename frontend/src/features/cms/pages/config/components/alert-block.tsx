import type { ComponentConfig } from "@measured/puck";
import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "@/shared/components/ui/alert";
import { AlertCircle, Info, CheckCircle2, XCircle } from "lucide-react";
import { PUCK_COMPONENT_LABELS, PUCK_FIELD_LABELS } from "../../constants";

export const AlertBlock: ComponentConfig = {
	label: PUCK_COMPONENT_LABELS.ALERT,
	fields: {
		title: {
			type: "text",
			label: PUCK_FIELD_LABELS.TITLE,
		},
		description: {
			type: "textarea",
			label: PUCK_FIELD_LABELS.DESCRIPTION,
		},
		variant: {
			type: "select",
			label: PUCK_FIELD_LABELS.VARIANT,
			options: [
				{ label: "Default", value: "default" },
				{ label: "Destructive", value: "destructive" },
			],
		},
		icon: {
			type: "select",
			label: "Icon",
			options: [
				{ label: "None", value: "none" },
				{ label: "Info", value: "info" },
				{ label: "Warning", value: "warning" },
				{ label: "Success", value: "success" },
				{ label: "Error", value: "error" },
			],
		},
	},
	defaultProps: {
		title: "Heads up!",
		description:
			"You can add important information here to grab user attention.",
		variant: "default",
		icon: "info",
	},
	render: ({ title, description, variant, icon }) => {
		const getIcon = () => {
			switch (icon) {
				case "info":
					return <Info />;
				case "warning":
					return <AlertCircle />;
				case "success":
					return <CheckCircle2 />;
				case "error":
					return <XCircle />;
				default:
					return null;
			}
		};

		return (
			<Alert variant={variant as "default" | "destructive"}>
				{icon !== "none" && getIcon()}
				{title && <AlertTitle>{title}</AlertTitle>}
				{description && <AlertDescription>{description}</AlertDescription>}
			</Alert>
		);
	},
};
