import { zValidator } from "@hono/zod-validator";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { Hono } from "hono";
import { StatusCodes } from "http-status-codes";
import { ID, Query } from "node-appwrite";
import z from "zod";
import { config } from "@/lib/app-config";
import { ENV } from "@/lib/config";
import { generateInviteCode } from "@/lib/inviteCodeGen";
import { ErrorCodes } from "@/src/shared/errors";
import { ApiResponse } from "../../http/helpers/api-response";
import { sessionMiddleware } from "../../http/middlewares/session-middleware";
import { MEMBER_ROLE } from "../members/constants/types";
import { getMember } from "../members/utils/getMember";
import { TaskStatus } from "../tasks/types/task-status";
import {
	createWorkspaceSchema,
	updateWorkspaceSchema,
} from "./schemas/workspaces-schema";
import type { Workspace } from "./types/update-workspace-form";

const app = new Hono()
	.get("/", sessionMiddleware, async (c) => {
		const current_user = c.get("user");
		const database = c.get("databases");
		const memberOfWorkspaces = await database.listDocuments(
			ENV.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
			ENV.NEXT_PUBLIC_APPWRITE_MEMBERS_ID,
			[Query.equal("userId", current_user.$id)],
		);
		if (memberOfWorkspaces.total === 0) {
			return c.json({ data: { documents: [], total: 0 } });
		}
		const workspaceIds = memberOfWorkspaces.documents.map(
			(member) => member.workspaceId,
		);

		const workspaces = await database.listDocuments(
			ENV.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
			ENV.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID,
			[Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)],
		);
		return c.json({ data: workspaces });
	})
	.get("/:workspaceId", sessionMiddleware, async (c) => {
		const user = c.get("user");
		const databases = c.get("databases");
		const { workspaceId } = c.req.param();
		const maybeWorkspaceMember = await getMember({
			databases,
			workspaceId,
			userId: user.$id,
		});
		if (
			!maybeWorkspaceMember ||
			maybeWorkspaceMember.role !== MEMBER_ROLE.ADMIN
		) {
			return c.json(
				ApiResponse.error({
					code: ErrorCodes.unauthorized,
					message: "You are not authorized",
				}),
				StatusCodes.UNAUTHORIZED,
			);
		}
		const workspace = await databases.getDocument<Workspace>(
			config.appwrite.databaseId,
			config.appwrite.workspacesId,
			workspaceId,
		);
		return c.json(ApiResponse.success(workspace));
	})
	.post(
		"/",
		zValidator("form", createWorkspaceSchema),
		sessionMiddleware,
		async (c) => {
			const database = c.get("databases");
			const storage = c.get("storage");
			const user = c.get("user");
			const { name, image } = c.req.valid("form");
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
			const workspace = await database.createDocument(
				ENV.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
				ENV.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID,
				ID.unique(),
				{
					name,
					userId: user.$id,
					imageUrl: uploadedImageUrl,
					inviteCode: generateInviteCode(10),
				},
			);
			await database.createDocument(
				ENV.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
				ENV.NEXT_PUBLIC_APPWRITE_MEMBERS_ID,
				ID.unique(),
				{
					userId: user.$id,
					workspaceId: workspace.$id,
					role: MEMBER_ROLE.ADMIN,
				},
			);
			return c.json({ data: workspace });
		},
	)
	.patch(
		"/:workspaceId",
		sessionMiddleware,
		zValidator("form", updateWorkspaceSchema),
		async (c) => {
			const databases = c.get("databases");
			const storage = c.get("storage");
			const user = c.get("user");
			const { workspaceId } = c.req.param();
			const { name, image } = c.req.valid("form");
			const member = await getMember({
				databases,
				workspaceId,
				userId: user.$id,
			});
			if (!member || member.role !== MEMBER_ROLE.ADMIN) {
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

			const workspace = await databases.updateDocument(
				ENV.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
				ENV.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID,
				workspaceId,
				{
					name,
					imageUrl: uploadedImageUrl,
				},
			);

			return c.json({ data: workspace });
		},
	)
	.delete("/:workspaceId", sessionMiddleware, async (c) => {
		const databases = c.get("databases");
		const user = c.get("user");
		const { workspaceId } = c.req.param();
		const member = await getMember({
			databases,
			workspaceId,
			userId: user.$id,
		});
		if (!member || member.role !== MEMBER_ROLE.ADMIN)
			return c.json({ error: "Unauthorized" }, StatusCodes.UNAUTHORIZED);
		await databases.deleteDocument(
			ENV.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
			ENV.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID,
			workspaceId,
		);
		return c.json({ data: { $id: workspaceId } });
	})
	.post("/:workspaceId/reset-invite-code", sessionMiddleware, async (c) => {
		const databases = c.get("databases");
		const user = c.get("user");
		const { workspaceId } = c.req.param();
		const member = await getMember({
			databases,
			workspaceId,
			userId: user.$id,
		});
		if (!member || member.role !== MEMBER_ROLE.ADMIN)
			return c.json({ error: "Unauthorized" }, StatusCodes.UNAUTHORIZED);
		const workspace = await databases.updateDocument(
			ENV.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
			ENV.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID,
			workspaceId,
			{
				inviteCode: generateInviteCode(10),
			},
		);
		return c.json({ data: workspace });
	})
	.post(
		"/:workspaceId/join",
		sessionMiddleware,
		zValidator("json", z.object({ code: z.string() })),
		async (c) => {
			const { workspaceId } = c.req.param();
			const { code } = c.req.valid("json");
			const databases = c.get("databases");
			const current_user = c.get("user");
			const member = await getMember({
				databases,
				workspaceId,
				userId: current_user.$id,
			});
			if (member)
				return c.json(
					{ error: "You are already a member" },
					StatusCodes.CONFLICT,
				);
			const workspace = await databases.getDocument<Workspace>(
				ENV.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
				ENV.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID,
				workspaceId,
			);
			if (workspace.inviteCode !== code)
				return c.json(
					{ error: "Invalid invite code" },
					StatusCodes.BAD_REQUEST,
				);
			await databases.createDocument(
				ENV.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
				ENV.NEXT_PUBLIC_APPWRITE_MEMBERS_ID,
				ID.unique(),
				{
					workspaceId,
					userId: current_user.$id,
					role: MEMBER_ROLE.MEMBER,
				},
			);

			return c.json({ data: workspace });
		},
	)
	.get("/:workspaceId/analytics", sessionMiddleware, async (c) => {
		const databases = c.get("databases");
		const user = c.get("user");
		const { workspaceId } = c.req.param();
		const maybeProjectMember = await getMember({
			databases,
			workspaceId: workspaceId,
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
				Query.equal("workspaceId", workspaceId),
				Query.greaterThanEqual("$createdAt", currentMonthStart.toISOString()),
				Query.lessThanEqual("$createdAt", currentMonthEnd.toISOString()),
			],
		);
		const previousMonthTasks = await databases.listDocuments(
			config.appwrite.databaseId,
			config.appwrite.tasksId,
			[
				Query.equal("workspaceId", workspaceId),
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
				Query.equal("workspaceId", workspaceId),
				Query.equal("assigneeId", maybeProjectMember.$id),
				Query.greaterThanEqual("$createdAt", currentMonthStart.toISOString()),
				Query.lessThanEqual("$createdAt", currentMonthEnd.toISOString()),
			],
		);
		const previousMonthAssignedTasks = await databases.listDocuments(
			config.appwrite.databaseId,
			config.appwrite.tasksId,
			[
				Query.equal("workspaceId", workspaceId),
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
				Query.equal("workspaceId", workspaceId),
				Query.notEqual("status", TaskStatus.DONE),
				Query.greaterThanEqual("$createdAt", currentMonthStart.toISOString()),
				Query.lessThanEqual("$createdAt", currentMonthEnd.toISOString()),
			],
		);
		const previousMonthIncompleteTasks = await databases.listDocuments(
			config.appwrite.databaseId,
			config.appwrite.tasksId,
			[
				Query.equal("workspaceId", workspaceId),
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
				Query.equal("workspaceId", workspaceId),
				Query.equal("status", TaskStatus.DONE),
				Query.greaterThanEqual("$createdAt", currentMonthStart.toISOString()),
				Query.lessThanEqual("$createdAt", currentMonthEnd.toISOString()),
			],
		);
		const previousMonthCompletedTasks = await databases.listDocuments(
			config.appwrite.databaseId,
			config.appwrite.tasksId,
			[
				Query.equal("workspaceId", workspaceId),
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
				Query.equal("workspaceId", workspaceId),
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
				Query.equal("workspaceId", workspaceId),
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
	});
export default app;
