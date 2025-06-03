"use server";
import { ENV } from "@/lib/config";
import { cookies } from "next/headers";
import { Account, Client } from "node-appwrite";
import { AUTH_COOKIE } from "./constants";

export const getCurrentUser = async () => {
	try {
		const client = new Client()
			.setEndpoint(ENV.NEXT_PUBLIC_APPWRITE_ENDPOINT)
			.setProject(ENV.NEXT_PUBLIC_APPWRITE_PROJECT);
		const cookie = await cookies();
		const session = cookie.get(AUTH_COOKIE);
		if (!session) return null;
		client.setSession(session.value);
		const account = new Account(client);
		return await account.get();
	} catch {
		return null;
	}
};
