import { z } from "zod";

export const schema = z.object({
	id: z.number(),
	header: z.string(),
	type: z.string(),
	status: z.string(),
	target: z.string(),
	limit: z.string(),
	reviewer: z.string(),
	completionDate: z.string().optional(),
	assignee: z.string().optional(),
});

export type DataTableSchema = z.infer<typeof schema>;
