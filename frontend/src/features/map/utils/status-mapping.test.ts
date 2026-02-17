import {
	STATUS_COLORS,
	getStatusColor,
	getStatusFromRaw,
} from "./status-mapping";

describe("getStatusFromRaw", () => {
	it("maps completed variations", () => {
		expect(getStatusFromRaw("completed")).toBe("completed");
		expect(getStatusFromRaw("Terminé")).toBe("completed");
		expect(getStatusFromRaw("DONE")).toBe("completed");
	});

	it("maps ongoing variations", () => {
		expect(getStatusFromRaw("ongoing")).toBe("ongoing");
		expect(getStatusFromRaw("En cours")).toBe("ongoing");
		expect(getStatusFromRaw("In Progress")).toBe("ongoing");
	});

	it("defaults to planned for unknown/empty", () => {
		expect(getStatusFromRaw(undefined)).toBe("planned");
		expect(getStatusFromRaw("")).toBe("planned");
		expect(getStatusFromRaw("unknown")).toBe("planned");
	});
});

describe("getStatusColor", () => {
	it("returns green for completed", () => {
		expect(getStatusColor("completed")).toBe(STATUS_COLORS.completed);
	});
});
