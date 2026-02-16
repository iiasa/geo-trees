import * as React from "react";
import { cn } from "@/shared/utils";

// Define a simple OTPInput component for now
const OTPInput = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<"div"> & {
		value?: string;
		onChange?: (value: string) => void;
		maxLength?: number;
	}
>(({ value = "", onChange, maxLength = 6, className, ...props }, ref) => {
	const [inputValues, setInputValues] = React.useState(
		Array(maxLength).fill(""),
	);

	const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

	const handleChange = (index: number, val: string) => {
		const newInputValues = [...inputValues];
		newInputValues[index] = val.slice(-1); // Only take the last character
		setInputValues(newInputValues);

		// Call onChange with the combined value
		onChange?.(newInputValues.join(""));

		// Move to next input if current one is filled
		if (val && index < maxLength - 1) {
			const nextInput = inputRefs.current[index + 1];
			if (nextInput) {
				nextInput.focus();
			}
		}
	};

	const handleKeyDown = (
		index: number,
		e: React.KeyboardEvent<HTMLInputElement>,
	) => {
		if (e.key === "Backspace" && !inputValues[index] && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	return (
		<div ref={ref} className={cn("flex gap-2", className)} {...props}>
			{inputValues.map((val, index) => {
				const setInputRef = (el: HTMLInputElement | null) => {
					inputRefs.current[index] = el;
				};

				return (
					<input
						key={`otp-input-${index}-${val}`}
						ref={setInputRef}
						type="text"
						inputMode="numeric"
						pattern="[0-9]*"
						maxLength={1}
						className="w-10 h-10 text-center border rounded-md"
						value={val}
						onChange={(e) => handleChange(index, e.target.value)}
						onKeyDown={(e) => handleKeyDown(index, e)}
					/>
				);
			})}
		</div>
	);
});

// Define a simple OTPInputContext
const OTPInputContext = React.createContext<{
	slots: Array<{
		char: string;
		hasFakeCaret: boolean;
		isActive: boolean;
	}>;
}>({
	slots: [],
});

function InputOTP({
	className,
	containerClassName,
	...props
}: React.ComponentProps<typeof OTPInput> & {
	containerClassName?: string;
}) {
	return (
		<div
			className={cn(
				"flex items-center gap-2 has-disabled:opacity-50",
				containerClassName,
			)}
		>
			<OTPInput
				data-slot="input-otp"
				className={cn("disabled:cursor-not-allowed", className)}
				{...props}
			/>
		</div>
	);
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="input-otp-group"
			className={cn("flex items-center", className)}
			{...props}
		/>
	);
}

function InputOTPSlot({
	index,
	className,
	...props
}: React.ComponentProps<"div"> & {
	index: number;
}) {
	const inputOTPContext = React.useContext(OTPInputContext);
	const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

	return (
		<div
			data-slot="input-otp-slot"
			data-active={isActive}
			className={cn(
				"data-[active=true]:border-ring data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive dark:bg-input/30 border-input relative flex h-9 w-9 items-center justify-center border-y border-r text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 data-[active=true]:ring-[3px]",
				className,
			)}
			{...props}
		>
			{char}
			{hasFakeCaret && (
				<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
					<div className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
				</div>
			)}
		</div>
	);
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"hr">) {
	return <hr data-slot="input-otp-separator" {...props} />;
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
