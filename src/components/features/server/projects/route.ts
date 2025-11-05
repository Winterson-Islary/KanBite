import { zValidator } from "@hono/zod-validator";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { Hono } from "hono";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { config } from "@/lib/app-config";
import { ENV } from "@/lib/config";
import { ErrorCodes } from "@/src/shared/errors";
import { ApiResponse } from "../../http/helpers/api-response";
import { sessionMiddleware } from "../../http/middlewares/session-middleware";
import { getMember } from "../members/utils/getMember";
import { TaskStatus } from "../tasks/types/task-status";
import {
	createProjectSchema,
	updateProjectSchema,
} from "./schemas/projects-schema";
import type { Project } from "./types/project";

const app = new Hono()
	.get(
		"/",
		sessionMiddleware,
		zValidator("query", z.object({ workspaceId: z.string() })),
		async (c) => {
			const { workspaceId } = c.req.valid("query");
			const user = c.get("user");
			const databases = c.get("databases");

			const userIsMember = getMember({
				databases,
				workspaceId,
				userId: user.$id,
			});
			if (!userIsMember)
				return c.json(
					{ error: ReasonPhrases.UNAUTHORIZED },
					StatusCodes.UNAUTHORIZED,
				);
			const projectsList = await databases.listDocuments<Project>(
				ENV.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
				ENV.NEXT_PUBLIC_APPWRITE_PROJECTS_ID,
				[
					Query.equal("workspaceId", workspaceId),
					Query.orderDesc("$createdAt"),
				],
			);
			return c.json({ data: projectsList });
		},
	)
	.get("/:projectId", sessionMiddleware, async (c) => {
		const databases = c.get("databases");
		const user = c.get("user");
		const { projectId } = c.req.param();
		const project = await databases.getDocument<Project>(
			config.appwrite.databaseId,
			config.appwrite.projectsId,
			projectId,
		);
		const maybeProjectMember = await getMember({
			databases,
			workspaceId: project.workspaceId,
			userId: user.$id,
		});
		if (!maybeProjectMember)
			return c.json(
				ApiResponse.error({
					code: ErrorCodes.unauthorized,
					message: "unauthorized access",
				}),
				StatusCodes.UNAUTHORIZED,
			);
		return c.json(ApiResponse.success(project));
	})
	.get("/:projectId/analytics", sessionMiddleware, async (c) => {
		const databases = c.get("databases");
		const user = c.get("user");
		const { projectId } = c.req.param();
		const projectData = await databases.getDocument<Project>(
			config.appwrite.databaseId,
			config.appwrite.projectsId,
			projectId,
		);
		const maybeProjectMember = await getMember({
			databases,
			workspaceId: projectData.workspaceId,
			userId: user.$id,
		});
		if (!maybeProjectMember)
			return c.json(
				ApiResponse.error({
					code: ErrorCodes.unauthorized,
					message: "unauthorized access",
				}),
				StatusCodes.UNAUTHORIZED,
			);
		const now = new Date();
		const currentMonthStart = startOfMonth(now);
		const currentMonthEnd = endOfMonth(now);
		const previousMonthStart = startOfMonth(subMonths(now, 1));
		const previousMonthEnd = endOfMonth(subMonths(now, 1));

		//! Total Tasks
		const currentMonthTasks = await databases.listDocuments(
			config.appwrite.databaseId,
			config.appwrite.tasksId,
			[
				Query.equal("projectId", projectId),
				Query.greaterThanEqual("$createdAt", currentMonthStart.toISOString()),
				Query.lessThanEqual("$createdAt", currentMonthEnd.toISOString()),
			],
		);
		const previousMonthTasks = await databases.listDocuments(
			config.appwrite.databaseId,
			config.appwrite.tasksId,
			[
				Query.equal("projectId", projectId),
				Query.greaterThanEqual("$createdAt", previousMonthStart.toISOString()),
				Query.lessThanEqual("$createdAt", previousMonthEnd.toISOString()),
			],
		);
		const currentMonthTasksCount = currentMonthTasks.total;
		const currentPreviousTasksCountDifference =
			currentMonthTasksCount - previousMonthTasks.total;

		//! Total Assigned Tasks
		const currentMonthAssignedTasks = await databases.listDocuments(
			config.appwrite.databaseId,
			config.appwrite.tasksId,
			[
				Query.equal("projectId", projectId),
				Query.equal("assigneeId", maybeProjectMember.$id),
				Query.greaterThanEqual("$createdAt", currentMonthStart.toISOString()),
				Query.lessThanEqual("$createdAt", currentMonthEnd.toISOString()),
			],
		);
		const previousMonthAssignedTasks = await databases.listDocuments(
			config.appwrite.databaseId,
			config.appwrite.tasksId,
			[
				Query.equal("projectId", projectId),
				Query.equal("assigneeId", maybeProjectMember.$id),
				Query.greaterThanEqual("$createdAt", previousMonthStart.toISOString()),
				Query.lessThanEqual("$createdAt", previousMonthEnd.toISOString()),
			],
		);
		const currentMonthAssignedTasksCount = currentMonthAssignedTasks.total;
		const currentPreviousMonthAssignedTasksCountDifference =
			currentMonthAssignedTasksCount - previousMonthAssignedTasks.total;

		//! Total Incomplete Tasks
		const currentMonthIncompleteTasks = await databases.listDocuments(
			config.appwrite.databaseId,
			config.appwrite.tasksId,
			[
				Query.equal("projectId", projectId),
				Query.notEqual("status", TaskStatus.DONE),
				Query.greaterThanEqual("$createdAt", currentMonthStart.toISOString()),
				Query.lessThanEqual("$createdAt", currentMonthEnd.toISOString()),
			],
		);
		const previousMonthIncompleteTasks = await databases.listDocuments(
			config.appwrite.databaseId,
			config.appwrite.tasksId,
			[
				Query.equal("projectId", projectId),
				Query.notEqual("status", TaskStatus.DONE),
				Query.greaterThanEqual("$createdAt", previousMonthStart.toISOString()),
				Query.lessThanEqual("$createdAt", previousMonthEnd.toISOString()),
			],
		);
		const currentMonthIncompleteTasksCount = currentMonthIncompleteTasks.total;
		const currentPreviousMonthIncompleteTasksCountDifference =
			currentMonthIncompleteTasksCount - previousMonthIncompleteTasks.total;

		//! Total Completed Tasks
		const currentMonthCompletedTasks = await databases.listDocuments(
			config.appwrite.databaseId,
			config.appwrite.tasksId,
			[
				Query.equal("projectId", projectId),
				Query.equal("status", TaskStatus.DONE),
				Query.greaterThanEqual("$createdAt", currentMonthStart.toISOString()),
				Query.lessThanEqual("$createdAt", currentMonthEnd.toISOString()),
			],
		);
		const previousMonthCompletedTasks = await databases.listDocuments(
			config.appwrite.databaseId,
			config.appwrite.tasksId,
			[
				Query.equal("projectId", projectId),
				Query.equal("status", TaskStatus.DONE),
				Query.greaterThanEqual("$createdAt", previousMonthStart.toISOString()),
				Query.lessThanEqual("$createdAt", previousMonthEnd.toISOString()),
			],
		);
		const currentMonthCompletedTasksCount = currentMonthCompletedTasks.total;
		const currentPreviousMonthCompletedTasksCountDifference =
			currentMonthCompletedTasksCount - previousMonthCompletedTasks.total;

		//! Total Pending Tasks
		const currentMonthPendingTasks = await databases.listDocuments(
			config.appwrite.databaseId,
			config.appwrite.tasksId,
			[
				Query.equal("projectId", projectId),
				Query.notEqual("status", TaskStatus.DONE),
				Query.lessThan("dueDate", now.toISOString()),
				Query.greaterThanEqual("$createdAt", currentMonthStart.toISOString()),
				Query.lessThanEqual("$createdAt", currentMonthEnd.toISOString()),
			],
		);
		const previousMonthPendingTasks = await databases.listDocuments(
			config.appwrite.databaseId,
			config.appwrite.tasksId,
			[
				Query.equal("projectId", projectId),
				Query.notEqual("status", TaskStatus.DONE),
				Query.lessThan("dueDate", now.toISOString()),
				Query.greaterThanEqual("$createdAt", previousMonthStart.toISOString()),
				Query.lessThanEqual("$createdAt", previousMonthEnd.toISOString()),
			],
		);
		const currentMonthPendingTasksCount = currentMonthPendingTasks.total;
		const currentPreviousMonthPendingTasksCountDifference =
			currentMonthPendingTasksCount - previousMonthPendingTasks.total;

		const returnObject = {
			currentMonthTasksCount,
			currentPreviousTasksCountDifference,
			currentMonthAssignedTasksCount,
			currentPreviousMonthAssignedTasksCountDifference,
			currentMonthIncompleteTasksCount,
			currentPreviousMonthIncompleteTasksCountDifference,
			currentMonthCompletedTasksCount,
			currentPreviousMonthCompletedTasksCountDifference,
			currentMonthPendingTasksCount,
			currentPreviousMonthPendingTasksCountDifference,
		};
		return c.json(ApiResponse.success(returnObject));
	})
	.post(
		"/",
		sessionMiddleware,
		zValidator("form", createProjectSchema),
		async (c) => {
			const databases = c.get("databases");
			const storage = c.get("storage");
			const user = c.get("user");
			const { name, image, workspaceId } = c.req.valid("form");
			const userIsMember = getMember({
				databases,
				workspaceId,
				userId: user.$id,
			});
			if (!userIsMember)
				return c.json(
					{ error: ReasonPhrases.UNAUTHORIZED },
					StatusCodes.UNAUTHORIZED,
				);

			let uploadedImageUrl: string | undefined;
			if (image instanceof File) {
				const file = await storage.createFile(
					ENV.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
					ID.unique(),
					image,
				);
				const arrayBuffer = await storage.getFilePreview(
					ENV.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
					file.$id,
				);
				uploadedImageUrl = `data:image/png;base64, ${Buffer.from(arrayBuffer).toString("base64")}`;
			}
			const project = await databases.createDocument(
				ENV.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
				ENV.NEXT_PUBLIC_APPWRITE_PROJECTS_ID,
				ID.unique(),
				{
					name,
					workspaceId,
					imageUrl: uploadedImageUrl,
				},
			);
			return c.json({ data: project });
		},
	)
	.patch(
		"/:projectId",
		sessionMiddleware,
		zValidator("form", updateProjectSchema),
		async (c) => {
			const databases = c.get("databases");
			const storage = c.get("storage");
			const user = c.get("user");
			const { projectId } = c.req.param();
			const { name, image } = c.req.valid("form");
			const userProject = await databases.getDocument<Project>(
				ENV.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
				ENV.NEXT_PUBLIC_APPWRITE_PROJECTS_ID,
				projectId,
			);
			const member = await getMember({
				databases,
				workspaceId: userProject.workspaceId,
				userId: user.$id,
			});
			if (!member) {
				return c.json({ error: "Unauthorized" }, StatusCodes.UNAUTHORIZED);
			}
			let uploadedImageUrl: string | undefined;
			if (image instanceof File) {
				const file = await storage.createFile(
					ENV.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
					ID.unique(),
					image,
				);
				const arrayBuffer = await storage.getFilePreview(
					ENV.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
					file.$id,
				);
				uploadedImageUrl = `data:image/png;base64, ${Buffer.from(arrayBuffer).toString("base64")}`;
			} else {
				uploadedImageUrl = image;
			}

			const updatedProject = await databases.updateDocument(
				ENV.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
				ENV.NEXT_PUBLIC_APPWRITE_PROJECTS_ID,
				projectId,
				{
					name,
					imageUrl: uploadedImageUrl,
				},
			);

			return c.json({ data: updatedProject });
		},
	)
	.delete("/:projectId", sessionMiddleware, async (c) => {
		const databases = c.get("databases");
		const user = c.get("user");
		const { projectId } = c.req.param();
		const userProject = await databases.getDocument<Project>(
			ENV.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
			ENV.NEXT_PUBLIC_APPWRITE_PROJECTS_ID,
			projectId,
		);
		const member = await getMember({
			databases,
			workspaceId: userProject.workspaceId,
			userId: user.$id,
		});
		if (!member)
			return c.json({ error: "Unauthorized" }, StatusCodes.UNAUTHORIZED);
		await databases.deleteDocument(
			ENV.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
			ENV.NEXT_PUBLIC_APPWRITE_PROJECTS_ID,
			projectId,
		);
		return c.json({ data: { $id: userProject.$id } });
	});

export default app;
