import type { ComponentConfig } from "@measured/puck";

export type TableBlockProps = {
	data: string[][];
	headers: string[];
	style: "default" | "bordered" | "striped";
	alignment: "left" | "center" | "right";
	fontSize: "sm" | "base" | "lg";
	maxWidth: string;
	padding: string;
	borderColor: string;
	headerBackgroundColor: string;
	headerTextColor: string;
	rowBackgroundColor: string;
	rowTextColor: string;
	stripedRowColor: string;
};

export const TableBlock: ComponentConfig<TableBlockProps> = {
	fields: {
		headers: {
			type: "array",
			arrayFields: {
				label: { type: "text" },
			},
			// biome-ignore lint/suspicious/noExplicitAny: Item type is flexible
			getItemSummary: (item: any) => item || "Header",
			label: "Headers",
		},
		data: {
			type: "array", // Simplified for now, Puck doesn't handle 2D arrays nicely in UI without custom field
			getItemSummary: (_item: unknown, index: number) => `Row ${index + 1}`,
			label: "Rows",
			// biome-ignore lint/suspicious/noExplicitAny: Type cast to bypass strict Puck typing for multidimensional array
		} as any,
		style: {
			type: "select",
			options: [
				{ label: "Default", value: "default" },
				{ label: "Bordered", value: "bordered" },
				{ label: "Striped", value: "striped" },
			],
			label: "Style",
		},
		alignment: {
			type: "select",
			options: [
				{ label: "Left", value: "left" },
				{ label: "Center", value: "center" },
				{ label: "Right", value: "right" },
			],
			label: "Alignment",
		},
		fontSize: {
			type: "select",
			options: [
				{ label: "Small", value: "sm" },
				{ label: "Base", value: "base" },
				{ label: "Large", value: "lg" },
			],
			label: "Font Size",
		},
		maxWidth: { type: "text", label: "Max Width" },
		padding: { type: "text", label: "Cell Padding" },
		borderColor: { type: "text", label: "Border Color" },
		headerBackgroundColor: { type: "text", label: "Header Background" },
		headerTextColor: { type: "text", label: "Header Text Color" },
		rowBackgroundColor: { type: "text", label: "Row Background" },
		rowTextColor: { type: "text", label: "Row Text Color" },
		stripedRowColor: { type: "text", label: "Striped Row Color" },
	},
	render: ({
		data,
		headers,
		style,
		alignment,
		fontSize,
		maxWidth,
		padding,
		borderColor,
		headerBackgroundColor,
		headerTextColor,
		rowBackgroundColor,
		rowTextColor,
		stripedRowColor,
	}) => {
		const fontSizeClass =
			fontSize === "sm"
				? "text-sm"
				: fontSize === "lg"
					? "text-lg"
					: "text-base";
		const alignmentClass =
			alignment === "left"
				? "text-left"
				: alignment === "right"
					? "text-right"
					: "text-center";
		const borderClass = style === "bordered" ? "border" : "";

		// Ensure data is array
		const safeData = Array.isArray(data) ? data : [];
		const safeHeaders = Array.isArray(headers) ? headers : [];

		return (
			<div
				className="w-full overflow-x-auto"
				style={{
					maxWidth: maxWidth === "full" ? "100%" : maxWidth,
					margin: "0 auto",
				}}
			>
				<table
					className={`w-full border-collapse ${fontSizeClass} ${alignmentClass}`}
					style={{ borderColor }}
				>
					<thead>
						<tr>
							{safeHeaders.map((header, index) => (
								<th
									// biome-ignore lint/suspicious/noArrayIndexKey: Headers are static string array
									key={index}
									className={`font-semibold ${borderClass}`}
									style={{
										backgroundColor: headerBackgroundColor,
										color: headerTextColor,
										padding,
										borderColor,
										borderBottomWidth: "1px",
										borderBottomStyle: "solid",
										borderTopWidth: style === "bordered" ? "1px" : "0",
										borderLeftWidth: style === "bordered" ? "1px" : "0",
										borderRightWidth: style === "bordered" ? "1px" : "0",
									}}
								>
									{header}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{safeData.map((row, rowIndex) => (
							<tr
								// biome-ignore lint/suspicious/noArrayIndexKey: Rows are mapped by index from data array
								key={rowIndex}
								style={{
									backgroundColor:
										style === "striped" && rowIndex % 2 === 1
											? stripedRowColor
											: rowBackgroundColor,
									color: rowTextColor,
								}}
							>
								{Array.isArray(row) &&
									row.map((cell, cellIndex) => (
										<td
											// biome-ignore lint/suspicious/noArrayIndexKey: Cell order is fixed columns
											key={cellIndex}
											className={borderClass}
											style={{
												padding,
												borderColor,
												borderBottomWidth:
													rowIndex === safeData.length - 1 &&
													style !== "bordered"
														? "0"
														: "1px",
												borderBottomStyle: "solid",
												borderTopWidth: "0",
												borderLeftWidth: style === "bordered" ? "1px" : "0",
												borderRightWidth: style === "bordered" ? "1px" : "0",
											}}
										>
											{cell}
										</td>
									))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	},
	defaultProps: {
		data: [
			["John Doe", "john@example.com", "Developer"],
			["Jane Smith", "jane@example.com", "Designer"],
			["Bob Johnson", "bob@example.com", "Manager"],
		],
		headers: ["Name", "Email", "Role"],
		style: "default",
		alignment: "left",
		fontSize: "base",
		maxWidth: "full",
		padding: "12px",
		borderColor: "#e5e7eb",
		headerBackgroundColor: "#f9fafb",
		headerTextColor: "#374151",
		rowBackgroundColor: "#ffffff",
		rowTextColor: "#374151",
		stripedRowColor: "#f9fafb",
	},
};
