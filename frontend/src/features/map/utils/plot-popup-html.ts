interface PlotProperties {
	plotId?: string;
	PlotId?: string;
	countryName?: string;
	Country?: string;
	network?: string;
	institution?: string;
	link?: string;
	yearEstablished?: string | number;
	siteDescription?: string;
	[key: string]: unknown;
}

const ACCENT = "#fbbf24";

function escape(value: unknown): string {
	if (value === null || value === undefined) return "";
	return String(value)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

export function buildPlotPopupHtml(properties: PlotProperties): string {
	const plotId = properties.plotId || properties.PlotId || "Plot";
	const country = properties.countryName || properties.Country || "";
	const network = properties.network;
	const institution = properties.institution;
	const link = properties.link;
	const year = properties.yearEstablished;
	const description = properties.siteDescription;

	const metaRows: string[] = [];
	if (network)
		metaRows.push(
			`<div style="display:flex;justify-content:space-between;gap:12px;font-size:12px;padding:4px 0"><span style="color:#6b7280;text-transform:uppercase;letter-spacing:0.04em;font-weight:600">Network</span><span style="color:#111;font-weight:500;text-align:right">${escape(network)}</span></div>`,
		);
	if (institution)
		metaRows.push(
			`<div style="display:flex;justify-content:space-between;gap:12px;font-size:12px;padding:4px 0"><span style="color:#6b7280;text-transform:uppercase;letter-spacing:0.04em;font-weight:600">Institution</span><span style="color:#111;font-weight:500;text-align:right">${escape(institution)}</span></div>`,
		);
	if (year)
		metaRows.push(
			`<div style="display:flex;justify-content:space-between;gap:12px;font-size:12px;padding:4px 0"><span style="color:#6b7280;text-transform:uppercase;letter-spacing:0.04em;font-weight:600">Established</span><span style="color:#111;font-weight:500;text-align:right">${escape(year)}</span></div>`,
		);

	const linkHtml = link
		? `<a href="${escape(link)}" target="_blank" rel="noopener noreferrer" style="display:inline-block;margin-top:10px;font-size:12px;color:#16a34a;font-weight:600;text-decoration:none">Visit site →</a>`
		: "";

	const descHtml = description
		? `<div style="font-size:13px;color:#374151;line-height:1.5;margin-top:10px;white-space:pre-line">${escape(description)}</div>`
		: "";

	return `
		<div style="min-width:240px;max-width:300px;font-family:system-ui,sans-serif">
			<div style="display:flex;align-items:center;gap:8px;padding:12px 16px;background:#1f2937">
				<span style="display:inline-block;width:10px;height:10px;transform:rotate(45deg);background:${ACCENT};border:1px solid rgba(255,255,255,0.6)"></span>
				<span style="font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:${ACCENT}">Plot</span>
			</div>
			<div style="padding:12px 16px 16px;background:#fff">
				${country ? `<div style="font-style:italic;color:#6b7280;font-size:12px;margin-bottom:2px">${escape(country)}</div>` : ""}
				<div style="font-weight:800;font-size:17px;color:#111;letter-spacing:-0.01em">${escape(plotId)}</div>
				${descHtml}
				${metaRows.length ? `<hr style="border:none;border-top:1px solid #e5e7eb;margin:12px 0"/><div>${metaRows.join("")}</div>` : ""}
				${linkHtml}
			</div>
		</div>
	`;
}
