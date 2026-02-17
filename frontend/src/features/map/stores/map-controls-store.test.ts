import { Plus, Minus } from "lucide-react";
import { useMapControlsStore } from "./map-controls-store";

describe("map-controls-store", () => {
	beforeEach(() => {
		useMapControlsStore.setState({ controls: [] });
	});

	it("sets controls", () => {
		const controls = [
			{
				id: "test",
				icon: Plus,
				title: "Test",
				position: "top-right" as const,
				isOpen: false,
			},
		];
		useMapControlsStore.getState().setControls(controls);
		expect(useMapControlsStore.getState().controls).toHaveLength(1);
	});

	it("toggles control open", () => {
		useMapControlsStore.getState().setControls([
			{
				id: "a",
				icon: Plus,
				title: "A",
				position: "top-right" as const,
				isOpen: false,
			},
		]);
		useMapControlsStore.getState().toggleControl("a");
		expect(
			useMapControlsStore.getState().controls.find((c) => c.id === "a")?.isOpen,
		).toBe(true);
	});

	it("closes other controls at same position on toggle", () => {
		useMapControlsStore.getState().setControls([
			{
				id: "a",
				icon: Plus,
				title: "A",
				position: "top-right" as const,
				isOpen: true,
			},
			{
				id: "b",
				icon: Minus,
				title: "B",
				position: "top-right" as const,
				isOpen: false,
			},
		]);
		useMapControlsStore.getState().toggleControl("b");
		const controls = useMapControlsStore.getState().controls;
		expect(controls.find((c) => c.id === "a")?.isOpen).toBe(false);
		expect(controls.find((c) => c.id === "b")?.isOpen).toBe(true);
	});

	it("does not affect controls at different positions", () => {
		useMapControlsStore.getState().setControls([
			{
				id: "a",
				icon: Plus,
				title: "A",
				position: "top-right" as const,
				isOpen: true,
			},
			{
				id: "b",
				icon: Minus,
				title: "B",
				position: "bottom-left" as const,
				isOpen: false,
			},
		]);
		useMapControlsStore.getState().toggleControl("b");
		const controls = useMapControlsStore.getState().controls;
		expect(controls.find((c) => c.id === "a")?.isOpen).toBe(true);
		expect(controls.find((c) => c.id === "b")?.isOpen).toBe(true);
	});

	it("closeAll closes everything", () => {
		useMapControlsStore.getState().setControls([
			{
				id: "a",
				icon: Plus,
				title: "A",
				position: "top-right" as const,
				isOpen: true,
			},
			{
				id: "b",
				icon: Minus,
				title: "B",
				position: "bottom-left" as const,
				isOpen: true,
			},
		]);
		useMapControlsStore.getState().closeAll();
		expect(
			useMapControlsStore.getState().controls.every((c) => !c.isOpen),
		).toBe(true);
	});
});
