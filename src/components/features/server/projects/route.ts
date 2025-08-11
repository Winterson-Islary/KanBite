import { ENV } from "@/lib/config";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Query } from "node-appwrite";
import { z } from "zod";
import { sessionMiddleware } from "../../middlewares/session-middleware";
import { getMember } from "../members/utils/getMember";

const app = new Hono().get(
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
		const projectsList = databases.listDocuments(
			ENV.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
			ENV.NEXT_PUBLIC_APPWRITE_PROJECTS_ID,
			[Query.equal("workspaceId", workspaceId), Query.orderDesc("$createdAt")],
		);
		return c.json({ data: projectsList });
	},
);

export default app;
