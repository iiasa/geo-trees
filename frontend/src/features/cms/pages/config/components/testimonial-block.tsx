import type { ComponentConfig } from "@measured/puck";
import { Star } from "lucide-react";

export type TestimonialBlockProps = {
	quote: string;
	author: string;
	position: string;
	company: string;
	avatar: string;
	rating: number;
	alignment: "left" | "center" | "right";
	style: "default" | "card" | "minimal";
	backgroundColor: string;
	textColor: string;
	padding: string;
};

export const TestimonialBlock: ComponentConfig<TestimonialBlockProps> = {
	fields: {
		quote: {
			type: "text",
			label: "Quote",
		},
		author: {
			type: "text",
			label: "Author",
		},
		position: {
			type: "text",
			label: "Position",
		},
		company: {
			type: "text",
			label: "Company",
		},
		avatar: {
			type: "text",
			label: "Avatar URL",
		},
		rating: {
			type: "number",
			label: "Rating (1-5)",
			min: 1,
			max: 5,
		},
		alignment: {
			type: "select",
			label: "Alignment",
			options: [
				{ label: "Left", value: "left" },
				{ label: "Center", value: "center" },
				{ label: "Right", value: "right" },
			],
		},
		style: {
			type: "select",
			label: "Style",
			options: [
				{ label: "Default", value: "default" },
				{ label: "Card", value: "card" },
				{ label: "Minimal", value: "minimal" },
			],
		},
		backgroundColor: {
			type: "text",
			label: "Background Color",
		},
		textColor: {
			type: "text",
			label: "Text Color",
		},
		padding: {
			type: "text",
			label: "Padding",
		},
	},
	render: ({
		quote,
		author,
		position,
		company,
		avatar,
		rating,
		alignment,
		style,
		backgroundColor,
		textColor,
		padding,
	}) => {
		const alignmentClass =
			alignment === "left"
				? "text-left"
				: alignment === "right"
					? "text-right"
					: "text-center";

		const renderStars = () => {
			return Array.from({ length: 5 }, (_, i) => (
				<Star
					// biome-ignore lint/suspicious/noArrayIndexKey: Static array of 5 stars
					key={i}
					size={16}
					className={
						i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
					}
				/>
			));
		};

		const getCardClass = () => {
			switch (style) {
				case "card":
					return "rounded-lg shadow-md border border-gray-200";
				case "minimal":
					return "";
				default:
					return "rounded-lg";
			}
		};

		return (
			<div
				className={`testimonial-block ${alignmentClass} ${getCardClass()}`}
				style={{
					backgroundColor,
					color: textColor,
					padding,
				}}
			>
				<div className="flex flex-col space-y-4">
					{quote && (
						<blockquote className="text-lg italic">"{quote}"</blockquote>
					)}

					<div className="flex items-center space-x-1 justify-center">
						{renderStars()}
					</div>

					<div className="flex items-center space-x-4">
						{avatar && (
							<img
								src={avatar}
								alt={author}
								className="w-12 h-12 rounded-full object-cover"
							/>
						)}
						<div>
							{author && <div className="font-semibold">{author}</div>}
							{position && <div className="text-sm opacity-75">{position}</div>}
							{company && <div className="text-sm opacity-75">{company}</div>}
						</div>
					</div>
				</div>
			</div>
		);
	},
	defaultProps: {
		quote:
			"This product has completely transformed our workflow. Highly recommended!",
		author: "John Doe",
		position: "CEO",
		company: "Tech Corp",
		avatar: "",
		rating: 5,
		alignment: "left",
		style: "default",
		backgroundColor: "#ffffff",
		textColor: "#374151",
		padding: "24px",
	},
};
