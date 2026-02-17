import type { Config } from "@measured/puck";

// Import individual components
import { HeadingBlock } from "./components/heading-block";
import { TextBlock } from "./components/text-block";
import { ButtonBlock } from "./components/button-block";
import { ImageBlock } from "./components/image-block";
import { CardBlock } from "./components/card-block";
import { ListBlock } from "./components/list-block";
import { QuoteBlock } from "./components/quote-block";
import { VideoBlock } from "./components/video-block";
import { DividerBlock } from "./components/divider-block";
import { ContainerBlock } from "./components/container-block";
import { GridBlock } from "./components/grid-block";
import { FormBlock } from "./components/form-block";
import { WelcomeBlock } from "./components/welcome-block";
import { SpacerBlock } from "./components/spacer-block";
import { HeroBlock } from "./components/hero-block";
import { TestimonialBlock } from "./components/testimonial-block";
import { CarouselBlock } from "./components/carousel-block";
import { TableBlock } from "./components/table-block";
import { GalleryBlock } from "./components/gallery-block";
import { AccordionBlock } from "./components/accordion-block";
import { AlertBlock } from "./components/alert-block";
import { TabsBlock } from "./components/tabs-block";
import { CTABlock } from "./components/cta-block";
import { StatsBlock } from "./components/stats-block";

export const puckConfig: Config = {
	components: {
		// Register components with short keys to keep serialized JSON stable
		Heading: HeadingBlock,
		Text: TextBlock,
		Button: ButtonBlock,
		Image: ImageBlock,
		Card: CardBlock,
		List: ListBlock,
		Quote: QuoteBlock,
		Welcome: WelcomeBlock,
		Spacer: SpacerBlock,
		Testimonial: TestimonialBlock,
		Carousel: CarouselBlock,
		Table: TableBlock,
		Gallery: GalleryBlock,
		Hero: HeroBlock,
		Video: VideoBlock,
		Divider: DividerBlock,
		Container: ContainerBlock,
		Grid: GridBlock,
		Form: FormBlock,
		Accordion: AccordionBlock,
		Alert: AlertBlock,
		Tabs: TabsBlock,
		CTA: CTABlock,
		Stats: StatsBlock,
	},
};

export const defaultPuckData = {
	content: [],
	root: { props: {} },
};
