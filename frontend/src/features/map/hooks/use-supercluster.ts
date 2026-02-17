import { useMemo, useCallback } from "react";
import Supercluster from "supercluster";
import type { BBox, Feature, Point, GeoJsonProperties } from "geojson";

interface UseSuperclusterOptions {
	points: Feature<Point, GeoJsonProperties>[];
	bounds: BBox | undefined;
	zoom: number;
	options?: Supercluster.Options<GeoJsonProperties, GeoJsonProperties>;
}

export function useSupercluster({
	points,
	bounds,
	zoom,
	options = {},
}: UseSuperclusterOptions) {
	const supercluster = useMemo(() => {
		const sc = new Supercluster({
			radius: 60,
			maxZoom: 16,
			...options,
		});
		sc.load(points);
		return sc;
	}, [points, options]);

	const clusters = useMemo(() => {
		if (!bounds) return [];
		return supercluster.getClusters(bounds, Math.floor(zoom));
	}, [supercluster, bounds, zoom]);

	const getExpansionZoom = useCallback(
		(clusterId: number) => {
			try {
				return supercluster.getClusterExpansionZoom(clusterId);
			} catch {
				return zoom + 2;
			}
		},
		[supercluster, zoom],
	);

	return { clusters, supercluster, getExpansionZoom };
}
