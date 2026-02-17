import { createCheckboxField } from "@/shared/components/puck-utils";
import type { ComponentConfig } from "@measured/puck";
import * as Dialog from "@radix-ui/react-dialog";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export type GalleryImage = {
	id: string;
	src: string;
	alt: string;
	caption: string;
	width: number;
	height: number;
};

export type GalleryBlockProps = {
	layout: "grid" | "masonry";
	columns: number;
	gap: string;
	padding: string;
	images: GalleryImage[];
	borderRadius: string;
	shadow: boolean;
	hoverEffect: "none" | "zoom" | "grayscale";
	lightbox: boolean;
	lightboxTheme: "light" | "dark";
	showCaptions: boolean;
	showThumbnails: boolean;
	mobileColumns: number;
	tabletColumns: number;
	lazyLoading: boolean;
	aspectRatio: "auto" | "square" | "video" | "portrait";
	imageQuality: "low" | "medium" | "high";
};

export const GalleryBlock: ComponentConfig<GalleryBlockProps> = {
	fields: {
		images: {
			type: "array",
			arrayFields: {
				id: { type: "text", label: "ID" },
				src: { type: "text", label: "Image URL" },
				alt: { type: "text", label: "Alt Text" },
				caption: { type: "text", label: "Caption" },
				width: { type: "number", label: "Width" },
				height: { type: "number", label: "Height" },
			},
			getItemSummary: (item) => item.alt || "Image",
			label: "Images",
		},
		layout: {
			type: "select",
			options: [
				{ label: "Grid", value: "grid" },
				{ label: "Masonry", value: "masonry" }, // CSS Grids make true masonry hard without JS lib, but we'll approximate or stick to grid for now
			],
			label: "Layout",
		},
		columns: {
			type: "number",
			label: "Columns (Desktop)",
			min: 1,
			max: 6,
		},
		gap: { type: "text", label: "Gap" },
		padding: { type: "text", label: "Padding" },
		borderRadius: { type: "text", label: "Border Radius" },
		shadow: createCheckboxField("Shadow"),
		hoverEffect: {
			type: "select",
			options: [
				{ label: "None", value: "none" },
				{ label: "Zoom", value: "zoom" },
				{ label: "Grayscale", value: "grayscale" },
			],
			label: "Hover Effect",
		},
		lightbox: createCheckboxField("Enable Lightbox"),
		lightboxTheme: {
			type: "select",
			options: [
				{ label: "Light", value: "light" },
				{ label: "Dark", value: "dark" },
			],
			label: "Lightbox Theme",
		},
		showCaptions: createCheckboxField("Show Captions"),
		showThumbnails: createCheckboxField("Show Thumbnails"),
		mobileColumns: {
			type: "number",
			label: "Columns (Mobile)",
			min: 1,
			max: 3,
		},
		tabletColumns: {
			type: "number",
			label: "Columns (Tablet)",
			min: 1,
			max: 4,
		},
		lazyLoading: createCheckboxField("Lazy Loading"),
		imageQuality: {
			type: "select",
			options: [
				{ label: "Low", value: "low" },
				{ label: "Medium", value: "medium" },
				{ label: "High", value: "high" },
			],
			label: "Image Quality",
		},
		aspectRatio: {
			type: "select",
			options: [
				{ label: "Auto", value: "auto" },
				{ label: "Square (1:1)", value: "square" },
				{ label: "Video (16:9)", value: "video" },
				{ label: "Portrait (3:4)", value: "portrait" },
			],
			label: "Aspect Ratio",
		},
	},
	render: ({
		// layout, // Unused for now
		columns,
		gap,
		padding,
		images,
		borderRadius,
		shadow,
		hoverEffect,
		lightbox,
		// lightboxTheme, // Unused for now
		showCaptions,
		mobileColumns,
		tabletColumns,
		lazyLoading,
		aspectRatio,
	}) => {
		const [isOpen, setIsOpen] = useState(false);
		const [currentIndex, setCurrentIndex] = useState(0);

		const openLightbox = (index: number) => {
			if (!lightbox) return;
			setCurrentIndex(index);
			setIsOpen(true);
		};

		const nextImage = () => {
			setCurrentIndex((prev) => (prev + 1) % images.length);
		};

		const prevImage = () => {
			setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
		};

		const getAspectRatioClass = () => {
			switch (aspectRatio) {
				case "square":
					return "aspect-square";
				case "video":
					return "aspect-video";
				case "portrait":
					return "aspect-[3/4]";
				default:
					return "";
			}
		};

		const getHoverClass = () => {
			switch (hoverEffect) {
				case "zoom":
					return "group-hover:scale-105 transition-transform duration-300";
				case "grayscale":
					return "grayscale group-hover:grayscale-0 transition-[filter] duration-300";
				default:
					return "";
			}
		};

		return (
			<div
				style={
					{
						padding,
						"--gallery-cols-desktop": columns,
						"--gallery-cols-tablet": tabletColumns,
						"--gallery-cols-mobile": mobileColumns,
					} as React.CSSProperties
				}
			>
				<div
					className="gallery-grid"
					style={{
						gap,
					}}
				>
					{images.map((image, index) => (
						<button
							type="button"
							// biome-ignore lint/suspicious/noArrayIndexKey: Images order is relevant for gallery index
							key={index}
							className={`relative group overflow-hidden cursor-pointer w-full text-left p-0 border-0 ${shadow ? "shadow-md" : ""}`}
							style={{ borderRadius }}
							onClick={() => openLightbox(index)}
						>
							<div
								className={`w-full overflow-hidden ${getAspectRatioClass()}`}
							>
								<img
									src={image.src}
									alt={image.alt}
									loading={lazyLoading ? "lazy" : "eager"}
									className={`w-full h-full object-cover ${getHoverClass()}`}
								/>
							</div>
							{showCaptions && image.caption && (
								<div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
									<p className="text-white text-sm truncate">{image.caption}</p>
								</div>
							)}
						</button>
					))}
				</div>

				<Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
					<Dialog.Portal>
						<Dialog.Overlay className="fixed inset-0 bg-black/90 z-50 animate-fade-in" />
						<Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
							<div className="relative w-full h-full flex flex-col items-center justify-center p-4 pointer-events-auto">
								<Dialog.Close asChild>
									<button
										type="button"
										className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors bg-black/20 p-2 rounded-full backdrop-blur-sm z-50"
									>
										<X size={24} />
									</button>
								</Dialog.Close>

								<div className="relative max-w-full max-h-full flex items-center justify-center">
									{/* Navigation Buttons */}
									{images.length > 1 && (
										<>
											<button
												type="button"
												onClick={(e) => {
													e.stopPropagation();
													prevImage();
												}}
												className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black/20 p-2 rounded-full backdrop-blur-sm z-50"
											>
												<ChevronLeft size={32} />
											</button>

											<button
												type="button"
												onClick={(e) => {
													e.stopPropagation();
													nextImage();
												}}
												className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black/20 p-2 rounded-full backdrop-blur-sm z-50"
											>
												<ChevronRight size={32} />
											</button>
										</>
									)}

									<img
										src={images[currentIndex]?.src}
										alt={images[currentIndex]?.alt}
										className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm"
									/>
								</div>
								{showCaptions && images[currentIndex]?.caption && (
									<div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
										<p className="inline-block bg-black/60 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
											{images[currentIndex]?.caption}
										</p>
									</div>
								)}
							</div>
						</Dialog.Content>
					</Dialog.Portal>
				</Dialog.Root>
			</div>
		);
	},
	defaultProps: {
		layout: "grid",
		columns: 3,
		gap: "16px",
		padding: "16px",
		images: [
			{
				id: "1",
				src: "https://picsum.photos/800/600?random=1",
				alt: "Sample Image 1",
				caption: "Beautiful landscape",
				width: 800,
				height: 600,
			},
			{
				id: "2",
				src: "https://picsum.photos/800/600?random=2",
				alt: "Sample Image 2",
				caption: "City skyline",
				width: 800,
				height: 600,
			},
			{
				id: "3",
				src: "https://picsum.photos/800/600?random=3",
				alt: "Sample Image 3",
				caption: "Nature photography",
				width: 800,
				height: 600,
			},
		],
		borderRadius: "8px",
		shadow: true,
		hoverEffect: "zoom",
		lightbox: true,
		lightboxTheme: "light",
		showCaptions: true,
		showThumbnails: false,
		mobileColumns: 1,
		tabletColumns: 2,
		lazyLoading: true,
		aspectRatio: "auto",
		imageQuality: "medium",
	},
};
