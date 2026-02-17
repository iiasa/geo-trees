import type { ComponentConfig } from "@measured/puck";
import { createCheckboxField } from "@/shared/components/puck-utils";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type CarouselSlide = {
	id: string;
	imageUrl: string;
	title: string;
	description: string;
	buttonText: string;
	buttonUrl: string;
	backgroundColor: string;
	textColor: string;
	textAlignment: "left" | "center" | "right";
	overlayOpacity: number;
};

export type CarouselBlockProps = {
	slides: CarouselSlide[];
	autoPlay: boolean;
	autoPlayInterval: number;
	showArrows: boolean;
	showDots: boolean;
	loop: boolean;
	pauseOnHover: boolean;
	height: string;
	width: string;
	maxWidth: string;
	padding: string;
	borderRadius: string;
	shadow: boolean;
	arrowColor: string;
	arrowBackgroundColor: string;
	dotColor: string;
	dotActiveColor: string;
};

export const CarouselBlock: ComponentConfig<CarouselBlockProps> = {
	fields: {
		slides: {
			type: "array",
			arrayFields: {
				id: { type: "text", label: "ID" },
				imageUrl: { type: "text", label: "Image URL" },
				title: { type: "text", label: "Title" },
				description: { type: "text", label: "Description" },
				buttonText: { type: "text", label: "Button Text" },
				buttonUrl: { type: "text", label: "Button URL" },
				backgroundColor: { type: "text", label: "Background Color" },
				textColor: { type: "text", label: "Text Color" },
				textAlignment: {
					type: "select",
					options: [
						{ label: "Left", value: "left" },
						{ label: "Center", value: "center" },
						{ label: "Right", value: "right" },
					],
					label: "Text Alignment",
				},
				overlayOpacity: { type: "number", label: "Overlay Opacity (0-1)" },
			},
			getItemSummary: (item) => item.title || "Slide",
			label: "Slides",
		},
		autoPlay: createCheckboxField("Auto Play"),
		autoPlayInterval: { type: "number", label: "Auto Play Interval (ms)" },
		showArrows: createCheckboxField("Show Arrows"),
		showDots: createCheckboxField("Show Dots"),
		loop: createCheckboxField("Loop"),
		pauseOnHover: createCheckboxField("Pause on Hover"),
		height: { type: "text", label: "Height" },
		width: { type: "text", label: "Width" },
		maxWidth: { type: "text", label: "Max Width" },
		padding: { type: "text", label: "Padding" },
		borderRadius: { type: "text", label: "Border Radius" },
		shadow: createCheckboxField("Shadow"),
		arrowColor: { type: "text", label: "Arrow Color" },
		arrowBackgroundColor: { type: "text", label: "Arrow Background Color" },
		dotColor: { type: "text", label: "Dot Color" },
		dotActiveColor: { type: "text", label: "Dot Active Color" },
	},
	render: ({
		slides,
		autoPlay,
		autoPlayInterval,
		showArrows,
		showDots,
		loop,
		pauseOnHover,
		height,
		width,
		maxWidth,
		padding,
		borderRadius,
		shadow,
		arrowColor,
		arrowBackgroundColor,
		dotColor,
		dotActiveColor,
	}) => {
		const [emblaRef, emblaApi] = useEmblaCarousel({ loop });

		const [selectedIndex, setSelectedIndex] = useState(0);
		const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
		const [isHovered, setIsHovered] = useState(false);

		// biome-ignore lint/suspicious/noExplicitAny: Embla API type
		const onInit = useCallback((emblaApi: any) => {
			setScrollSnaps(emblaApi.scrollSnapList());
		}, []);

		// biome-ignore lint/suspicious/noExplicitAny: Embla API type
		const onSelect = useCallback((emblaApi: any) => {
			setSelectedIndex(emblaApi.selectedScrollSnap());
		}, []);

		useEffect(() => {
			if (!emblaApi) return;

			onInit(emblaApi);
			onSelect(emblaApi);
			emblaApi.on("reInit", onInit);
			emblaApi.on("reInit", onSelect);
			emblaApi.on("select", onSelect);
		}, [emblaApi, onInit, onSelect]);

		// Manual Autoplay
		useEffect(() => {
			if (!autoPlay || !emblaApi) return;

			const interval = setInterval(() => {
				if (pauseOnHover && isHovered) return;
				emblaApi.scrollNext();
			}, autoPlayInterval);

			return () => clearInterval(interval);
		}, [autoPlay, autoPlayInterval, emblaApi, pauseOnHover, isHovered]);

		const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
		const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
		const scrollTo = useCallback(
			(index: number) => emblaApi?.scrollTo(index),
			[emblaApi],
		);

		return (
			<section
				aria-label="Carousel"
				className="carousel-block relative overflow-hidden"
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				style={{
					width,
					maxWidth: maxWidth === "full" ? "100%" : maxWidth,
					margin: "0 auto",
					padding,
					borderRadius,
					boxShadow: shadow
						? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
						: "none",
				}}
			>
				<div
					className="overflow-hidden h-full"
					ref={emblaRef}
					style={{ height }}
				>
					<div className="flex h-full">
						{slides.map((slide, index) => (
							<div
								key={slide.id || index}
								className="flex-[0_0_100%] min-w-0 relative h-full"
							>
								{/* Background Image */}
								{slide.imageUrl && (
									<div
										className="absolute inset-0 bg-cover bg-center"
										style={{ backgroundImage: `url(${slide.imageUrl})` }}
									/>
								)}

								{/* Overlay */}
								<div
									className="absolute inset-0"
									style={{
										backgroundColor: `rgba(0,0,0,${slide.overlayOpacity})`,
									}}
								/>

								{/* Content */}
								<div
									className="absolute inset-0 flex flex-col justify-center px-8 sm:px-16"
									style={{
										alignItems:
											slide.textAlignment === "left"
												? "flex-start"
												: slide.textAlignment === "right"
													? "flex-end"
													: "center",
										textAlign: slide.textAlignment,
										color: slide.textColor,
									}}
								>
									{slide.title && (
										<h2 className="text-3xl md:text-5xl font-bold mb-4">
											{slide.title}
										</h2>
									)}
									{slide.description && (
										<p className="text-lg md:text-xl mb-8 max-w-2xl">
											{slide.description}
										</p>
									)}
									{slide.buttonText && slide.buttonUrl && (
										<a
											href={slide.buttonUrl}
											className="px-6 py-3 rounded-md font-medium transition-colors"
											style={{
												backgroundColor: slide.backgroundColor || "#3b82f6",
												color: slide.textColor || "#ffffff",
											}}
										>
											{slide.buttonText}
										</a>
									)}
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Navigation Arrows */}
				{showArrows && (
					<>
						<button
							type="button"
							className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full cursor-pointer z-10 transition-opacity hover:opacity-80"
							onClick={scrollPrev}
							style={{
								backgroundColor: arrowBackgroundColor,
								color: arrowColor,
							}}
						>
							<ChevronLeft size={24} />
						</button>
						<button
							type="button"
							className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full cursor-pointer z-10 transition-opacity hover:opacity-80"
							onClick={scrollNext}
							style={{
								backgroundColor: arrowBackgroundColor,
								color: arrowColor,
							}}
						>
							<ChevronRight size={24} />
						</button>
					</>
				)}

				{/* Pagination Dots */}
				{showDots && (
					<div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
						{scrollSnaps.map((_, index) => (
							<button
								type="button"
								// biome-ignore lint/suspicious/noArrayIndexKey: Scroll snaps are index-based
								key={index}
								className="w-3 h-3 rounded-full transition-colors cursor-pointer"
								style={{
									backgroundColor:
										index === selectedIndex ? dotActiveColor : dotColor,
								}}
								onClick={() => scrollTo(index)}
							/>
						))}
					</div>
				)}
			</section>
		);
	},
	defaultProps: {
		slides: [
			{
				id: "1",
				imageUrl: "https://picsum.photos/1200/600?random=1",
				title: "Welcome Slide",
				description: "This is a description for the first slide.",
				buttonText: "Learn More",
				buttonUrl: "#",
				backgroundColor: "#3b82f6",
				textColor: "#ffffff",
				textAlignment: "center",
				overlayOpacity: 0.3,
			},
		],
		autoPlay: true,
		autoPlayInterval: 5000,
		showArrows: true,
		showDots: true,
		loop: true,
		pauseOnHover: true,
		height: "400px",
		width: "100%",
		maxWidth: "full",
		padding: "0",
		borderRadius: "8px",
		shadow: false,
		arrowColor: "#ffffff",
		arrowBackgroundColor: "rgba(0, 0, 0, 0.5)",
		dotColor: "rgba(255, 255, 255, 0.5)",
		dotActiveColor: "#ffffff",
	},
};
