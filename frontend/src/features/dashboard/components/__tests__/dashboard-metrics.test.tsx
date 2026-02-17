import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DashboardMetrics } from "../dashboard-metrics";

describe("DashboardMetrics", () => {
	const defaultProps = {
		totalUsers: 100,
		activeUsers: 75,
		totalRoles: 10,
		totalTenants: 5,
	};

	it("should render all metric cards", () => {
		render(<DashboardMetrics {...defaultProps} />);

		expect(screen.getByTestId("metric-total-users")).toBeInTheDocument();
		expect(screen.getByTestId("metric-active-users")).toBeInTheDocument();
		expect(screen.getByTestId("metric-total-roles")).toBeInTheDocument();
		expect(screen.getByTestId("metric-total-tenants")).toBeInTheDocument();
	});

	it("should display correct values", () => {
		render(<DashboardMetrics {...defaultProps} />);

		// Use test IDs to get specific values
		expect(screen.getByTestId("metric-total-users")).toHaveTextContent("100");
		expect(screen.getByTestId("metric-active-users")).toHaveTextContent("75");
		expect(screen.getByTestId("metric-total-roles")).toHaveTextContent("10");
		expect(screen.getByTestId("metric-total-tenants")).toHaveTextContent("5");
	});

	it("should display active users percentage with one decimal place", () => {
		const props = { ...defaultProps, activeUsers: 50, totalUsers: 75 };
		render(<DashboardMetrics {...props} />);

		expect(screen.getByTestId("metric-active-users")).toHaveTextContent("50");
		// Active rate should be 66.7% (50/75)
		expect(screen.getByText("66.7%")).toBeInTheDocument();
	});

	it("should handle zero values", () => {
		const zeroProps = {
			totalUsers: 0,
			activeUsers: 0,
			totalRoles: 0,
			totalTenants: 0,
		};

		render(<DashboardMetrics {...zeroProps} />);

		expect(screen.getByTestId("metric-total-users")).toHaveTextContent("0");
		expect(screen.getByTestId("metric-active-users")).toHaveTextContent("0");
		expect(screen.getByTestId("metric-total-roles")).toHaveTextContent("0");
		expect(screen.getByTestId("metric-total-tenants")).toHaveTextContent("0");
	});

	it("should handle edge case with all users active", () => {
		const allActiveProps = {
			totalUsers: 50,
			activeUsers: 50,
			totalRoles: 10,
			totalTenants: 5,
		};

		render(<DashboardMetrics {...allActiveProps} />);

		expect(screen.getByTestId("metric-total-users")).toHaveTextContent("50");
		expect(screen.getByTestId("metric-active-users")).toHaveTextContent("50");
		expect(screen.getByText("100.0%")).toBeInTheDocument();
	});

	it("should have correct card titles", () => {
		render(<DashboardMetrics {...defaultProps} />);

		expect(screen.getByText("Total Users")).toBeInTheDocument();
		expect(screen.getByText("Active Users")).toBeInTheDocument();
		expect(screen.getByText("Total Roles")).toBeInTheDocument();
		expect(screen.getByText("Total Tenants")).toBeInTheDocument();
	});

	it("should have descriptive text", () => {
		render(<DashboardMetrics {...defaultProps} />);

		expect(screen.getByText("All registered users")).toBeInTheDocument();
		expect(screen.getByText("Active rate")).toBeInTheDocument();
		expect(screen.getByText("All system roles")).toBeInTheDocument();
		expect(screen.getByText("All system tenants")).toBeInTheDocument();
	});
});
