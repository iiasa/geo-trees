interface PageLayoutProps {
	children: React.ReactNode;
	className?: string;
}

export function PageLayout({ children, className }: PageLayoutProps) {
	return (
		<div className={`px-4 sm:px-6 lg:px-8 py-4 sm:py-6 ${className || ""}`}>
			{children}
		</div>
	);
}
