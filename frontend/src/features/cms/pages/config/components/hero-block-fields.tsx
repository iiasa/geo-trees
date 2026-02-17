import { createCheckboxField } from "@/shared/components/puck-utils";
import { PUCK_FIELD_LABELS } from "../../constants";
import type { Fields } from "@measured/puck";

export const heroBlockFields: Fields = {
	// Content Fields
	title: { type: "text", label: PUCK_FIELD_LABELS.TITLE },
	subtitle: { type: "textarea", label: "Subtitle" },
	description: { type: "textarea", label: PUCK_FIELD_LABELS.DESCRIPTION },
	showBadge: createCheckboxField("Show Badge"),
	badge: { type: "text", label: "Badge Text" },

	// Primary Button
	showButton: createCheckboxField("Show Primary Button"),
	buttonText: { type: "text", label: "Primary Button Text" },
	buttonLink: { type: "text", label: "Primary Button Link" },
	buttonStyle: {
		type: "select",
		label: "Primary Button Style",
		options: [
			{ label: "Default", value: "default" },
			{ label: "Primary", value: "primary" },
			{ label: "Secondary", value: "secondary" },
			{ label: "Outline", value: "outline" },
			{ label: "Ghost", value: "ghost" },
		],
	},
	buttonSize: {
		type: "select",
		label: "Button Size",
		options: [
			{ label: "Small", value: "sm" },
			{ label: "Medium", value: "md" },
			{ label: "Large", value: "lg" },
		],
	},

	// Secondary Button
	showSecondaryButton: createCheckboxField("Show Secondary Button"),
	secondaryButtonText: { type: "text", label: "Secondary Button Text" },
	secondaryButtonLink: { type: "text", label: "Secondary Button Link" },
	secondaryButtonStyle: {
		type: "select",
		label: "Secondary Button Style",
		options: [
			{ label: "Default", value: "default" },
			{ label: "Primary", value: "primary" },
			{ label: "Secondary", value: "secondary" },
			{ label: "Outline", value: "outline" },
			{ label: "Ghost", value: "ghost" },
		],
	},

	// Background
	backgroundType: {
		type: "select",
		label: "Background Type",
		options: [
			{ label: "Solid Color", value: "color" },
			{ label: "Gradient", value: "gradient" },
			{ label: "Image", value: "image" },
		],
	},
	backgroundColor: { type: "text", label: PUCK_FIELD_LABELS.BACKGROUND_COLOR },
	backgroundImage: { type: "text", label: "Background Image URL" },
	gradientFrom: { type: "text", label: "Gradient Start Color" },
	gradientTo: { type: "text", label: "Gradient End Color" },
	gradientDirection: {
		type: "select",
		label: "Gradient Direction",
		options: [
			{ label: "To Right", value: "to-r" },
			{ label: "To Bottom Right", value: "to-br" },
			{ label: "To Bottom", value: "to-b" },
			{ label: "To Bottom Left", value: "to-bl" },
			{ label: "To Left", value: "to-l" },
			{ label: "To Top Left", value: "to-tl" },
			{ label: "To Top", value: "to-t" },
			{ label: "To Top Right", value: "to-tr" },
		],
	},
	showOverlay: createCheckboxField("Show Overlay"),
	overlayOpacity: { type: "number", label: "Overlay Opacity (0-1)" },

	// Layout
	layout: {
		type: "select",
		label: "Layout",
		options: [
			{ label: "Stacked", value: "stacked" },
			{ label: "Split (with image)", value: "split" },
			{ label: "Centered", value: "centered" },
		],
	},
	alignment: {
		type: "select",
		label: PUCK_FIELD_LABELS.ALIGNMENT,
		options: [
			{ label: "Left", value: "left" },
			{ label: "Center", value: "center" },
			{ label: "Right", value: "right" },
		],
	},
	verticalAlign: {
		type: "select",
		label: "Vertical Alignment",
		options: [
			{ label: "Top", value: "top" },
			{ label: "Center", value: "center" },
			{ label: "Bottom", value: "bottom" },
		],
	},
	contentWidth: {
		type: "select",
		label: "Content Width",
		options: [
			{ label: "Narrow", value: "narrow" },
			{ label: "Medium", value: "medium" },
			{ label: "Wide", value: "wide" },
			{ label: "Full Width", value: "full" },
		],
	},
	height: {
		type: "select",
		label: "Height",
		options: [
			{ label: "Small (400px)", value: "small" },
			{ label: "Medium (600px)", value: "medium" },
			{ label: "Large (800px)", value: "large" },
			{ label: "Full Screen", value: "full" },
		],
	},
	padding: {
		type: "select",
		label: "Padding",
		options: [
			{ label: "Small", value: "sm" },
			{ label: "Medium", value: "md" },
			{ label: "Large", value: "lg" },
			{ label: "Extra Large", value: "xl" },
		],
	},

	// Typography
	titleSize: {
		type: "select",
		label: "Title Size",
		options: [
			{ label: "3XL", value: "3xl" },
			{ label: "4XL", value: "4xl" },
			{ label: "5XL", value: "5xl" },
			{ label: "6XL", value: "6xl" },
			{ label: "7XL", value: "7xl" },
		],
	},
	subtitleSize: {
		type: "select",
		label: "Subtitle Size",
		options: [
			{ label: "Small", value: "sm" },
			{ label: "Medium", value: "md" },
			{ label: "Large", value: "lg" },
			{ label: "XLarge", value: "xl" },
		],
	},
	textColor: { type: "text", label: "Text Color" },

	// Media
	showImage: createCheckboxField("Show Side Image"),
	imageUrl: { type: "text", label: "Image URL" },
	imagePosition: {
		type: "select",
		label: "Image Position",
		options: [
			{ label: "Left", value: "left" },
			{ label: "Right", value: "right" },
		],
	},
	imageWidth: {
		type: "select",
		label: "Image Width",
		options: [
			{ label: "1/3", value: "1/3" },
			{ label: "1/2", value: "1/2" },
			{ label: "2/3", value: "2/3" },
		],
	},
	imageRounded: createCheckboxField("Rounded Image"),

	// Stats
	showStats: createCheckboxField("Show Stats"),
	stats: {
		type: "array",
		label: "Stats",
		arrayFields: {
			value: { type: "text", label: "Value" },
			label: { type: "text", label: "Label" },
		},
	},

	// Effects
	animation: {
		type: "select",
		label: "Animation",
		options: [
			{ label: "None", value: "none" },
			{ label: "Fade In", value: "fade-in" },
			{ label: "Slide Up", value: "slide-up" },
			{ label: "Zoom In", value: "zoom-in" },
			{ label: "Slide In Left", value: "slide-in-left" },
			{ label: "Slide In Right", value: "slide-in-right" },
		],
	},
	showScrollIndicator: createCheckboxField("Show Scroll Indicator"),

	// Advanced
	preset: {
		type: "select",
		label: "Preset",
		options: [
			{ label: "Default", value: "default" },
			{ label: "Modern", value: "modern" },
			{ label: "Minimal", value: "minimal" },
			{ label: "Bold", value: "bold" },
			{ label: "Startup", value: "startup" },
			{ label: "Agency", value: "agency" },
		],
	},
	shapeDivider: {
		type: "select",
		label: "Shape Divider",
		options: [
			{ label: "None", value: "none" },
			{ label: "Wave", value: "wave" },
			{ label: "Curve", value: "curve" },
			{ label: "Slant", value: "slant" },
			{ label: "Triangle", value: "triangle" },
		],
	},
};
