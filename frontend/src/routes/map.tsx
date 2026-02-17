import { createFileRoute } from "@tanstack/react-router";
import { MapPage } from "@/features/map/components/map-page";

export const Route = createFileRoute("/map")({
	component: MapPage,
});
