"use server";
import { createSessionClient } from "@/lib/appwrite";
import { ENV } from "@/lib/config";
import { Query } from "node-appwrite";
import { getMember } from "../members/utils/getMember";
import type { Workspace } from "./types/update-workspace-form";

export const getUserWorkspaces = async () => {
	try {
		const { account, databases } = await createSessionClient();
		const current_user = await account.get();
		const memberOfWorkspaces = await databases.listDocuments(
			ENV.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
			ENV.NEXT_PUBLIC_APPWRITE_MEMBERS_ID,
			[Query.equal("userId", current_user.$id)],
		);
		if (memberOfWorkspaces.total === 0) {
			return { documents: [], total: 0 };
		}
		const workspaceIds = memberOfWorkspaces.documents.map(
			(member) => member.workspaceId,
		);

		const workspaces = await databases.listDocuments(
			ENV.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
			ENV.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID,
			[Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)],
		);
		return workspaces;
	} catch {
		return { documents: [], total: 0 };
	}
};

type GetWorkspaceProps = {
	workspaceId: string;
};
export const getWorkspaceById = async ({ workspaceId }: GetWorkspaceProps) => {
	try {
		const { account, databases } = await createSessionClient();
		const current_user = await account.get();

		const member = getMember({
			databases: databases,
			userId: current_user.$id,
			workspaceId,
		});
		if (!member) return null;

		const workspace = await databases.getDocument<Workspace>(
			ENV.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
			ENV.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID,
			workspaceId,
		);
		return workspace;
	} catch {
		return null;
	}
};
