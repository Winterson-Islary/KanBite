import "server-only";
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
