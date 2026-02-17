import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/shared/utils";

const badgeVariants = cva(
	"inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
	{
		variants: {
			variant: {
				default:
					"border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
				secondary:
					"border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
				destructive:
					"border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
				outline:
					"text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
				"tag-dark-green": "border-transparent bg-tag-dark-green text-white",
				"tag-light-green": "border-transparent bg-tag-light-green text-white",
				"tag-turquoise": "border-transparent bg-tag-turquoise text-white",
				"tag-dark-turquoise":
					"border-transparent bg-tag-dark-turquoise text-white",
				"tag-dark-blue": "border-transparent bg-tag-dark-blue text-white",
				"tag-light-purple": "border-transparent bg-tag-light-purple text-white",
				"tag-purple": "border-transparent bg-tag-purple text-white",
				"tag-dark-purple": "border-transparent bg-tag-dark-purple text-white",
				"tag-pink": "border-transparent bg-tag-pink text-white",
				"tag-blue": "border-transparent bg-tag-blue text-white",
				"tag-orange": "border-transparent bg-tag-orange text-white",
				"tag-yellow": "border-transparent bg-tag-yellow text-white",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

function Badge({
	className,
	variant,
	asChild = false,
	...props
}: React.ComponentProps<"span"> &
	VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
	const Comp = asChild ? Slot : "span";

	return (
		<Comp
			data-slot="badge"
			className={cn(badgeVariants({ variant }), className)}
			{...props}
		/>
	);
}

export { Badge, badgeVariants };
