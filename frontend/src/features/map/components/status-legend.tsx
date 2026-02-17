import { useBrmData } from "./brm-layer";
import {
	getStatusFromRaw,
	STATUS_COLORS,
	STATUS_LABELS,
	type GeoTreesStatus,
} from "../utils/status-mapping";

interface StatusLegendProps {
	visible: boolean;
}

export function StatusLegend({ visible }: StatusLegendProps) {
	const { data } = useBrmData();

	if (!visible || !data) return null;

	const counts: Record<GeoTreesStatus, number> = {
		completed: 0,
		ongoing: 0,
		planned: 0,
	};
	for (const feature of data.features) {
		const status = getStatusFromRaw(feature.properties?.Status);
		counts[status]++;
	}

	const entries = (
		Object.entries(counts) as [GeoTreesStatus, number][]
	).filter(([, count]) => count > 0);

	if (entries.length === 0) return null;

	return (
		<div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 border border-gray-200 shadow-lg">
			<h4 className="text-xs font-semibold text-gray-900 mb-2">
				BRM Sites Status
			</h4>
			<div className="space-y-1.5">
				{entries.map(([status, count]) => (
					<div key={status} className="flex items-center gap-2">
						<span
							className="inline-block w-3 h-3 rounded-full shrink-0"
							style={{ backgroundColor: STATUS_COLORS[status] }}
						/>
						<span className="text-xs text-gray-700">
							{STATUS_LABELS[status]} ({count})
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
