import { createAdminClient } from "@/lib/appwrite";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { ID } from "node-appwrite";
import { ApiResponse } from "../../http/helpers/api-response";
import { sessionMiddleware } from "../../http/middlewares/session-middleware";
import { AUTH_COOKIE, SESSION_DURATION } from "./constants";
import { signInSchema } from "./schemas/sign-in-schema";
import { signUpSchema } from "./schemas/sign-up-schema";

const app = new Hono()
	.get("/current", sessionMiddleware, (c) => {
		const user = c.get("user");
		return c.json({ data: user });
	})
	.post("/login", zValidator("json", signInSchema), async (c) => {
		const { email, password } = c.req.valid("json");
		const { account } = await createAdminClient();
		const session = await account.createEmailPasswordSession(email, password);
		setCookie(c, AUTH_COOKIE, session.secret, {
			path: "/",
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			maxAge: SESSION_DURATION,
		});
		return ApiResponse.success(c, null);
	})
	.post("/register", zValidator("json", signUpSchema), async (c) => {
		const { username, email, password } = c.req.valid("json");
		const { account } = await createAdminClient();
		await account.create(ID.unique(), email, password, username);
		const session = await account.createEmailPasswordSession(email, password);
		setCookie(c, AUTH_COOKIE, session.secret, {
			path: "/",
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			maxAge: SESSION_DURATION,
		});
		return ApiResponse.success(c, null);
	})
	.post("/logout", sessionMiddleware, async (c) => {
		deleteCookie(c, AUTH_COOKIE);
		const account = c.get("account");
		await account.deleteSession("current");
		return ApiResponse.success(c, null);
	});

export default app;
