export type GeoTreesStatus = "completed" | "ongoing" | "planned";

const statusMap: Record<string, GeoTreesStatus | undefined> = {
	terminé: "completed",
	completed: "completed",
	completé: "completed",
	complet: "completed",
	finished: "completed",
	done: "completed",
	"en cours": "ongoing",
	ongoing: "ongoing",
	"in progress": "ongoing",
	progress: "ongoing",
	active: "ongoing",
	running: "ongoing",
	futur: "planned",
	planned: "planned",
	planifié: "planned",
	future: "planned",
	scheduled: "planned",
	proposed: "planned",
};

export const STATUS_COLORS: Record<GeoTreesStatus, string> = {
	completed: "#22c55e",
	ongoing: "#eab308",
	planned: "#6b7280",
};

export const STATUS_LABELS: Record<GeoTreesStatus, string> = {
	completed: "Completed",
	ongoing: "Ongoing",
	planned: "Planned",
};

export function getStatusFromRaw(
	rawStatus: string | undefined,
): GeoTreesStatus {
	if (!rawStatus || rawStatus.trim() === "") return "planned";
	return statusMap[rawStatus.toLowerCase()] ?? "planned";
}

export function getStatusColor(rawStatus: string | undefined): string {
	return STATUS_COLORS[getStatusFromRaw(rawStatus)];
}
