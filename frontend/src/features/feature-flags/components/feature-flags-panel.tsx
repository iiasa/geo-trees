import { useEffect, useMemo, useState, useId } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import {
	featuresGetOptions,
	featuresUpdateMutation,
} from "@/infrastructure/api/@tanstack/react-query.gen";
import type {
	FeatureDto,
	FeatureGroupDto,
} from "@/infrastructure/api/types.gen";
import { FEATURE_FLAGS_LABELS } from "@/features/feature-flags/constants";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Switch } from "@/shared/components/ui/switch";

const groupKey = (name?: string | null, displayName?: string | null) =>
	displayName || name || FEATURE_FLAGS_LABELS.UNGROUPED;

const isBooleanValue = (value?: string | null) => {
	if (value === undefined || value === null) return false;
	const normalized = value.toLowerCase();
	return normalized === "true" || normalized === "false";
};

const toBoolean = (value?: string | null) => value?.toLowerCase() === "true";

const toStringValue = (value: boolean | string) =>
	typeof value === "boolean" ? String(value) : value;

type FeatureFlagsPanelProps = {
	providerName?: string;
	providerKey?: string;
	title?: string;
	description?: string;
	showProviderInputs?: boolean;
};

export function FeatureFlagsPanel({
	providerName: initialProviderName,
	providerKey: initialProviderKey,
	title = FEATURE_FLAGS_LABELS.TITLE,
	description = FEATURE_FLAGS_LABELS.DESCRIPTION,
	showProviderInputs = false,
}: FeatureFlagsPanelProps) {
	const [providerName, setProviderName] = useState(initialProviderName ?? "");
	const [providerKey, setProviderKey] = useState(initialProviderKey ?? "");
	const [searchTerm, setSearchTerm] = useState("");
	const [groups, setGroups] = useState<FeatureGroupDto[]>([]);
	const [features, setFeatures] = useState<FeatureDto[]>([]);
	const [filteredFeatures, setFilteredFeatures] = useState<FeatureDto[]>([]);
	const providerNameId = useId();
	const providerKeyId = useId();

	useEffect(() => {
		setProviderName(initialProviderName ?? "");
		setProviderKey(initialProviderKey ?? "");
	}, [initialProviderKey, initialProviderName]);

	const shouldSendProvider =
		providerName !== undefined || providerKey !== undefined;
	const queryParams = shouldSendProvider
		? {
				providerName: providerName ?? "",
				providerKey: providerKey ?? "",
			}
		: undefined;

	const { data, isLoading, refetch } = useQuery({
		...featuresGetOptions({
			query: queryParams,
		}),
	});

	const updateMutation = useMutation({
		...featuresUpdateMutation(),
	});

	useEffect(() => {
		if (data?.groups) {
			setGroups(data.groups);
			const flattened: FeatureDto[] = [];
			data.groups.forEach((group) => {
				group.features?.forEach((feature) => {
					flattened.push(feature);
				});
			});
			setFeatures(flattened);
			setFilteredFeatures(
				searchTerm.trim()
					? flattened.filter((feature) => {
							const needle = searchTerm.toLowerCase();
							const name = feature.name?.toLowerCase() ?? "";
							const display = feature.displayName?.toLowerCase() ?? "";
							const description = feature.description?.toLowerCase() ?? "";
							return (
								name.includes(needle) ||
								display.includes(needle) ||
								description.includes(needle)
							);
						})
					: flattened,
			);
		}
	}, [data?.groups, searchTerm]);

	const groupedFeatures = useMemo(() => {
		const filteredNames = new Set(
			filteredFeatures.map((feature) => feature.name ?? ""),
		);

		const result = new Map<string, FeatureDto[]>();

		groups.forEach((group) => {
			const key = groupKey(group.name, group.displayName);
			const items =
				group.features?.filter(
					(feature) => feature.name && filteredNames.has(feature.name),
				) ?? [];
			result.set(key, items);
		});

		return result;
	}, [filteredFeatures, groups]);

	const handleToggle = (feature: FeatureDto, checked: boolean) => {
		if (!feature.name) return;
		setFeatures((prev) =>
			prev.map((item) =>
				item.name === feature.name
					? { ...item, value: toStringValue(checked) }
					: item,
			),
		);
		setFilteredFeatures((prev) =>
			prev.map((item) =>
				item.name === feature.name
					? { ...item, value: toStringValue(checked) }
					: item,
			),
		);
	};

	const handleValueChange = (feature: FeatureDto, value: string) => {
		if (!feature.name) return;
		setFeatures((prev) =>
			prev.map((item) =>
				item.name === feature.name ? { ...item, value } : item,
			),
		);
		setFilteredFeatures((prev) =>
			prev.map((item) =>
				item.name === feature.name ? { ...item, value } : item,
			),
		);
	};

	const handleSave = async () => {
		if (!features.length) return;
		try {
			await updateMutation.mutateAsync({
				body: {
					features: features
						.filter((feature) => feature.name)
						.map((feature) => ({
							name: feature.name ?? "",
							value: feature.value ?? "",
						})),
				},
				query: queryParams,
			});
			await refetch();
			toast.success(FEATURE_FLAGS_LABELS.SUCCESS);
		} catch (error: unknown) {
			const message =
				error instanceof Error ? error.message : FEATURE_FLAGS_LABELS.ERROR;
			toast.error(message);
		}
	};

	const handleReset = () => {
		if (data?.groups) {
			setGroups(data.groups);
			const flattened: FeatureDto[] = [];
			data.groups.forEach((group) => {
				group.features?.forEach((feature) => {
					flattened.push(feature);
				});
			});
			setFeatures(flattened);
			setFilteredFeatures(flattened);
		}
	};

	const isSaving = updateMutation.isPending;
	const hasGroups = groupedFeatures.size > 0;

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-1">
				<h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
				<p className="text-muted-foreground">{description}</p>
			</div>

			{showProviderInputs && (
				<div className="grid gap-3 sm:grid-cols-2">
					<div className="flex flex-col gap-1">
						<label className="text-sm font-medium" htmlFor={providerNameId}>
							{FEATURE_FLAGS_LABELS.PROVIDER_NAME}
						</label>
						<Input
							id={providerNameId}
							value={providerName}
							onChange={(event) => setProviderName(event.target.value)}
							placeholder={FEATURE_FLAGS_LABELS.PROVIDER_NAME}
						/>
					</div>
					<div className="flex flex-col gap-1">
						<label className="text-sm font-medium" htmlFor={providerKeyId}>
							{FEATURE_FLAGS_LABELS.PROVIDER_KEY}
						</label>
						<Input
							id={providerKeyId}
							value={providerKey}
							onChange={(event) => setProviderKey(event.target.value)}
							placeholder={FEATURE_FLAGS_LABELS.PROVIDER_KEY}
						/>
					</div>
				</div>
			)}

			<div className="flex items-center">
				<Input
					value={searchTerm}
					onChange={(event) => setSearchTerm(event.target.value)}
					placeholder={FEATURE_FLAGS_LABELS.SEARCH_PLACEHOLDER}
				/>
			</div>

			<div className="flex items-center justify-end gap-2">
				<Button variant="outline" onClick={handleReset} disabled={isLoading}>
					{FEATURE_FLAGS_LABELS.RESET}
				</Button>
				<Button onClick={handleSave} disabled={isLoading || isSaving}>
					{isSaving ? FEATURE_FLAGS_LABELS.SAVING : FEATURE_FLAGS_LABELS.SAVE}
				</Button>
			</div>

			{isLoading ? (
				<div className="space-y-4">
					{["row-1", "row-2", "row-3"].map((rowKey) => (
						<Card key={`feature-skeleton-${rowKey}`}>
							<CardHeader>
								<Skeleton className="h-5 w-32" />
							</CardHeader>
							<CardContent className="space-y-3">
								{["col-1", "col-2", "col-3"].map((colKey) => (
									<div key={`feature-skeleton-${rowKey}-${colKey}`}>
										<Skeleton className="h-4 w-48" />
										<Skeleton className="h-3 w-64 mt-2" />
									</div>
								))}
							</CardContent>
						</Card>
					))}
				</div>
			) : hasGroups ? (
				Array.from(groupedFeatures.entries()).map(([name, featureList]) => (
					<Card key={name}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0">
							<CardTitle className="text-lg">{name}</CardTitle>
							<Badge variant="secondary">{featureList.length}</Badge>
						</CardHeader>
						<CardContent className="space-y-4">
							{featureList.map((feature) => (
								<div
									key={feature.name ?? crypto.randomUUID()}
									className="flex flex-col gap-2 border-b last:border-b-0 pb-4 last:pb-0"
								>
									<div className="flex items-center justify-between gap-4">
										<div className="flex flex-col gap-1">
											<span className="text-sm font-medium">
												{feature.displayName || feature.name}
											</span>
											{feature.description ? (
												<span className="text-sm text-muted-foreground">
													{feature.description}
												</span>
											) : null}
										</div>
										{isBooleanValue(feature.value) ? (
											<div className="flex items-center gap-2">
												<span className="text-xs text-muted-foreground">
													{FEATURE_FLAGS_LABELS.BOOL_OFF}
												</span>
												<Switch
													checked={toBoolean(feature.value)}
													onCheckedChange={(checked) =>
														handleToggle(feature, checked)
													}
													disabled={isSaving}
												/>
												<span className="text-xs text-muted-foreground">
													{FEATURE_FLAGS_LABELS.BOOL_ON}
												</span>
											</div>
										) : (
											<Input
												className="max-w-xs"
												value={feature.value ?? ""}
												onChange={(event) =>
													handleValueChange(feature, event.target.value)
												}
												placeholder={FEATURE_FLAGS_LABELS.VALUE_PLACEHOLDER}
												disabled={isSaving}
											/>
										)}
									</div>
								</div>
							))}
						</CardContent>
					</Card>
				))
			) : (
				<div className="text-center py-10 text-muted-foreground">
					{searchTerm
						? FEATURE_FLAGS_LABELS.GROUP_EMPTY_FILTERED
						: FEATURE_FLAGS_LABELS.GROUP_EMPTY}
				</div>
			)}
		</div>
	);
}
