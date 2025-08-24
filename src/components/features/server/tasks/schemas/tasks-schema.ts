import type { Models } from "node-appwrite";
import { z } from "zod";
import { TaskStatus } from "../types/task-status";

export const createTaskSchema = z.object({
	workspaceId: z.string().trim().min(1, "Required"),
	projectId: z.string().trim().min(1, "Required"),
	name: z.string().trim().min(1, "Required"),
	status: z.nativeEnum(TaskStatus, { required_error: "Required" }),
	dueDate: z.coerce.date(),
	assigneeId: z.string().trim().min(1, "Required"),
	description: z.string().optional(),
});

export type TaskSchema = z.infer<typeof createTaskSchema>;
export type TaskSchemaDocument = TaskSchema & Models.Document;

export const getTaskSchema = z.object({
	workspaceId: z.string(),
	projectId: z.string().nullish(),
	assigneeId: z.string().nullish(),
	status: z.nativeEnum(TaskStatus).nullish(),
	search: z.string().nullish(),
	dueDate: z.string().nullish(),
});

export type GetTask = z.infer<typeof getTaskSchema>;
