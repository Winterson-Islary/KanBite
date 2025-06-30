import { ENV } from "@/lib/config";
import { generateInviteCode } from "@/lib/inviteCodeGen";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { sessionMiddleware } from "../../middlewares/session-middleware";
import { MEMBER_ROLE } from "../members/constants/types";
import { createWorkspaceSchema } from "./schemas/workspaces-schema";

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
	);

export default app;
