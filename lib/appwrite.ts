import "server-only";
import { AUTH_COOKIE } from "@/src/components/features/server/auth/constants";
import { cookies } from "next/headers";
import { Account, Client, Databases, Storage, Users } from "node-appwrite";
import { ENV } from "./config";

export async function createAdminClient() {
	const client = new Client()
		.setEndpoint(ENV.NEXT_PUBLIC_APPWRITE_ENDPOINT)
		.setProject(ENV.NEXT_PUBLIC_APPWRITE_PROJECT)
		.setKey(ENV.NEXT_APPWRITE_KEY);

	return {
		get account() {
			return new Account(client);
		},
	};
}

export async function createSessionClient() {
	const client = new Client()
		.setEndpoint(ENV.NEXT_PUBLIC_APPWRITE_ENDPOINT)
		.setProject(ENV.NEXT_PUBLIC_APPWRITE_PROJECT);
	const cookie = await cookies();
	const session = cookie.get(AUTH_COOKIE);
	if (!session || !session.value) throw new Error("Unauthorized");
	client.setSession(session.value);

	return {
		get account() {
			return new Account(client);
		},
		get databases() {
			return new Databases(client);
		},
	};
}
