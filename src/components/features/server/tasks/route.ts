import { ENV } from "@/lib/config";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ID, Query } from "node-appwrite";
import { sessionMiddleware } from "../../middlewares/session-middleware";
import { getMember } from "../members/utils/getMember";
import {
	type TaskSchemaDocument,
	createTaskSchema,
} from "./schemas/tasks-schema";

const app = new Hono()
	.get("/", sessionMiddleware, async (c) => {})
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

			const highestTaskPosition =
				await databases.listDocuments<TaskSchemaDocument>(
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
	);

export default app;
