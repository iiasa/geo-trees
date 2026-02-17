import { expect, afterEach, beforeAll, afterAll } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import { setupServer } from "msw/node";
import { allHandlers } from "./mock-handlers";
import {
	URL as NodeURL,
	URLSearchParams as NodeURLSearchParams,
} from "node:url";
import "./test-utils";

// Comprehensive Global Mocks
function setupURL() {
	// Force use native URL from Node.js - this is needed for coverage provider
	// Always ensure it's the proper constructor (jsdom might override it)
	Object.defineProperty(global, "URL", {
		value: NodeURL,
		writable: true,
		configurable: true,
		enumerable: false,
	});
	Object.defineProperty(global, "URLSearchParams", {
		value: NodeURLSearchParams,
		writable: true,
		configurable: true,
		enumerable: false,
	});
	// Ensure createObjectURL and revokeObjectURL are available for browser APIs
	if (typeof global.URL.createObjectURL === "undefined") {
		Object.defineProperty(global.URL, "createObjectURL", {
			value: () => "mocked-url",
			writable: true,
			configurable: true,
		});
		Object.defineProperty(global.URL, "revokeObjectURL", {
			value: () => {},
			writable: true,
			configurable: true,
		});
	}
}

function setupResizeObserver() {
	class ResizeObserverMock {
		observe() {}
		unobserve() {}
		disconnect() {}
	}
	Object.defineProperty(global, "ResizeObserver", {
		value: ResizeObserverMock,
		writable: true,
		configurable: true,
	});
}

function setupStructuredClone() {
	if (typeof global.structuredClone === "undefined") {
		global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
	}
}

// Apply all mocks
setupURL();
setupResizeObserver();
setupStructuredClone();

// Extend expect with jest-dom matchers
expect.extend(matchers);

// Set up MSW server
const server = setupServer(...allHandlers);

// Start server before all tests
beforeAll(() => {
	server.listen({
		onUnhandledRequest: "warn",
	});
});

// Reset handlers after each test
afterEach(() => {
	server.resetHandlers();
	cleanup();
});

// Close server after all tests
afterAll(() => {
	server.close();
});
