import {
	STATUS_LABELS,
	getStatusFromRaw,
	STATUS_COLORS,
} from "./status-mapping";

export function buildBrmPopupHtml(properties: Record<string, string>): string {
	const status = getStatusFromRaw(properties.Status);
	const statusLabel = STATUS_LABELS[status];
	const statusColor = STATUS_COLORS[status];
	const measurements = [
		properties.ForestInventory === "1" ? "Forest plot inventory" : null,
		properties.ALS_Measurements === "1" ? "ALS" : null,
		properties.TLS_Measurements === "1" ? "TLS" : null,
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
				<div style="font-style:italic;color:#6b7280;font-size:13px;margin-bottom:2px">${properties.Country || ""}</div>
				<div style="font-weight:800;font-size:18px;color:#111;margin-bottom:10px">${properties.Site || "BRM Site"}</div>
				${properties.SiteDescription ? `<div style="font-size:13px;color:#374151;line-height:1.5;margin-bottom:12px;white-space:pre-line">${properties.SiteDescription}</div>` : ""}
				<hr style="border:none;border-top:1px solid #e5e7eb;margin:12px 0"/>
				<div style="font-size:13px;font-weight:600;color:#374151;margin-bottom:8px">Completed measurements:</div>
				<ul style="list-style:none;padding:0;margin:0">${measurementHtml}</ul>
			</div>
		</div>
	`;
}
