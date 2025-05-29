import { createAdminClient } from "@/lib/appwrite";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { ID } from "node-appwrite";
import { sessionMiddleware } from "../../middlewares/session-middleware";
import { signInSchema } from "../../schemas/sign-in-schema";
import { signUpSchema } from "../../schemas/sign-up-schema";
import { AUTH_COOKIE, SESSION_DURATION } from "./constants";

const app = new Hono()
	.get("/echo/:message", (c) => {
		const { message } = c.req.param();
		return c.json({ message: message });
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
		return c.json({ success: "ok" });
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
		return c.json({ success: "ok" });
	})
	.post("/logout", sessionMiddleware, async (c) => {
		deleteCookie(c, AUTH_COOKIE);
		const account = c.get("account");
		await account.deleteSession("current");
		return c.json({ success: "ok" });
	});

export default app;
