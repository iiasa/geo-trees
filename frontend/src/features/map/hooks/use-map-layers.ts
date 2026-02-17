import { useQuery } from "@tanstack/react-query";
import { getApiAppMapLayerOptions } from "@/infrastructure/api/@tanstack/react-query.gen";

export function useMapLayers() {
	const { data, isLoading } = useQuery(
		getApiAppMapLayerOptions({ query: { MaxResultCount: 100 } }),
	);

	return {
		layers: data?.items ?? [],
		isLoading,
	};
}
