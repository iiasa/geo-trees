import type { ComponentType, ReactNode } from "react";
import { create } from "zustand";

export type ControlPosition =
	| "top-right"
	| "top-left"
	| "bottom-right"
	| "bottom-left";

export interface MapControl {
	id: string;
	icon: ComponentType<{ className?: string }>;
	title: string;
	position: ControlPosition;
	panel?: ReactNode;
	isOpen: boolean;
	onClick?: () => void;
	isDisplayOnly?: boolean;
}

interface MapControlsState {
	controls: MapControl[];
	setControls: (controls: MapControl[]) => void;
	toggleControl: (id: string) => void;
	closeAll: () => void;
}

export const useMapControlsStore = create<MapControlsState>((set) => ({
	controls: [],
	setControls: (controls) => set({ controls }),
	toggleControl: (id) =>
		set((state) => ({
			controls: state.controls.map((c) => {
				if (c.id === id) return { ...c, isOpen: !c.isOpen };
				const target = state.controls.find((t) => t.id === id);
				if (target && c.position === target.position && c.isOpen) {
					return { ...c, isOpen: false };
				}
				return c;
			}),
		})),
	closeAll: () =>
		set((state) => ({
			controls: state.controls.map((c) => ({ ...c, isOpen: false })),
		})),
}));
