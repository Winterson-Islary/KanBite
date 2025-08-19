import { ENV } from "@/lib/config";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { sessionMiddleware } from "../../middlewares/session-middleware";
import { MEMBER_ROLE } from "../members/constants/types";
import { getMember } from "../members/utils/getMember";
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
