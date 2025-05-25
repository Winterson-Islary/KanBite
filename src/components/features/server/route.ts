import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono();

app.post("/login", (c) => {
	return c.json({ success: "ok" });
});

export default app;
