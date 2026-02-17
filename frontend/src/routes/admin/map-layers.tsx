import { createFileRoute } from "@tanstack/react-router";
import { MapLayersPage } from "@/features/map-layers/components/map-layers-page";

export const Route = createFileRoute("/admin/map-layers")({
	component: MapLayersPage,
});
