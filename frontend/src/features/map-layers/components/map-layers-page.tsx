import { PageHeader } from "@/shared/components/page-header";
import { PageLayout } from "@/shared/components/page-layout";
import { MAP_LAYER_PAGE_CONSTANTS } from "../constants";
import { MapLayersList } from "./map-layers-list";

export function MapLayersPage() {
	return (
		<PageLayout>
			<PageHeader
				title={MAP_LAYER_PAGE_CONSTANTS.TITLE}
				description={MAP_LAYER_PAGE_CONSTANTS.DESCRIPTION}
			/>
			<MapLayersList />
		</PageLayout>
	);
}
