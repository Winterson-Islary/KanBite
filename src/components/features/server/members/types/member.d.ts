import type { Models } from "node-appwrite";
import type { MEMBER_ROLE_TYPE } from "../constants/types";

export type Member = Models.Document & {
	workspaceId: string;
	userId: string;
	name: string;
	email: string;
	role: MEMBER_ROLE_TYPE;
};
