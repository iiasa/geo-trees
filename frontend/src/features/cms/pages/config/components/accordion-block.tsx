import type { ComponentConfig } from "@measured/puck";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/shared/components/ui/accordion";
import { PUCK_COMPONENT_LABELS, PUCK_FIELD_LABELS } from "../../constants";

export const AccordionBlock: ComponentConfig = {
	label: PUCK_COMPONENT_LABELS.ACCORDION,
	fields: {
		items: {
			type: "array",
			label: "Accordion Items",
			arrayFields: {
				title: {
					type: "text",
					label: PUCK_FIELD_LABELS.TITLE,
				},
				content: {
					type: "textarea",
					label: PUCK_FIELD_LABELS.CONTENT,
				},
			},
			defaultItemProps: {
				title: "Accordion Item",
				content: "Accordion content goes here",
			},
		},
		type: {
			type: "select",
			label: "Type",
			options: [
				{ label: "Single (one at a time)", value: "single" },
				{ label: "Multiple (allow multiple open)", value: "multiple" },
			],
		},
		collapsible: {
			type: "radio",
			label: "Collapsible",
			options: [
				{ label: "Yes", value: "true" },
				{ label: "No", value: "false" },
			],
		},
	},
	defaultProps: {
		items: [
			{
				title: "What is this accordion?",
				content:
					"This is a collapsible accordion component that can be used to organize content in expandable sections.",
			},
			{
				title: "How do I use it?",
				content:
					"Click on any section to expand or collapse it. You can configure whether multiple sections can be open at once.",
			},
			{
				title: "Can I customize it?",
				content:
					"Yes! You can add or remove items, change the titles and content, and choose between single or multiple open sections.",
			},
		],
		type: "single",
		collapsible: "true",
	},
	render: ({ items, type, collapsible }) => {
		const accordionType = type as "single" | "multiple";
		const isCollapsible = collapsible === "true";

		return (
			<div className="w-full">
				<Accordion
					type={accordionType}
					collapsible={accordionType === "single" ? isCollapsible : undefined}
				>
					{items.map(
						(item: { title: string; content: string }, index: number) => (
							<AccordionItem
								key={`${item.title}-${index}`}
								value={`item-${index}`}
							>
								<AccordionTrigger>{item.title}</AccordionTrigger>
								<AccordionContent>{item.content}</AccordionContent>
							</AccordionItem>
						),
					)}
				</Accordion>
			</div>
		);
	},
};
