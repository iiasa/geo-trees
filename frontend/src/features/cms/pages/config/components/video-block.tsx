import type { ComponentConfig } from "@measured/puck";
import { createCheckboxField } from "@/shared/components/puck-utils";
import { PUCK_COMPONENT_LABELS, PUCK_FIELD_LABELS } from "../../constants";

export const VideoBlock: ComponentConfig = {
	label: PUCK_COMPONENT_LABELS.VIDEO,
	fields: {
		videoUrl: {
			type: "text",
			label: PUCK_FIELD_LABELS.VIDEO_URL,
		},
		title: {
			type: "text",
			label: PUCK_FIELD_LABELS.TITLE,
		},
		description: {
			type: "textarea",
			label: PUCK_FIELD_LABELS.DESCRIPTION,
		},
		autoplay: createCheckboxField(PUCK_FIELD_LABELS.AUTOPLAY),
		controls: createCheckboxField(PUCK_FIELD_LABELS.CONTROLS),
	},
	defaultProps: {
		videoUrl: "",
		title: "",
		description: "",
		autoplay: false,
		controls: true,
	},
	render: ({ videoUrl, title, description, autoplay, controls }) => {
		if (!videoUrl) {
			return (
				<div className="flex items-center justify-center p-8 border border-dashed text-muted-foreground">
					No video URL provided
				</div>
			);
		}

		// Check if it's a YouTube URL
		const youtubeMatch = videoUrl.match(
			/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
		);
		if (youtubeMatch) {
			const videoId = youtubeMatch[1];
			return (
				<div className="my-4">
					{title && <h3 className="text-lg font-medium mb-2">{title}</h3>}
					{description && (
						<p className="text-muted-foreground mb-4">{description}</p>
					)}
					<div className="aspect-video">
						<iframe
							src={`https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&controls=${controls ? 1 : 0}`}
							title={title || "YouTube video"}
							frameBorder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
							className="w-full h-full rounded-md"
						></iframe>
					</div>
				</div>
			);
		}

		// For other video URLs, use HTML5 video element
		return (
			<div className="my-4">
				{title && <h3 className="text-lg font-medium mb-2">{title}</h3>}
				{description && (
					<p className="text-muted-foreground mb-4">{description}</p>
				)}
				<div className="aspect-video">
					{/* biome-ignore lint/a11y/useMediaCaption: Captions not yet supported in CMS */}
					<video
						src={videoUrl}
						controls={controls}
						autoPlay={autoplay}
						className="w-full h-full rounded-md"
					>
						Your browser does not support the video tag.
					</video>
				</div>
			</div>
		);
	},
};
