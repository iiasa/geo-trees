import { Checkbox } from "@/shared/components/ui/checkbox";
import type { CustomField } from "@measured/puck";

// Wrapper to create a custom checkbox field since Puck doesn't have a native one
export function createCheckboxField(label: string): CustomField<boolean> {
	return {
		type: "custom",
		label,
		render: ({ name, onChange, value, field }) => {
			return (
				<div className="flex items-center gap-2 py-2">
					<Checkbox
						id={name}
						checked={value}
						onCheckedChange={(checked) => onChange(checked === true)}
					/>
					<label
						htmlFor={name}
						className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						{field.label || label}
					</label>
				</div>
			);
		},
	};
}
