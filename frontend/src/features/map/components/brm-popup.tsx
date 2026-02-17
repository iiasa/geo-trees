import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import type { MapGeoJSONFeature } from "maplibre-gl";
import {
	STATUS_LABELS,
	getStatusFromRaw,
	STATUS_COLORS,
} from "../utils/status-mapping";

interface BrmPopupProps {
	map: maplibregl.Map | null;
	pointLayerId: string;
}

function buildPopupHtml(feature: MapGeoJSONFeature): string {
	const props = feature.properties || {};
	const status = getStatusFromRaw(props.Status);
	const statusLabel = STATUS_LABELS[status];
	const statusColor = STATUS_COLORS[status];
	const coords =
		feature.geometry.type === "Point" ? feature.geometry.coordinates : [];
	const lat = coords[1]?.toFixed(2) ?? "";
	const lng = coords[0]?.toFixed(2) ?? "";

	const measurements = [
		props.ForestInventory === "1" ? "Forest plot inventory" : null,
		props.ALS_Measurements === "1" ? "ALS" : null,
		props.TLS_Measurements === "1" ? "TLS" : null,
	].filter(Boolean);

	const measurementHtml = measurements.length
		? measurements
				.map(
					(m) =>
						`<li style="display:flex;align-items:center;gap:6px;font-weight:600;font-size:14px;color:#111;margin-bottom:6px">
							<svg width="16" height="16" fill="none" stroke="#16a34a" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
							${m}
						</li>`,
				)
				.join("")
		: '<li style="color:#9ca3af;font-size:14px">None</li>';

	return `
		<div style="min-width:260px;max-width:320px;font-family:system-ui,sans-serif">
			<div style="display:flex;align-items:center;gap:8px;padding:12px 16px;background:#1f2937;border-radius:8px 8px 0 0">
				<span style="display:inline-block;width:12px;height:12px;transform:rotate(45deg);background:${statusColor};border:1px solid rgba(255,255,255,0.7)"></span>
				<span style="font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;color:${statusColor}">${statusLabel}</span>
			</div>
			<div style="padding:12px 16px 16px">
				<div style="font-style:italic;color:#6b7280;font-size:13px;margin-bottom:2px">${props.Country || ""}</div>
				<div style="font-weight:800;font-size:18px;color:#111;margin-bottom:2px">${props.Site || "BRM Site"}</div>
				<div style="font-size:11px;color:#9ca3af;margin-bottom:10px">
					LAT: <span style="color:#374151">${lat}</span> &nbsp; LNG: <span style="color:#374151">${lng}</span>
				</div>
				${props.SiteDescription ? `<div style="font-size:13px;color:#374151;line-height:1.5;margin-bottom:12px;white-space:pre-line">${props.SiteDescription}</div>` : ""}
				<hr style="border:none;border-top:1px solid #e5e7eb;margin:12px 0"/>
				<div style="font-size:13px;font-weight:600;color:#374151;margin-bottom:8px">Completed measurements:</div>
				<ul style="list-style:none;padding:0;margin:0">${measurementHtml}</ul>
			</div>
		</div>
	`;
}

export function BrmPopup({ map, pointLayerId }: BrmPopupProps) {
	const popupRef = useRef<maplibregl.Popup | null>(null);

	useEffect(() => {
		if (!map) return;

		const handleClick = (
			e: maplibregl.MapMouseEvent & { features?: MapGeoJSONFeature[] },
		) => {
			const features = map.queryRenderedFeatures(e.point, {
				layers: [pointLayerId],
			});
			if (!features.length) return;

			const feature = features[0];
			if (popupRef.current) popupRef.current.remove();

			const coords =
				feature.geometry.type === "Point"
					? (feature.geometry.coordinates.slice() as [number, number])
					: ([e.lngLat.lng, e.lngLat.lat] as [number, number]);

			popupRef.current = new maplibregl.Popup({
				closeOnClick: true,
				maxWidth: "360px",
			})
				.setLngLat(coords)
				.setHTML(buildPopupHtml(feature))
				.addTo(map);
		};

		map.on("click", pointLayerId, handleClick);
		return () => {
			map.off("click", pointLayerId, handleClick);
			if (popupRef.current) popupRef.current.remove();
		};
	}, [map, pointLayerId]);

	return null;
}
