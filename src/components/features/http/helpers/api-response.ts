import { AppError, type ErrorCode } from "@/src/shared/errors";
import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export interface ApiErrorPayload {
	code: ErrorCode;
	message: string;
	details?: unknown;
}

export const ApiResponse = {
	success<T>(c: Context, data: T, statusCode: ContentfulStatusCode = 200) {
		return c.json({ success: true as const, data }, statusCode);
	},
	error(
		c: Context,
		payload: AppError | ApiErrorPayload,
		statusCode: ContentfulStatusCode = 500,
	) {
		if (payload instanceof AppError) {
			return c.json(payload.toJSON(), payload.statusCode); // Already well-structured
		}
		return c.json({ success: false as const, error: payload }, statusCode);
	},
};

export function isApiErrorResponse(
	e: unknown,
): e is ReturnType<typeof ApiResponse.error> {
	return (
		typeof e === "object" &&
		e !== null &&
		"success" in e &&
		// biome-ignore lint/suspicious/noExplicitAny: <only ignore explicitAny here>
		(e as any).success === false &&
		"error" in e
	);
}
