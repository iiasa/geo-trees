import { useQuery } from "@tanstack/react-query";
import type { FeatureCollection, Point } from "geojson";
import { getStatusFromRaw } from "../utils/status-mapping";

function processFeatures(data: FeatureCollection): FeatureCollection<Point> {
	const features = (data.features ?? [])
		.filter((f) => f.geometry?.type === "Point")
		.map((f) => ({
			...f,
			geometry: f.geometry as Point,
			properties: {
				...f.properties,
				_statusColor: getStatusFromRaw(f.properties?.Status),
			},
		}));
	return { type: "FeatureCollection", features } as FeatureCollection<Point>;
}

export function useBrmData() {
	return useQuery({
		queryKey: ["brm-sites-geojson"],
		queryFn: async () => {
			const res = await fetch(
				"/api/proxy/api/app/external-data/google-sheet-geo-json",
			);
			if (!res.ok) throw new Error(`Failed to fetch BRM data: ${res.status}`);
			const raw = (await res.json()) as FeatureCollection;
			return processFeatures(raw);
		},
		staleTime: 60 * 60 * 1000,
		gcTime: 24 * 60 * 60 * 1000,
	});
}
