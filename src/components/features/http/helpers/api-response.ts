import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

interface ApiErrorPayload {
	code: string;
	message: string;
	details?: unknown;
}

export const ApiResponse = {
	success<T>(c: Context, data: T, statusCode: ContentfulStatusCode = 200) {
		return c.json({ success: true, data: data }, statusCode);
	},
	error(
		c: Context,
		error: ApiErrorPayload,
		statusCode: ContentfulStatusCode = 400,
	) {
		return c.json({ success: false, error: error }, statusCode);
	},
};
