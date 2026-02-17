import { createCheckboxField } from "@/shared/components/puck-utils";
import type { ComponentConfig } from "@measured/puck";

export type HeroBlockProps = {
	title: string;
	subtitle: string;
	backgroundColor: string;
	textColor: string;
	showButton: boolean;
	buttonText: string;
	buttonLink: string;
	buttonStyle: "primary" | "secondary" | "outline";
	alignment: "left" | "center" | "right";
	subtitleSize: "small" | "medium" | "large";
	showGradient: boolean;
	gradientDirection: string;
	animation: "none" | "fade-in" | "slide-up" | "zoom-in";
	preset: string;
};

export const HeroBlock: ComponentConfig<HeroBlockProps> = {
	fields: {
		title: {
			type: "text",
			label: "Title",
		},
		subtitle: {
			type: "text",
			label: "Subtitle",
		},
		backgroundColor: {
			type: "text",
			label: "Background Color",
		},
		textColor: {
			type: "text",
			label: "Text Color",
		},
		showButton: createCheckboxField("Show Button"),
		buttonText: {
			type: "text",
			label: "Button Text",
		},
		buttonLink: {
			type: "text",
			label: "Button Link",
		},
		buttonStyle: {
			type: "select",
			label: "Button Style",
			options: [
				{ label: "Primary", value: "primary" },
				{ label: "Secondary", value: "secondary" },
				{ label: "Outline", value: "outline" },
			],
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
		subtitleSize: {
			type: "select",
			label: "Subtitle Size",
			options: [
				{ label: "Small", value: "small" },
				{ label: "Medium", value: "medium" },
				{ label: "Large", value: "large" },
			],
		},
		showGradient: createCheckboxField("Show Gradient"),
		gradientDirection: {
			type: "select",
			label: "Gradient Direction",
			options: [
				{ label: "To Bottom Right", value: "to-br" },
				{ label: "To Bottom", value: "to-b" },
				{ label: "To Right", value: "to-r" },
				{ label: "To Bottom Left", value: "to-bl" },
			],
		},
		animation: {
			type: "select",
			label: "Animation",
			options: [
				{ label: "None", value: "none" },
				{ label: "Fade In", value: "fade-in" },
				{ label: "Slide Up", value: "slide-up" },
				{ label: "Zoom In", value: "zoom-in" },
			],
		},
		preset: {
			type: "select",
			label: "Preset",
			options: [
				{ label: "Default", value: "default" },
				{ label: "Modern Gradient", value: "modern-gradient" },
				{ label: "Minimal", value: "minimal" },
				{ label: "Bold", value: "bold" },
			],
		},
	},
	render: ({
		title,
		subtitle,
		backgroundColor,
		textColor,
		showButton,
		buttonText,
		buttonLink,
		buttonStyle,
		alignment,
		subtitleSize,
		showGradient,
		gradientDirection,
		animation,
	}) => {
		const alignmentClass =
			alignment === "left"
				? "text-left"
				: alignment === "right"
					? "text-right"
					: "text-center";

		const subtitleSizeClass =
			subtitleSize === "small"
				? "text-lg"
				: subtitleSize === "large"
					? "text-2xl"
					: "text-xl";

		const animationClass =
			animation === "fade-in"
				? "animate-fade-in"
				: animation === "slide-up"
					? "animate-slide-up"
					: animation === "zoom-in"
						? "animate-zoom-in"
						: "";

		const getButtonClass = () => {
			switch (buttonStyle) {
				case "primary":
					return "bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors";
				case "secondary":
					return "bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-md transition-colors";
				case "outline":
					return "border border-white hover:bg-white hover:text-gray-900 text-white font-medium py-2 px-6 rounded-md transition-colors";
				default:
					return "bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors";
			}
		};

		const backgroundStyle = showGradient
			? {
					background: `linear-gradient(${gradientDirection}, ${backgroundColor}, ${backgroundColor}dd)`,
				}
			: { backgroundColor };

		return (
			<div
				className={`hero-block py-20 px-6 ${alignmentClass} ${animationClass}`}
				style={backgroundStyle}
			>
				<div className="max-w-4xl mx-auto">
					<h1
						className="text-4xl md:text-5xl font-bold mb-6"
						style={{ color: textColor }}
					>
						{title}
					</h1>
					{subtitle && (
						<p
							className={`mb-8 ${subtitleSizeClass}`}
							style={{ color: textColor }}
						>
							{subtitle}
						</p>
					)}
					{showButton && buttonText && (
						<a href={buttonLink} className={getButtonClass()}>
							{buttonText}
						</a>
					)}
				</div>
			</div>
		);
	},
	defaultProps: {
		title: "Welcome to Our Site",
		subtitle: "Discover amazing content",
		backgroundColor: "#1f2937",
		textColor: "#ffffff",
		showButton: true,
		buttonText: "Learn More",
		buttonLink: "#",
		buttonStyle: "primary",
		alignment: "center",
		subtitleSize: "medium",
		showGradient: false,
		gradientDirection: "to-br",
		animation: "fade-in",
		preset: "modern-gradient",
	},
};
