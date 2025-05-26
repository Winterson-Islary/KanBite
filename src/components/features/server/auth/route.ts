import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { signInSchema } from "../../schemas/sign-in-schema";

const app = new Hono()
	.get("/echo/:message", (c) => {
		const { message } = c.req.param();
		return c.json({ message: message });
	})
	.post("/login", zValidator("json", signInSchema), (c) => {
		return c.json({ success: "ok" });
	});

export default app;
