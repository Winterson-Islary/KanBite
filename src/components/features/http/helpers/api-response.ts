import { AppError, type ErrorCode } from "@/src/shared/errors";

export interface ApiErrorPayload {
	code: ErrorCode;
	message: string;
	details?: unknown;
}

export const ApiResponse = {
	success<T>(data: T) {
		return { success: true as const, data };
	},
	error(payload: AppError | ApiErrorPayload) {
		if (payload instanceof AppError) {
			return payload.toJSON(); // Already well-structured
		}
		return { success: false as const, error: payload };
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
