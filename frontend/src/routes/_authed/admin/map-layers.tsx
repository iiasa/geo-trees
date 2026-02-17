import { createFileRoute } from "@tanstack/react-router";
import { MapLayersPage } from "@/features/map-layers/components/map-layers-page";

export const Route = createFileRoute("/_authed/admin/map-layers")({
	component: MapLayersPage,
});
