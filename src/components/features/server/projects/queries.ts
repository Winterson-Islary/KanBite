"use server";
import { createSessionClient } from "@/lib/appwrite";
import { ENV } from "@/lib/config";
import { ReasonPhrases } from "http-status-codes";
import { Query } from "node-appwrite";
import { getMember } from "../members/utils/getMember";
import type { Project } from "./types/project";

interface GetProjectInfoProps {
	projectId: string;
}

export const getUserProject = async ({ projectId }: GetProjectInfoProps) => {
	const { account, databases } = await createSessionClient();
	const current_user = await account.get();

	const project = await databases.getDocument<Project>(
		ENV.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
		ENV.NEXT_PUBLIC_APPWRITE_PROJECTS_ID,
		projectId,
	);
	const userIsMember = getMember({
		databases,
		userId: current_user.$id,
		workspaceId: project.workspaceId,
	});
	if (!userIsMember) throw new Error(ReasonPhrases.UNAUTHORIZED);
	return project;
};
