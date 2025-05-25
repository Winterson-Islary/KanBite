import { Hono } from "hono";

const app = new Hono();

app.post("/login", (c) => {
	return c.json({ success: "ok" });
});

export default app;
