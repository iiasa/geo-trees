import { describe, it, expect, beforeEach } from "vitest";
import type { StoreApi } from "zustand";
import {
	createBaseStore,
	createInitialFormState,
	createFormStoreActions,
} from "./base-store";

interface TestState {
	name: string;
	age: number;
}

interface TestActions {
	updateName: (name: string) => void;
	updateAge: (age: number) => void;
}

type TestStore = TestState &
	TestActions & {
		isLoading: boolean;
		error: string | null;
		setLoading: (loading: boolean) => void;
		setError: (error: string | null) => void;
		reset: () => void;
	};

describe("Base Store Factory", () => {
	let store: StoreApi<TestStore>;

	beforeEach(() => {
		const initialState: TestState = {
			name: "John",
			age: 25,
		};

		const createActions = (
			set: (partial: Partial<TestStore>) => void,
			_get: () => TestStore,
		) => ({
			updateName: (name: string) => set({ name }),
			updateAge: (age: number) => set({ age }),
		});

		store = createBaseStore<TestState, TestActions>(
			initialState,
			createActions,
		);
	});

	it("should initialize with correct state", () => {
		const state = store.getState();
		expect(state.name).toBe("John");
		expect(state.age).toBe(25);
		expect(state.isLoading).toBe(false);
		expect(state.error).toBe(null);
	});

	it("should have base actions", () => {
		const state = store.getState();
		expect(typeof state.setLoading).toBe("function");
		expect(typeof state.setError).toBe("function");
		expect(typeof state.reset).toBe("function");
	});

	it("should have custom actions", () => {
		const state = store.getState();
		expect(typeof state.updateName).toBe("function");
		expect(typeof state.updateAge).toBe("function");
	});

	it("should update loading state", () => {
		store.getState().setLoading(true);
		expect(store.getState().isLoading).toBe(true);

		store.getState().setLoading(false);
		expect(store.getState().isLoading).toBe(false);
	});

	it("should update error state", () => {
		const error = "Test error";
		store.getState().setError(error);
		expect(store.getState().error).toBe(error);

		store.getState().setError(null);
		expect(store.getState().error).toBe(null);
	});

	it("should reset to initial state", () => {
		// Modify state
		store.getState().setLoading(true);
		store.getState().setError("error");
		store.getState().updateName("Jane");
		store.getState().updateAge(30);

		// Reset
		store.getState().reset();

		// Check reset state
		const state = store.getState();
		expect(state.isLoading).toBe(false);
		expect(state.error).toBe(null);
		expect(state.name).toBe("John");
		expect(state.age).toBe(25);
	});

	it("should update custom state", () => {
		store.getState().updateName("Jane");
		expect(store.getState().name).toBe("Jane");

		store.getState().updateAge(30);
		expect(store.getState().age).toBe(30);
	});
});

describe("Form Store Actions", () => {
	it("should create form store actions", () => {
		const actions = createFormStoreActions<{ id: string; name: string }>();
		expect(typeof actions.setData).toBe("function");
		expect(typeof actions.setSaving).toBe("function");
	});

	it("should create initial form state", () => {
		const initialData = { id: "1", name: "Test" };
		const state = createInitialFormState(initialData);

		expect(state.data).toEqual(initialData);
		expect(state.isLoading).toBe(false);
		expect(state.error).toBe(null);
		expect(state.isSaving).toBe(false);
	});

	it("should create initial form state with null data", () => {
		const state = createInitialFormState();

		expect(state.data).toBe(null);
		expect(state.isLoading).toBe(false);
		expect(state.error).toBe(null);
		expect(state.isSaving).toBe(false);
	});
});
