/**
 * Helper functions for the Hero Block component
 */

import type { ReactElement } from "react";

export function getHeightClass(
	height: "small" | "medium" | "large" | "full",
): string {
	switch (height) {
		case "small":
			return "min-h-[400px]";
		case "medium":
			return "min-h-[600px]";
		case "large":
			return "min-h-[800px]";
		case "full":
			return "min-h-screen";
		default:
			return "min-h-[600px]";
	}
}

export function getPaddingClass(padding: "sm" | "md" | "lg" | "xl"): string {
	switch (padding) {
		case "sm":
			return "px-6 py-12";
		case "md":
			return "px-8 py-16";
		case "lg":
			return "px-12 py-24";
		case "xl":
			return "px-16 py-32";
		default:
			return "px-8 py-16";
	}
}

export function getAlignmentClass(
	alignment: "left" | "center" | "right",
): string {
	switch (alignment) {
		case "left":
			return "text-left items-start";
		case "right":
			return "text-right items-end";
		case "center":
			return "text-center items-center";
		default:
			return "text-center items-center";
	}
}

export function getVerticalAlignClass(
	verticalAlign: "top" | "center" | "bottom",
): string {
	switch (verticalAlign) {
		case "top":
			return "justify-start pt-20";
		case "bottom":
			return "justify-end pb-20";
		case "center":
			return "justify-center";
		default:
			return "justify-center";
	}
}

export function getContentWidthClass(
	contentWidth: "narrow" | "medium" | "wide" | "full",
): string {
	switch (contentWidth) {
		case "narrow":
			return "max-w-3xl";
		case "medium":
			return "max-w-5xl";
		case "wide":
			return "max-w-7xl";
		case "full":
			return "max-w-full";
		default:
			return "max-w-5xl";
	}
}

export function getTitleSizeClass(
	titleSize: "3xl" | "4xl" | "5xl" | "6xl" | "7xl",
): string {
	const sizeMap = {
		"3xl": "text-3xl md:text-4xl",
		"4xl": "text-4xl md:text-5xl",
		"5xl": "text-5xl md:text-6xl",
		"6xl": "text-6xl md:text-7xl",
		"7xl": "text-7xl md:text-8xl",
	};
	return sizeMap[titleSize] || sizeMap["5xl"];
}

export function getSubtitleSizeClass(
	subtitleSize: "sm" | "md" | "lg" | "xl",
): string {
	const sizeMap = {
		sm: "text-sm md:text-base",
		md: "text-base md:text-lg",
		lg: "text-lg md:text-xl",
		xl: "text-xl md:text-2xl",
	};
	return sizeMap[subtitleSize] || sizeMap.md;
}

export function getAnimationClass(
	animation:
		| "none"
		| "fade-in"
		| "slide-up"
		| "zoom-in"
		| "slide-in-left"
		| "slide-in-right",
): string {
	switch (animation) {
		case "fade-in":
			return "animate-fade-in";
		case "slide-up":
			return "animate-slide-up";
		case "zoom-in":
			return "animate-zoom-in";
		case "slide-in-left":
			return "animate-slide-in-left";
		case "slide-in-right":
			return "animate-slide-in-right";
		default:
			return "";
	}
}

export function getButtonClass(style: string, size: string): string {
	const baseClass =
		"inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

	const sizeClasses = {
		sm: "px-4 py-2 text-sm",
		md: "px-6 py-3 text-base",
		lg: "px-8 py-4 text-lg",
	};

	const styleClasses = {
		default: "bg-primary text-primary-foreground hover:bg-primary/90",
		primary: "bg-blue-600 hover:bg-blue-700 text-white",
		secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
		outline: "border-2 border-current hover:bg-current/10",
		ghost: "hover:bg-accent hover:text-accent-foreground",
	};

	return `${baseClass} ${sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.md} ${styleClasses[style as keyof typeof styleClasses] || styleClasses.default}`;
}

export function getBackgroundStyle(
	backgroundType: "color" | "gradient" | "image",
	backgroundColor: string,
	gradientFrom: string,
	gradientTo: string,
	gradientDirection: string,
	backgroundImage: string,
): React.CSSProperties {
	if (backgroundType === "gradient") {
		return {
			background: `linear-gradient(${gradientDirection}, ${gradientFrom}, ${gradientTo})`,
		};
	}
	if (backgroundType === "image" && backgroundImage) {
		return {
			backgroundImage: `url(${backgroundImage})`,
			backgroundSize: "cover",
			backgroundPosition: "center",
			backgroundRepeat: "no-repeat",
		};
	}
	return { backgroundColor };
}

export function getImageWidthClass(imageWidth: "1/3" | "1/2" | "2/3"): string {
	switch (imageWidth) {
		case "1/3":
			return "md:w-1/3";
		case "1/2":
			return "md:w-1/2";
		case "2/3":
			return "md:w-2/3";
		default:
			return "md:w-1/2";
	}
}

export function getShapeDivider(
	shapeDivider: "none" | "wave" | "curve" | "slant" | "triangle",
	textColor: string,
): ReactElement | null {
	const color = textColor || "#ffffff";

	switch (shapeDivider) {
		case "wave":
			return (
				<div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
					<svg
						className="relative block w-full h-12"
						viewBox="0 0 1200 120"
						preserveAspectRatio="none"
						aria-label="Wave shape divider"
						role="img"
					>
						<path
							d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
							fill={color}
						></path>
					</svg>
				</div>
			);
		case "curve":
			return (
				<div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
					<svg
						className="relative block w-full h-12"
						viewBox="0 0 1200 120"
						preserveAspectRatio="none"
						aria-label="Curve shape divider"
						role="img"
					>
						<path
							d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
							fill={color}
						></path>
					</svg>
				</div>
			);
		case "slant":
			return (
				<div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
					<svg
						className="relative block w-full h-12"
						viewBox="0 0 1200 120"
						preserveAspectRatio="none"
						aria-label="Slant shape divider"
						role="img"
					>
						<polygon points="0,120 1200,0 1200,120" fill={color}></polygon>
					</svg>
				</div>
			);
		case "triangle":
			return (
				<div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
					<svg
						className="relative block w-full h-12"
						viewBox="0 0 1200 120"
						preserveAspectRatio="none"
						aria-label="Triangle shape divider"
						role="img"
					>
						<polygon points="600,0 1200,120 0,120" fill={color}></polygon>
					</svg>
				</div>
			);
		default:
			return null;
	}
}
