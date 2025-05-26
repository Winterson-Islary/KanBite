import auth from "@/src/components/features/server/auth/route";
import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api");

const routes = app.route("/auth", auth);

export const GET = handle(app);

export type AppType = typeof routes;
