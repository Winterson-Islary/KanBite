import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api");

app.get("/echo/:message", (c) => {
	const { message } = c.req.param();
	return c.json({ message: message });
});

export const GET = handle(app);
