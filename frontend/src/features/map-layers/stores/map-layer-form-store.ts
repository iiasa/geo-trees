import type { MapLayerDto } from "@/infrastructure/api/types.gen";
import { create } from "zustand";
import {
	type BaseFormStore,
	createFormStoreActions,
	createInitialFormState,
} from "@/shared/stores/base-store";

interface MapLayerFormActions {
	setLoading: (loading: boolean) => void;
	openCreateForm: () => void;
	openEditForm: (mapLayer: MapLayerDto) => void;
	closeForm: () => void;
}

type MapLayerFormStore = BaseFormStore<MapLayerDto> & {
	mapLayer: MapLayerDto | null;
	open: boolean;
} & MapLayerFormActions;

const initialState = {
	...createInitialFormState<MapLayerDto>(),
	mapLayer: null,
	open: false,
};

export const useMapLayerFormStore = create<MapLayerFormStore>((set, _get) => ({
	...initialState,

	...createFormStoreActions<MapLayerDto>(),

	setLoading: (loading: boolean) => set({ isLoading: loading }),
	openCreateForm: () => set({ mapLayer: null, open: true }),
	openEditForm: (mapLayer: MapLayerDto) => set({ mapLayer, open: true }),
	closeForm: () => set({ mapLayer: null, open: false }),
}));
