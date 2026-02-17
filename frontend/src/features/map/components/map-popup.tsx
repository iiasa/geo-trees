import type { Feature } from "geojson";

interface MapPopupProps {
	feature: Feature;
}

export function MapPopup({ feature }: MapPopupProps) {
	const properties = feature.properties || {};
	return (
		<div className="p-2 max-w-xs">
			<h3 className="font-semibold text-sm text-gray-900 mb-1">
				{properties.name || properties.PlotId || "Feature"}
			</h3>
			<div className="space-y-0.5">
				{Object.entries(properties)
					.filter(([key]) => key !== "name" && key !== "PlotId")
					.slice(0, 6)
					.map(([key, value]) => (
						<div key={key} className="text-xs">
							<span className="text-gray-500">{key}:</span>{" "}
							<span className="text-gray-700">{String(value)}</span>
						</div>
					))}
			</div>
		</div>
	);
}
