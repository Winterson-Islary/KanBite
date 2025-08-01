import "server-only";
import { ENV } from "@/lib/config";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { StatusCodes } from "http-status-codes";
import {
	Account,
	type Account as AccountType,
	Client,
	Databases,
	type Databases as DatabasesType,
	type Models,
	Storage,
	type Storage as StorageType,
	type Users as UsersType,
} from "node-appwrite";
import { AUTH_COOKIE } from "../server/auth/constants";

interface AdditionalContext {
	Variables: {
		account: AccountType;
		databases: DatabasesType;
		storage: StorageType;
		users: UsersType;
		user: Models.User<Models.Preferences>;
	};
}
export const sessionMiddleware = createMiddleware<AdditionalContext>(
	async (c, next) => {
		const client = new Client()
			.setEndpoint(ENV.NEXT_PUBLIC_APPWRITE_ENDPOINT)
			.setProject(ENV.NEXT_PUBLIC_APPWRITE_PROJECT);
		const session = getCookie(c, AUTH_COOKIE);

		if (!session)
			return c.json({ error: "Unauthenticated" }, StatusCodes.FORBIDDEN);
		client.setSession(session);
		const account = new Account(client);
		const databases = new Databases(client);
		const storage = new Storage(client);
		const user = await account.get();

		c.set("account", account);
		c.set("databases", databases);
		c.set("storage", storage);
		c.set("user", user);
		await next();
	},
);
