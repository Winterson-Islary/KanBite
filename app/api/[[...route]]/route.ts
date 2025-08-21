import { ENV } from "@/lib/config";
import auth from "@/src/components/features/server/auth/route";
import members from "@/src/components/features/server/members/route";
import projects from "@/src/components/features/server/projects/route";
import tasks from "@/src/components/features/server/tasks/route";
import workspaces from "@/src/components/features/server/workspaces/route";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api");
app.use(
	cors({
		origin: ENV.NEXT_PUBLIC_API_URL, // <--- IMPORTANT: This is the origin of your Next.js app
		allowHeaders: [
			"X-Custom-Header",
			"Upgrade-Insecure-Requests",
			"Content-Type",
			"Authorization",
		], // Add any custom headers your client sends
		allowMethods: ["POST", "GET", "PUT", "DELETE", "OPTIONS", "PATCH"], // Allow specific HTTP methods
		exposeHeaders: ["Content-Length", "X-Kuma-Revision"], // Expose custom headers to the client
		maxAge: 600, // How long the preflight request can be cached (in seconds)
		credentials: true, // Set to true if you are sending cookies or authentication headers
	}),
);

const routes = app
	.route("/auth", auth)
	.route("/workspaces", workspaces)
	.route("/members", members)
	.route("/projects", projects)
	.route("/tasks", tasks);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
