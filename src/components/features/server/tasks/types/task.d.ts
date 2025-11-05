import type { Models } from "node-appwrite";
import type { TaskStatus } from "./task-status";

export type Task = Models.Document & {
	name: string;
	status: TaskStatus;
	assigneeId: string;
	projectId: string;
	position: number;
	dueDate: Date;
	description?: string;
	workspaceId: string;
	// biome-ignore lint/suspicious/noExplicitAny: <>
	assignee: any;
	// biome-ignore lint/suspicious/noExplicitAny: <>
	project: any;
};
