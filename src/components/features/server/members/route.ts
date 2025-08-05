import { createAdminClient } from "@/lib/appwrite";
import { ENV } from "@/lib/config";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { StatusCodes } from "http-status-codes";
import { Query } from "node-appwrite";
import z from "zod";
import { sessionMiddleware } from "../../middlewares/session-middleware";
import { MEMBER_ROLE } from "./constants/types";
import { getMember } from "./utils/getMember";

const app = new Hono()
	.get(
		"/",
		sessionMiddleware,
		zValidator("query", z.object({ workspaceId: z.string() })),
		async (c) => {
			const { users } = await createAdminClient();
			const databases = c.get("databases");
			const currentUser = c.get("user");
			const { workspaceId } = c.req.valid("query");

			const member = await getMember({
				databases,
				workspaceId,
				userId: currentUser.$id,
			});
			if (!member)
				return c.json({ error: "Unauthorized" }, StatusCodes.UNAUTHORIZED);
			const members = await databases.listDocuments(
				ENV.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
				ENV.NEXT_PUBLIC_APPWRITE_MEMBERS_ID,
				[Query.equal("workspaceId", workspaceId)],
			);

			const populatedMembers = await Promise.all(
				members.documents.map(async (_member) => {
					const user = await users.get(_member.userId);
					return { ..._member, name: user.name, email: user.email };
				}),
			);

			return c.json({ data: { ...members, documents: populatedMembers } });
		},
	)
	.delete("/:memberId", sessionMiddleware, async (c) => {
		const { memberId } = c.req.param();
		const user = c.get("user");
		const databases = c.get("databases");
		const memberToDelete = await databases.getDocument(
			ENV.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
			ENV.NEXT_PUBLIC_APPWRITE_MEMBERS_ID,
			memberId,
		);
		if (!memberToDelete)
			return c.json({ error: "member not found" }, StatusCodes.NOT_FOUND);
		const allWorkspaceMembers = await databases.listDocuments(
			ENV.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
			ENV.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID,
			[Query.equal("workspaceId", memberToDelete.workspaceId)],
		);
		const currentUserIsMember = await getMember({
			databases,
			workspaceId: memberToDelete.workspaceId,
			userId: user.$id,
		});
		if (!currentUserIsMember)
			return c.json({ error: "Unauthorized" }, StatusCodes.UNAUTHORIZED);
		if (
			currentUserIsMember.$id !== memberToDelete.$id &&
			currentUserIsMember.role !== MEMBER_ROLE.ADMIN
		)
			return c.json({ error: "Unauthorized" }, StatusCodes.UNAUTHORIZED);
		if (allWorkspaceMembers.total === 1)
			return c.json(
				{ error: "cannot delete the only member of a workspace" },
				StatusCodes.FORBIDDEN,
			);
		await databases.deleteDocument(
			ENV.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
			ENV.NEXT_PUBLIC_APPWRITE_MEMBERS_ID,
			memberId,
		);

		return c.json({ data: { $id: memberToDelete.$id } }, StatusCodes.OK);
	})
	.patch(
		"/:memberId",
		sessionMiddleware,
		zValidator("json", z.object({ role: z.nativeEnum(MEMBER_ROLE) })),
		async (c) => {
			const { memberId } = c.req.param();
			const { role } = c.req.valid("json");
			const user = c.get("user");
			const databases = c.get("databases");
			const memberToUpdate = await databases.getDocument(
				ENV.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
				ENV.NEXT_PUBLIC_APPWRITE_MEMBERS_ID,
				memberId,
			);
			if (!memberToUpdate)
				return c.json({ error: "member not found" }, StatusCodes.NOT_FOUND);
			const allWorkspaceMembers = await databases.listDocuments(
				ENV.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
				ENV.NEXT_PUBLIC_APPWRITE_MEMBERS_ID,
				[Query.equal("workspaceId", memberToUpdate.workspaceId)],
			);
			const currentUserIsMember = await getMember({
				databases,
				workspaceId: memberToUpdate.workspaceId,
				userId: user.$id,
			});
			if (!currentUserIsMember)
				return c.json({ error: "Unauthorized" }, StatusCodes.UNAUTHORIZED);
			if (currentUserIsMember.role !== MEMBER_ROLE.ADMIN)
				return c.json({ error: "Unauthorized" }, StatusCodes.UNAUTHORIZED);
			if (allWorkspaceMembers.total === 1)
				return c.json(
					{ error: "cannot downgrade the only workspace member" },
					StatusCodes.FORBIDDEN,
				);
			await databases.updateDocument(
				ENV.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
				ENV.NEXT_PUBLIC_APPWRITE_MEMBERS_ID,
				memberToUpdate.$id,
				{ role },
			);
			return c.json({ data: { $id: memberToUpdate.$id } }, StatusCodes.OK);
		},
	);

export default app;
