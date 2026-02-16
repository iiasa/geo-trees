import { describe, it, expect, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useTenantConnectionStore } from "../tenant-connection-store";
import type { TenantDto } from "@/infrastructure/api/types.gen";

describe("useTenantConnectionStore", () => {
	let mockTenant: TenantDto;

	beforeEach(() => {
		// Reset store state before each test
		const store = useTenantConnectionStore.getState();
		store.closeModal();
		store.setLoading(false);
		store.setSaving(false);
		store.setError(null);

		mockTenant = {
			id: "1",
			name: "Test Tenant",
		};
	});

	it("should have correct initial state", () => {
		const { result } = renderHook(() => useTenantConnectionStore());

		expect(result.current.tenant).toBe(null);
		expect(result.current.open).toBe(false);
		expect(result.current.isLoading).toBe(false);
		expect(result.current.isSaving).toBe(false);
		expect(result.current.error).toBe(null);
		expect(result.current.connectionString).toBe("");
	});

	it("should open modal with tenant and connection string", () => {
		const { result } = renderHook(() => useTenantConnectionStore());
		const connectionString = "Server=localhost;Database=test;";

		act(() => {
			// @ts-expect-error - openModal is overridden to accept two parameters
			result.current.openModal(mockTenant, connectionString);
		});

		expect(result.current.open).toBe(true);
		expect(result.current.tenant).toEqual(mockTenant);
		expect(result.current.connectionString).toBe(connectionString);
	});

	it("should close modal and reset state", () => {
		const { result } = renderHook(() => useTenantConnectionStore());

		// First open modal
		act(() => {
			// @ts-expect-error - openModal is overridden to accept two parameters
			result.current.openModal(mockTenant, "test-connection-string");
		});

		expect(result.current.open).toBe(true);
		expect(result.current.tenant).toEqual(mockTenant);
		expect(result.current.connectionString).toBe("test-connection-string");

		// Then close modal
		act(() => {
			result.current.closeModal();
		});

		expect(result.current.open).toBe(false);
		expect(result.current.tenant).toBe(null);
		expect(result.current.connectionString).toBe("");
	});

	it("should set loading state", () => {
		const { result } = renderHook(() => useTenantConnectionStore());

		act(() => {
			result.current.setLoading(true);
		});

		expect(result.current.isLoading).toBe(true);

		act(() => {
			result.current.setLoading(false);
		});

		expect(result.current.isLoading).toBe(false);
	});

	it("should set saving state", () => {
		const { result } = renderHook(() => useTenantConnectionStore());

		act(() => {
			result.current.setSaving(true);
		});

		expect(result.current.isSaving).toBe(true);

		act(() => {
			result.current.setSaving(false);
		});

		expect(result.current.isSaving).toBe(false);
	});

	it("should set error state", () => {
		const { result } = renderHook(() => useTenantConnectionStore());

		act(() => {
			result.current.setError("Test error");
		});

		expect(result.current.error).toBe("Test error");

		act(() => {
			result.current.setError(null);
		});

		expect(result.current.error).toBe(null);
	});

	it("should set connection string", () => {
		const { result } = renderHook(() => useTenantConnectionStore());
		const connectionString = "Server=localhost;Database=test;";

		act(() => {
			result.current.setConnectionString(connectionString);
		});

		expect(result.current.connectionString).toBe(connectionString);
	});

	it("should reset state", () => {
		const { result } = renderHook(() => useTenantConnectionStore());

		// Modify state
		act(() => {
			// @ts-expect-error - openModal is overridden to accept two parameters
			result.current.openModal(mockTenant, "test-connection-string");
			result.current.setLoading(true);
			result.current.setSaving(true);
			result.current.setError("Test error");
		});

		expect(result.current.open).toBe(true);
		expect(result.current.tenant).toEqual(mockTenant);
		expect(result.current.isLoading).toBe(true);
		expect(result.current.isSaving).toBe(true);
		expect(result.current.error).toBe("Test error");
		expect(result.current.connectionString).toBe("test-connection-string");

		// Reset state
		act(() => {
			result.current.reset();
		});

		expect(result.current.open).toBe(false);
		expect(result.current.tenant).toBe(null);
		expect(result.current.isLoading).toBe(false);
		expect(result.current.isSaving).toBe(false);
		expect(result.current.error).toBe(null);
		expect(result.current.connectionString).toBe("");
	});

	it("should have base modal actions", () => {
		const { result } = renderHook(() => useTenantConnectionStore());

		expect(typeof result.current.openModal).toBe("function");
		expect(typeof result.current.closeModal).toBe("function");
		expect(typeof result.current.setLoading).toBe("function");
		expect(typeof result.current.setSaving).toBe("function");
		expect(typeof result.current.setError).toBe("function");
		expect(typeof result.current.reset).toBe("function");
	});

	it("should have tenant connection-specific actions", () => {
		const { result } = renderHook(() => useTenantConnectionStore());

		expect(typeof result.current.setConnectionString).toBe("function");
	});
});
