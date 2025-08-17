"use server";
import { createSessionClient } from "@/lib/appwrite";
import { ENV } from "@/lib/config";
import { Query } from "node-appwrite";
import { getMember } from "../members/utils/getMember";
import type { Project } from "./types/project";

interface GetProjectInfoProps {
	projectId: string;
}

export const getUserProject = async ({ projectId }: GetProjectInfoProps) => {
	try {
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
		if (!userIsMember) return null;
		return project;
	} catch {
		return null;
	}
};
