import type { ComponentConfig } from "@measured/puck";

export const ImageBlock: ComponentConfig = {
	fields: {
		src: {
			type: "text",
			label: "Image URL",
		},
		alt: {
			type: "text",
			label: "Alt Text",
		},
		width: {
			type: "number",
			label: "Width",
		},
		height: {
			type: "number",
			label: "Height",
		},
	},
	defaultProps: {
		src: "",
		alt: "Image",
		width: 800,
		height: 600,
	},
	render: ({ src, alt, width, height }) => {
		if (!src) {
			return (
				<div className="flex items-center justify-center p-8 border border-dashed text-muted-foreground">
					No image URL provided
				</div>
			);
		}
		return (
			<img
				src={src}
				alt={alt}
				width={width}
				height={height}
				className="max-w-full h-auto"
			/>
		);
	},
};
