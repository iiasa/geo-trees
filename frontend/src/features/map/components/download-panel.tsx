import { Download, FileJson, FileSpreadsheet } from "lucide-react";
import { useBrmData } from "./brm-layer";
import { Button } from "@/shared/components/ui/button";

export function DownloadPanel() {
	const { data } = useBrmData();

	const downloadGeoJson = () => {
		if (!data) return;
		const blob = new Blob([JSON.stringify(data, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "geotrees-brm-sites.geojson";
		a.click();
		URL.revokeObjectURL(url);
	};

	const downloadCsv = () => {
		if (!data) return;
		const features = data.features;
		if (!features.length) return;

		const allKeys = new Set<string>();
		for (const f of features) {
			for (const key of Object.keys(f.properties || {})) {
				allKeys.add(key);
			}
		}
		const headers = ["latitude", "longitude", ...allKeys];
		const rows = features.map((f) => {
			const coords = f.geometry.type === "Point" ? f.geometry.coordinates : [];
			const props = f.properties || {};
			return [
				coords[1]?.toString() ?? "",
				coords[0]?.toString() ?? "",
				...[...allKeys].map((k) => String(props[k] ?? "")),
			];
		});

		const csv = [
			headers.join(","),
			...rows.map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(",")),
		].join("\n");
		const blob = new Blob([csv], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "geotrees-brm-sites.csv";
		a.click();
		URL.revokeObjectURL(url);
	};

	return (
		<div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 border border-gray-200 shadow-lg w-56">
			<h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
				<Download className="size-4" />
				Download Data
			</h3>
			<div className="space-y-2">
				<Button
					variant="outline"
					size="sm"
					className="w-full justify-start gap-2"
					onClick={downloadGeoJson}
					disabled={!data}
				>
					<FileJson className="size-4" />
					GeoJSON
				</Button>
				<Button
					variant="outline"
					size="sm"
					className="w-full justify-start gap-2"
					onClick={downloadCsv}
					disabled={!data}
				>
					<FileSpreadsheet className="size-4" />
					CSV
				</Button>
			</div>
		</div>
	);
}
