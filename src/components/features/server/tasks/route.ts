import { config } from "@/lib/app-config";
import { createAdminClient } from "@/lib/appwrite";
import { ENV } from "@/lib/config";
import { ErrorCodes } from "@/src/shared/errors";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ID, Query } from "node-appwrite";
import { ApiResponse } from "../../http/helpers/api-response";
import { sessionMiddleware } from "../../http/middlewares/session-middleware";
import { getMember } from "../members/utils/getMember";
import type { Project } from "../projects/types/project";
import {
	createTaskSchema,
	getTaskSchema,
	updateTaskSchema,
} from "./schemas/tasks-schema";
import { BulkTaskUpdate } from "./types/bulk-update-task";
import type { Task } from "./types/task";

const app = new Hono()
	.get("/:taskId", sessionMiddleware, async (c) => {
		const currentUser = c.get("user");
		const databases = c.get("databases");
		const { taskId } = c.req.param();
		const { users } = await createAdminClient();
		const taskDetails = await databases.getDocument<Task>(
			config.appwrite.databaseId,
			config.appwrite.tasksId,
			taskId,
		);
		const currentMemberDetails = await getMember({
			databases,
			workspaceId: taskDetails.workspaceId,
			userId: currentUser.$id,
		});
		if (!currentMemberDetails)
			return c.json(
				{ error: ReasonPhrases.UNAUTHORIZED },
				StatusCodes.UNAUTHORIZED,
			);
		const project = await databases.getDocument<Project>(
			config.appwrite.databaseId,
			config.appwrite.projectsId,
			taskDetails.projectId,
		);
		const member = await databases.getDocument(
			config.appwrite.databaseId,
			config.appwrite.membersId,
			taskDetails.assigneeId,
		);
		const user = await users.get(member.userId);
		const assignee = { ...member, name: user.name, email: user.email };
		return c.json({ data: { ...taskDetails, project, assignee } });
	})
	.get(
		"/",
		sessionMiddleware,
		zValidator("query", getTaskSchema),
		async (c) => {
			const { users } = await createAdminClient();
			const user = c.get("user");
			const databases = c.get("databases");
			const taskQuery = c.req.valid("query");
			const isMember = await getMember({
				databases,
				workspaceId: taskQuery.workspaceId,
				userId: user.$id,
			});
			if (!isMember)
				return c.json(
					{ error: ReasonPhrases.UNAUTHORIZED },
					StatusCodes.UNAUTHORIZED,
				);
			const queryingList = [
				// Query.equal("workspaceId", taskQuery.workspaceId),
				Query.orderDesc("$createdAt"),
			];

			console.log("Building task query....."); //! Only for initial debugging (to be removed)
			// biome-ignore lint/complexity/noForEach: <>
			Object.keys(taskQuery).forEach((key) => {
				const value = taskQuery[key as keyof typeof taskQuery];
				console.log("key: ", key, "Value: ", value); //! Only for initial debugging (to be removed)
				if (value) queryingList.push(Query.equal(`${key}`, value));
			});
			console.log("Finishing build....."); //! Only for initial debugging (to be removed)

			const tasks = await databases.listDocuments<Task>(
				ENV.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
				ENV.NEXT_PUBLIC_APPWRITE_TASKS_ID,
				queryingList,
			);

			const projectIds = tasks.documents.map((task) => task.projectId);
			const assigneeIds = tasks.documents.map((task) => task.assigneeId);

			const projects = await databases.listDocuments<Project>(
				ENV.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
				ENV.NEXT_PUBLIC_APPWRITE_PROJECTS_ID,
				projectIds.length > 0 ? [Query.contains("$id", projectIds)] : [],
			);
			const members = await databases.listDocuments(
				ENV.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
				ENV.NEXT_PUBLIC_APPWRITE_MEMBERS_ID,
				assigneeIds.length > 0 ? [Query.contains("$id", assigneeIds)] : [],
			);
			const assignees = await Promise.all(
				members.documents.map(async (member) => {
					const user = await users.get(member.userId);
					return { ...member, name: user.name, email: user.email };
				}),
			);
			const resultTaskList = tasks.documents.map((task) => {
				const project = projects.documents.find(
					(project) => project.$id === task.projectId,
				);
				const assignee = assignees.find(
					(assignee) => assignee.$id === task.assigneeId,
				);
				return { ...task, project, assignee };
			});
			return c.json({ data: { ...tasks, documents: resultTaskList } });
		},
	)
	.post(
		"/",
		sessionMiddleware,
		zValidator("json", createTaskSchema),
		async (c) => {
			const user = c.get("user");
			const databases = c.get("databases");
			const taskObject = c.req.valid("json");
			const isMember = await getMember({
				databases,
				workspaceId: taskObject.workspaceId,
				userId: user.$id,
			});
			if (!isMember)
				return c.json(
					{ error: ReasonPhrases.UNAUTHORIZED },
					StatusCodes.UNAUTHORIZED,
				);

			const highestTaskPosition = await databases.listDocuments<Task>(
				ENV.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
				ENV.NEXT_PUBLIC_APPWRITE_TASKS_ID,
				[
					Query.equal("status", taskObject.status),
					Query.equal("workspaceId", taskObject.workspaceId),
					Query.orderDesc("position"),
					Query.limit(1),
				],
			);
			const newAssignablePosition =
				highestTaskPosition.documents.length > 0
					? highestTaskPosition.documents[0].position + 1000
					: 1000;
			const newTask = await databases.createDocument(
				ENV.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
				ENV.NEXT_PUBLIC_APPWRITE_TASKS_ID,
				ID.unique(),
				{ ...taskObject, position: newAssignablePosition },
			);
			return c.json({ data: newTask });
		},
	)
	.delete("/:taskId", sessionMiddleware, async (c) => {
		const user = c.get("user");
		const databases = c.get("databases");
		const { taskId } = c.req.param();
		const task = await databases.getDocument<Task>(
			config.appwrite.databaseId,
			config.appwrite.tasksId,
			taskId,
		);
		const member = await getMember({
			databases,
			workspaceId: task.workspaceId,
			userId: user.$id,
		});
		if (!member)
			return c.json(
				{ error: ReasonPhrases.UNAUTHORIZED },
				StatusCodes.UNAUTHORIZED,
			);
		await databases.deleteDocument(
			config.appwrite.databaseId,
			config.appwrite.tasksId,
			taskId,
		);

		return c.json({ data: { $id: task.$id } });
	})
	.patch(
		"/:taskId",
		sessionMiddleware,
		zValidator("json", updateTaskSchema),
		async (c) => {
			const user = c.get("user");
			const databases = c.get("databases");
			const newTaskDetails = c.req.valid("json");
			const { taskId } = c.req.param();
			const oldTaskDetails = await databases.getDocument<Task>(
				config.appwrite.databaseId,
				config.appwrite.tasksId,
				taskId,
			);
			const isMember = await getMember({
				databases,
				workspaceId: oldTaskDetails.workspaceId,
				userId: user.$id,
			});
			if (!isMember)
				return c.json(
					{ error: ReasonPhrases.UNAUTHORIZED },
					StatusCodes.UNAUTHORIZED,
				);

			const newTask = await databases.updateDocument<Task>(
				config.appwrite.databaseId,
				config.appwrite.tasksId,
				oldTaskDetails.$id,
				{ ...newTaskDetails },
			);
			return c.json({ data: newTask });
		},
	)
	.post(
		"/bulk-update",
		sessionMiddleware,
		zValidator("json", BulkTaskUpdate),
		async (c) => {
			const databases = c.get("databases");
			const user = c.get("user");
			const { tasks } = c.req.valid("json");
			const tasksToUpdate = await databases.listDocuments<Task>(
				config.appwrite.databaseId,
				config.appwrite.tasksId,
				[
					Query.contains(
						"$id",
						tasks.map((task) => task.$id),
					),
				],
			);
			const workspaceIds = new Set(
				tasksToUpdate.documents.map((task) => task.workspaceId),
			);
			if (workspaceIds.size !== 1)
				return ApiResponse.error(c, {
					code: ErrorCodes.workspaceError,
					message: "All tasks must belong to the same workspace.",
					statusCode: StatusCodes.BAD_REQUEST,
				});
			const workspaceId = workspaceIds.values().next().value;
			if (!workspaceId)
				return ApiResponse.error(c, {
					code: ErrorCodes.workspaceError,
					message: "No workspace id could be obtained.",
					statusCode: StatusCodes.BAD_REQUEST,
				});
			const member = await getMember({
				databases,
				workspaceId,
				userId: user.$id,
			});
			if (!member)
				return ApiResponse.error(c, {
					code: ErrorCodes.unauthorized,
					message:
						"User is not a member of the workspace it is trying to update.",
					statusCode: StatusCodes.UNAUTHORIZED,
				});
			const updatedTasks = await Promise.all(
				tasks.map(async (task) => {
					const { $id, status, position } = task;
					return databases.updateDocument<Task>(
						config.appwrite.databaseId,
						config.appwrite.tasksId,
						$id,
						{ status, position },
					);
				}),
			);
			return ApiResponse.success(c, updatedTasks);
		},
	);

export default app;
