"use server";
import { ENV } from "@/lib/config";
import { AUTH_COOKIE } from "@/src/components/features/server/auth/constants";
import { cookies } from "next/headers";
import { Account, Client, Databases, Query } from "node-appwrite";

export const getUserWorkspaces = async () => {
	try {
		const client = new Client()
			.setEndpoint(ENV.NEXT_PUBLIC_APPWRITE_ENDPOINT)
			.setProject(ENV.NEXT_PUBLIC_APPWRITE_PROJECT);
		const cookie = await cookies();
		const session = cookie.get(AUTH_COOKIE);
		if (!session) return { documents: [], total: 0 };
		client.setSession(session.value);
		const account = new Account(client);
		const current_user = await account.get();
		const database = new Databases(client);
		const memberOfWorkspaces = await database.listDocuments(
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

		const workspaces = await database.listDocuments(
			ENV.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
			ENV.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID,
			[Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)],
		);
		return workspaces;
	} catch {
		return { documents: [], total: 0 };
	}
};
