import { ENV } from "@/lib/config";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { sessionMiddleware } from "../../middlewares/session-middleware";
import { getMember } from "../members/utils/getMember";
import { createProjectSchema } from "./schemas/projects-schema";

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
			const projectsList = await databases.listDocuments(
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
	);

export default app;
