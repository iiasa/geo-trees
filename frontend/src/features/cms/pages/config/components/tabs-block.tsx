import type { ComponentConfig } from "@measured/puck";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/shared/components/ui/tabs";
import { PUCK_COMPONENT_LABELS, PUCK_FIELD_LABELS } from "../../constants";

export const TabsBlock: ComponentConfig = {
	label: PUCK_COMPONENT_LABELS.TABS,
	fields: {
		tabs: {
			type: "array",
			label: "Tabs",
			arrayFields: {
				label: {
					type: "text",
					label: "Tab Label",
				},
				content: {
					type: "textarea",
					label: PUCK_FIELD_LABELS.CONTENT,
				},
			},
			defaultItemProps: {
				label: "Tab",
				content: "Tab content goes here",
			},
		},
		defaultTab: {
			type: "number",
			label: "Default Active Tab (index)",
		},
	},
	defaultProps: {
		tabs: [
			{
				label: "Overview",
				content:
					"This is the overview tab. You can add any content here including text, images, or other components.",
			},
			{
				label: "Features",
				content:
					"Here you can list all the amazing features of your product or service.",
			},
			{
				label: "Pricing",
				content: "Display your pricing information and plans in this tab.",
			},
		],
		defaultTab: 0,
	},
	render: ({ tabs, defaultTab }) => {
		const defaultValue = tabs[defaultTab]
			? `tab-${defaultTab}`
			: tabs.length > 0
				? "tab-0"
				: undefined;

		return (
			<div className="w-full">
				<Tabs defaultValue={defaultValue}>
					<TabsList>
						{tabs.map(
							(tab: { label: string; content: string }, index: number) => (
								<TabsTrigger
									key={`${tab.label}-${index}`}
									value={`tab-${index}`}
								>
									{tab.label}
								</TabsTrigger>
							),
						)}
					</TabsList>
					{tabs.map(
						(tab: { label: string; content: string }, index: number) => (
							<TabsContent
								key={`${tab.label}-content-${index}`}
								value={`tab-${index}`}
							>
								<div className="py-4">{tab.content}</div>
							</TabsContent>
						),
					)}
				</Tabs>
			</div>
		);
	},
};
