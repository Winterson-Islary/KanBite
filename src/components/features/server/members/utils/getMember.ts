import { ENV } from "@/lib/config";
import { type Databases, Query } from "node-appwrite";

type GetMemberProps = {
	databases: Databases;
	workspaceId: string;
	userId: string;
};

export async function getMember({
	databases,
	workspaceId,
	userId,
}: GetMemberProps) {
	const members = await databases.listDocuments(
		ENV.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
		ENV.NEXT_PUBLIC_APPWRITE_MEMBERS_ID,
		[Query.equal("workspaceId", workspaceId), Query.equal("userId", userId)],
	);

	return members.documents[0];
}
