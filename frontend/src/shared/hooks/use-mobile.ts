import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
	// Always start with false to ensure server and client match during hydration
	const [isMobile, setIsMobile] = React.useState<boolean>(false);

	React.useEffect(() => {
		// Only check window size after component mounts (client-side only)
		// Use matchMedia for efficient change detection
		const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

		// Set initial value based on matchMedia
		const updateIsMobile = () => {
			const newValue = mql.matches;
			// Use functional update to ensure we're comparing with latest state
			// Only update if value actually changed to prevent unnecessary re-renders
			setIsMobile((prev) => {
				if (prev !== newValue) {
					return newValue;
				}
				return prev;
			});
		};

		// Set initial value after mount
		updateIsMobile();

		// Listen for changes using matchMedia (more efficient than resize)
		mql.addEventListener("change", updateIsMobile);

		return () => {
			mql.removeEventListener("change", updateIsMobile);
		};
	}, []);

	return isMobile;
}

// Table hook for managing table state
export function useTable<T>(initialData: T[] = []) {
	const [data, setData] = React.useState<T[]>(initialData);
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);
	const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }[]>(
		[],
	);
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 10,
	});

	return {
		data,
		setData,
		loading,
		setLoading,
		error,
		setError,
		sorting,
		setSorting,
		pagination,
		setPagination,
	};
}
