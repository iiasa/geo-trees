interface PageHeaderProps {
	title: string;
	description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
	return (
		<div className="mb-4 sm:mb-6">
			<h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
			{description && (
				<p className="text-sm sm:text-base text-muted-foreground mt-2">
					{description}
				</p>
			)}
		</div>
	);
}
