import { Component, type ErrorInfo, type ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";

interface ErrorBoundaryProps {
	children: ReactNode;
	/**
	 * Custom fallback component to render when an error occurs
	 */
	fallback?: ReactNode;
	/**
	 * Callback function called when an error is caught
	 */
	onError?: (error: Error, errorInfo: ErrorInfo) => void;
	/**
	 * Custom error message to display
	 */
	errorMessage?: string;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
	errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component for catching and handling React errors
 *
 * @example
 * ```tsx
 * <ErrorBoundary
 *   onError={(error, errorInfo) => console.error(error, errorInfo)}
 *   errorMessage="Failed to load component"
 * >
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = {
			hasError: false,
			error: null,
			errorInfo: null,
		};
	}

	static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		// Log error details
		console.error("ErrorBoundary caught an error:", error, errorInfo);

		// Call the onError callback if provided
		this.props.onError?.(error, errorInfo);

		// Update state with error information
		this.setState({
			error,
			errorInfo,
		});
	}

	handleReset = (): void => {
		this.setState({
			hasError: false,
			error: null,
			errorInfo: null,
		});
	};

	render(): ReactNode {
		if (this.state.hasError) {
			// Use custom fallback if provided
			if (this.props.fallback) {
				return this.props.fallback;
			}

			// Default error UI
			return (
				<ErrorFallback
					error={this.state.error}
					errorInfo={this.state.errorInfo}
					onReset={this.handleReset}
					errorMessage={this.props.errorMessage}
				/>
			);
		}

		return this.props.children;
	}
}

/**
 * Default error fallback component
 */
function ErrorFallback({
	error,
	errorInfo,
	onReset,
	errorMessage,
}: {
	error: Error | null;
	errorInfo: ErrorInfo | null;
	onReset: () => void;
	errorMessage?: string;
}) {
	const isDevelopment = process.env.NODE_ENV === "development";

	return (
		<div className="p-4 space-y-4">
			<Alert variant="destructive">
				<AlertTitle>Something went wrong</AlertTitle>
				<AlertDescription>
					{errorMessage || "An unexpected error occurred. Please try again."}
				</AlertDescription>
			</Alert>

			<div className="flex gap-2">
				<Button onClick={onReset} variant="outline">
					Try Again
				</Button>
				<Button onClick={() => window.location.reload()} variant="outline">
					Reload Page
				</Button>
			</div>

			{isDevelopment && error && (
				<details className="mt-4 p-4 bg-muted rounded-lg text-sm">
					<summary className="cursor-pointer font-medium mb-2">
						Error Details (Development Only)
					</summary>
					<div className="space-y-2">
						<div>
							<strong>Error:</strong>
							<pre className="mt-1 p-2 bg-background rounded text-xs overflow-auto">
								{error.toString()}
							</pre>
						</div>
						{error.stack && (
							<div>
								<strong>Stack Trace:</strong>
								<pre className="mt-1 p-2 bg-background rounded text-xs overflow-auto">
									{error.stack}
								</pre>
							</div>
						)}
						{errorInfo?.componentStack && (
							<div>
								<strong>Component Stack:</strong>
								<pre className="mt-1 p-2 bg-background rounded text-xs overflow-auto">
									{errorInfo.componentStack}
								</pre>
							</div>
						)}
					</div>
				</details>
			)}
		</div>
	);
}

/**
 * Lightweight error boundary for inline components
 * Shows a minimal error message without full error details
 *
 * @example
 * ```tsx
 * <InlineErrorBoundary>
 *   <SmallComponent />
 * </InlineErrorBoundary>
 * ```
 */
export function InlineErrorBoundary({
	children,
	message = "Failed to load",
}: {
	children: ReactNode;
	message?: string;
}) {
	return (
		<ErrorBoundary
			fallback={
				<div className="p-2 text-sm text-destructive border border-destructive rounded">
					{message}
				</div>
			}
		>
			{children}
		</ErrorBoundary>
	);
}
