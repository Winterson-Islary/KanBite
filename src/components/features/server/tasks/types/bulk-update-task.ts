import z from "zod";
import { TaskStatus } from "./task-status";

export const BulkTaskUpdate = z.object({
	tasks: z.array(
		z.object({
			$id: z.string(),
			status: z.nativeEnum(TaskStatus),
			position: z.number().min(1000).max(1_000_000),
		}),
	),
});
