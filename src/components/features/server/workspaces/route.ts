import { ENV } from "@/lib/config";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID } from "node-appwrite";
import { sessionMiddleware } from "../../middlewares/session-middleware";
import { createWorkspaceSchema } from "./schemas/workspaces-schema";

const app = new Hono().post(
	"/",
	zValidator("json", createWorkspaceSchema),
	sessionMiddleware,
	async (c) => {
		const database = c.get("databases");
		const user = c.get("user");
		const { name } = c.req.valid("json");
		const workspace = await database.createDocument(
			ENV.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
			ENV.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID,
			ID.unique(),
			{
				name,
			},
		);
		return c.json({ data: workspace });
	},
);

export default app;
