import type { ComponentConfig } from "@measured/puck";
import { PUCK_COMPONENT_LABELS, PUCK_FIELD_LABELS } from "../../constants";
import { createCheckboxField } from "@/shared/components/puck-utils";

export const FormBlock: ComponentConfig = {
	label: PUCK_COMPONENT_LABELS.FORM,
	fields: {
		title: {
			type: "text",
			label: PUCK_FIELD_LABELS.TITLE,
		},
		description: {
			type: "textarea",
			label: PUCK_FIELD_LABELS.DESCRIPTION,
		},
		fields: {
			type: "array",
			label: PUCK_FIELD_LABELS.FIELDS,
			arrayFields: {
				name: {
					type: "text",
					label: PUCK_FIELD_LABELS.FIELD_NAME,
				},
				label: {
					type: "text",
					label: PUCK_FIELD_LABELS.FIELD_LABEL,
				},
				type: {
					type: "select",
					label: PUCK_FIELD_LABELS.FIELD_TYPE,
					options: [
						{ label: PUCK_FIELD_LABELS.TEXT_INPUT, value: "text" },
						{ label: PUCK_FIELD_LABELS.EMAIL_INPUT, value: "email" },
						{ label: PUCK_FIELD_LABELS.TEXTAREA, value: "textarea" },
					],
				},
				required: createCheckboxField(PUCK_FIELD_LABELS.FIELD_REQUIRED),
			},
			// defaultItem: {
			// 	name: "field",
			// 	label: "Field Label",
			// 	type: "text",
			// 	required: false,
			// },
		},
		submitButtonText: {
			type: "text",
			label: PUCK_FIELD_LABELS.SUBMIT_BUTTON_TEXT,
		},
	},
	defaultProps: {
		title: "Contact Form",
		description: "Please fill out the form below",
		fields: [
			{ name: "name", label: "Name", type: "text", required: true },
			{ name: "email", label: "Email", type: "email", required: true },
			{ name: "message", label: "Message", type: "textarea", required: false },
		],
		submitButtonText: "Submit",
	},
	render: ({ title, description, fields, submitButtonText }) => {
		return (
			<div className="bg-card p-6 rounded-lg border my-4">
				{title && <h3 className="text-xl font-semibold mb-2">{title}</h3>}
				{description && (
					<p className="text-muted-foreground mb-4">{description}</p>
				)}
				<form className="space-y-4">
					{fields.map(
						(
							field: {
								name: string;
								label: string;
								type: string;
								required: boolean;
							},
							index: number,
						) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: Order is stable for form fields
							<div key={index}>
								<label
									htmlFor={field.name}
									className="block text-sm font-medium mb-1"
								>
									{field.label}
									{field.required && (
										<span className="text-red-500 ml-1">*</span>
									)}
								</label>
								{field.type === "textarea" ? (
									<textarea
										id={field.name}
										name={field.name}
										required={field.required}
										rows={4}
										className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
									/>
								) : (
									<input
										id={field.name}
										name={field.name}
										type={field.type}
										required={field.required}
										className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
									/>
								)}
							</div>
						),
					)}
					<button
						type="submit"
						className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
					>
						{submitButtonText}
					</button>
				</form>
			</div>
		);
	},
};
