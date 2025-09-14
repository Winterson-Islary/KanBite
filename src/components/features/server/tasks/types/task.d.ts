import type { Models } from "node-appwrite";
import type { TaskStatus } from "./task-status";

export type Task = Models.Document & {
	name: string;
	status: TaskStatus;
	assigneeId: string;
	projectId: string;
	position: number;
	dueDate: string;
	description?: string;
	workspaceId: string;
};
