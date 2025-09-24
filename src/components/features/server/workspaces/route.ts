import { ENV } from "@/lib/config";
import { generateInviteCode } from "@/lib/inviteCodeGen";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { StatusCodes } from "http-status-codes";
import { ID, Query } from "node-appwrite";
import z from "zod";
import { sessionMiddleware } from "../../http/middlewares/session-middleware";
import { MEMBER_ROLE } from "../members/constants/types";
import { getMember } from "../members/utils/getMember";
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
	);
export default app;
