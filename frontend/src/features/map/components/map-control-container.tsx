import { useMemo } from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/shared/components/ui/popover";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import {
	useMapControlsStore,
	type ControlPosition,
	type MapControl,
} from "../stores/map-controls-store";

const POSITION_CLASSES: Record<ControlPosition, string> = {
	"top-right": "top-16 right-4 gap-2",
	"top-left": "top-16 left-4 gap-2",
	"bottom-right": "bottom-8 right-4 gap-0",
	"bottom-left": "bottom-8 left-4 gap-2 items-start",
};

const POPOVER_SIDE: Record<
	ControlPosition,
	"left" | "right" | "top" | "bottom"
> = {
	"top-right": "left",
	"top-left": "right",
	"bottom-right": "left",
	"bottom-left": "right",
};

function buttonClasses(control: MapControl): string {
	const base = "flex items-center justify-center size-10 transition-colors";

	if (control.variant === "pill-top") {
		return `${base} w-10 h-10 rounded-t-md border border-b-0 border-gray-200 bg-white shadow-lg hover:bg-gray-50 text-gray-900`;
	}
	if (control.variant === "pill-bottom") {
		return `${base} w-10 h-10 rounded-b-md border border-gray-200 bg-white shadow-lg hover:bg-gray-50 text-gray-900`;
	}

	if (control.variant === "dark") {
		const active = control.isActive || control.isOpen;
		return `${base} rounded-full shadow-lg ${
			active
				? "bg-primary text-white"
				: "bg-zinc-900/90 backdrop-blur-sm text-white hover:bg-zinc-800"
		}`;
	}

	const active = control.isActive || control.isOpen;
	return `${base} rounded-full backdrop-blur-sm border shadow-lg ${
		active
			? "bg-primary text-white border-primary"
			: "bg-white/95 border-gray-200 hover:bg-gray-50 text-gray-700"
	}`;
}

function ControlButton({
	control,
	onToggle,
}: {
	control: MapControl;
	onToggle: () => void;
}) {
	const Icon = control.icon;

	if (control.isDisplayOnly) {
		return <Icon className="size-5" />;
	}

	if (control.onClick && !control.panel) {
		return (
			<Tooltip>
				<TooltipTrigger asChild>
					<button
						type="button"
						onClick={control.onClick}
						className={buttonClasses(control)}
					>
						<Icon className="size-5" />
					</button>
				</TooltipTrigger>
				<TooltipContent side={POPOVER_SIDE[control.position]}>
					{control.title}
				</TooltipContent>
			</Tooltip>
		);
	}

	if (control.panel) {
		return (
			<Popover
				open={control.isOpen}
				onOpenChange={(open) => {
					if (open !== control.isOpen) onToggle();
				}}
			>
				<Tooltip>
					<TooltipTrigger asChild>
						<PopoverTrigger asChild>
							<button type="button" className={buttonClasses(control)}>
								<Icon className="size-5" />
							</button>
						</PopoverTrigger>
					</TooltipTrigger>
					<TooltipContent side={POPOVER_SIDE[control.position]}>
						{control.title}
					</TooltipContent>
				</Tooltip>
				<PopoverContent
					side={POPOVER_SIDE[control.position]}
					align={control.position.includes("bottom") ? "end" : "start"}
					sideOffset={8}
					className="w-auto p-0 border-0 bg-transparent shadow-none"
				>
					{control.panel}
				</PopoverContent>
			</Popover>
		);
	}

	return null;
}

function PositionGroup({
	position,
	controls,
}: {
	position: ControlPosition;
	controls: MapControl[];
}) {
	const toggleControl = useMapControlsStore((s) => s.toggleControl);

	return (
		<div
			className={`absolute ${POSITION_CLASSES[position]} z-10 flex flex-col`}
		>
			{controls.map((control) => (
				<ControlButton
					key={control.id}
					control={control}
					onToggle={() => toggleControl(control.id)}
				/>
			))}
		</div>
	);
}

export function MapControlContainer() {
	const controls = useMapControlsStore((s) => s.controls);

	const grouped = useMemo(() => {
		const groups: Partial<Record<ControlPosition, MapControl[]>> = {};
		for (const control of controls) {
			if (!groups[control.position]) groups[control.position] = [];
			groups[control.position]?.push(control);
		}
		return groups;
	}, [controls]);

	return (
		<>
			{(Object.entries(grouped) as [ControlPosition, MapControl[]][]).map(
				([position, posControls]) => (
					<PositionGroup
						key={position}
						position={position}
						controls={posControls}
					/>
				),
			)}
		</>
	);
}
