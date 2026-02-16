import {
	URL as NodeURL,
	URLSearchParams as NodeURLSearchParams,
} from "node:url";

// Mock global objects for testing
export default function () {
	// Force use native URL from Node.js - this is needed for coverage provider
	// Always override to ensure it's the proper constructor
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

	// Mock ResizeObserver
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

	// Mock structuredClone if not defined
	if (typeof global.structuredClone === "undefined") {
		global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
	}

	// Return a no-op cleanup function
	return () => {};
}
