import type { Resolver } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useEffect } from "react";

import type { MapLayerDto } from "@/infrastructure/api/types.gen";
import { useMapLayerFormStore } from "../stores/map-layer-form-store";
import { Button } from "@/shared/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/shared/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Switch } from "@/shared/components/ui/switch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select";

const mapLayerFormSchema = z.object({
	name: z.string().min(1, "Name is required"),
	type: z.coerce.number(),
	url: z.string().optional(),
	sourceEndpoint: z.string().optional(),
	layers: z.string().optional(),
	format: z.string().optional(),
	isVisible: z.boolean(),
	legendUrl: z.string().optional(),
	attribution: z.string().optional(),
	order: z.coerce.number(),
	groupName: z.string().min(1, "Group name is required"),
});

export type MapLayerFormData = z.infer<typeof mapLayerFormSchema>;

interface MapLayerFormProps {
	mapLayer?: MapLayerDto | null;
	onSubmit: (data: MapLayerFormData) => Promise<void>;
	isLoading?: boolean;
	mode: "create" | "edit";
}

export function MapLayerForm({
	mapLayer,
	onSubmit,
	isLoading = false,
	mode,
}: MapLayerFormProps) {
	const { open, closeForm } = useMapLayerFormStore();

	const form = useForm<MapLayerFormData>({
		resolver: zodResolver(mapLayerFormSchema) as Resolver<MapLayerFormData>,
		defaultValues: {
			name: mapLayer?.name || "",
			type: mapLayer?.type ?? 0,
			url: mapLayer?.url || "",
			sourceEndpoint: mapLayer?.sourceEndpoint || "",
			layers: mapLayer?.layers || "",
			format: mapLayer?.format || "",
			isVisible: mapLayer?.isVisible !== undefined ? mapLayer.isVisible : true,
			legendUrl: mapLayer?.legendUrl || "",
			attribution: mapLayer?.attribution || "",
			order: mapLayer?.order ?? 0,
			groupName: mapLayer?.groupName || "",
		},
	});

	const watchedType = form.watch("type");

	useEffect(() => {
		if (open) {
			form.reset({
				name: mapLayer?.name || "",
				type: mapLayer?.type ?? 0,
				url: mapLayer?.url || "",
				sourceEndpoint: mapLayer?.sourceEndpoint || "",
				layers: mapLayer?.layers || "",
				format: mapLayer?.format || "",
				isVisible:
					mapLayer?.isVisible !== undefined ? mapLayer.isVisible : true,
				legendUrl: mapLayer?.legendUrl || "",
				attribution: mapLayer?.attribution || "",
				order: mapLayer?.order ?? 0,
				groupName: mapLayer?.groupName || "",
			});
		}
	}, [
		open,
		form,
		mapLayer?.name,
		mapLayer?.type,
		mapLayer?.url,
		mapLayer?.sourceEndpoint,
		mapLayer?.layers,
		mapLayer?.format,
		mapLayer?.isVisible,
		mapLayer?.legendUrl,
		mapLayer?.attribution,
		mapLayer?.order,
		mapLayer?.groupName,
	]);

	const handleSubmit = async (data: MapLayerFormData) => {
		try {
			await onSubmit(data);
			form.reset();
		} catch (_error) {
			toast.error("Failed to save map layer");
		}
	};

	const handleOpenChange = (isOpen: boolean) => {
		if (!isOpen) {
			closeForm();
			form.reset();
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent
				className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto"
				data-testid="map-layer-form-modal"
			>
				<DialogHeader>
					<DialogTitle>
						{mode === "create" ? "Create Map Layer" : "Edit Map Layer"}
					</DialogTitle>
					<DialogDescription>
						{mode === "create"
							? "Add a new map layer configuration."
							: "Update map layer configuration."}
					</DialogDescription>
				</DialogHeader>
				{mode === "create" && <LayerPresets form={form} />}
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4"
						suppressHydrationWarning
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name *</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter layer name"
											data-testid="field-layer-name"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="type"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Type</FormLabel>
									<Select
										onValueChange={(value) => field.onChange(Number(value))}
										value={String(field.value)}
									>
										<FormControl>
											<SelectTrigger data-testid="field-layer-type">
												<SelectValue placeholder="Select type" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="0">WMS</SelectItem>
											<SelectItem value="1">BackendGeoJson</SelectItem>
											<SelectItem value="2">ExternalGeoJson</SelectItem>
											<SelectItem value="3">TileJSON</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						{(watchedType === 0 || watchedType === 2 || watchedType === 3) && (
							<FormField
								control={form.control}
								name="url"
								render={({ field }) => (
									<FormItem>
										<FormLabel>URL</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter URL"
												data-testid="field-layer-url"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						{watchedType === 1 && (
							<FormField
								control={form.control}
								name="sourceEndpoint"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Source Endpoint</FormLabel>
										<Select
											onValueChange={field.onChange}
											value={field.value || ""}
										>
											<FormControl>
												<SelectTrigger data-testid="field-layer-source-endpoint">
													<SelectValue placeholder="Select source endpoint" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="plot-geojson">
													plot-geojson
												</SelectItem>
												<SelectItem value="external-data-geojson">
													external-data-geojson (BRM Sites)
												</SelectItem>
												<SelectItem value="als-geojson">
													als-geojson (ALS Data)
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						{watchedType === 0 && (
							<>
								<FormField
									control={form.control}
									name="layers"
									render={({ field }) => (
										<FormItem>
											<FormLabel>WMS Layers</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter WMS layers"
													data-testid="field-layer-wms-layers"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="format"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Format</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter format"
													data-testid="field-layer-format"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</>
						)}

						<FormField
							control={form.control}
							name="legendUrl"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Legend URL</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter legend URL"
											data-testid="field-layer-legend-url"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="groupName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Group Name *</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter group name"
											data-testid="field-layer-group-name"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="order"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Order</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="Enter order"
											data-testid="field-layer-order"
											{...field}
											onChange={(e) => field.onChange(Number(e.target.value))}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="isVisible"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
									<div className="space-y-0.5">
										<FormLabel>Visible by Default</FormLabel>
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="attribution"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Attribution</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter attribution"
											data-testid="field-layer-attribution"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => closeForm()}
								disabled={isLoading}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={isLoading}
								data-testid="btn-save-layer"
							>
								{isLoading
									? "Saving..."
									: mode === "create"
										? "Create"
										: "Update"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

const LAYER_PRESETS: { label: string; values: MapLayerFormData }[] = [
	{
		label: "BRM Sites",
		values: {
			name: "BRM Sites",
			type: 1,
			sourceEndpoint: "external-data-geojson",
			groupName: "GEO-TREES",
			isVisible: true,
			order: 0,
			url: "",
			layers: "",
			format: "",
			legendUrl: "",
			attribution: "",
		},
	},
	{
		label: "ALS Data",
		values: {
			name: "ALS Data",
			type: 1,
			sourceEndpoint: "als-geojson",
			groupName: "GEO-TREES",
			isVisible: false,
			order: 1,
			url: "",
			layers: "",
			format: "",
			legendUrl: "",
			attribution: "",
		},
	},
];

function LayerPresets({ form }: { form: UseFormReturn<MapLayerFormData> }) {
	return (
		<div className="flex items-center gap-2 pb-2 border-b">
			<span className="text-xs text-muted-foreground">Quick add:</span>
			{LAYER_PRESETS.map((preset) => (
				<Button
					key={preset.label}
					type="button"
					variant="outline"
					size="sm"
					className="h-7 text-xs"
					onClick={() => form.reset(preset.values)}
				>
					{preset.label}
				</Button>
			))}
		</div>
	);
}
