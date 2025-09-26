import type { ContentfulStatusCode } from "hono/utils/http-status";

export const ErrorCodes = {
	workspaceError: "WORKSPACE_ERROR",
	userNotFound: "USER_NOT_FOUND",
	userAlreadyExists: "USER_ALREADY_EXISTS",
	expiredToken: "EXPIRED_TOKEN",
	invalidToken: "INVALID_TOKEN",
	invalidInput: "INVALID_INPUT",
	unauthorized: "UNAUTHORIZED",
	forbidden: "FORBIDDEN",
	internalServerError: "INTERNAL_SERVER_ERROR",
	timeout: "TIMEOUT",
	dbError: "DB_ERROR",
} as const;
export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

// app-errors.ts BASE_ERROR_CLASS
export class AppError extends Error {
	public readonly code: ErrorCode;
	public readonly message: string;
	public readonly statusCode: ContentfulStatusCode;
	public readonly details?: unknown;

	constructor(
		code: ErrorCode,
		message: string,
		statusCode: ContentfulStatusCode = 500,
		details?: unknown,
	) {
		super(message);
		this.name = this.constructor.name;
		this.code = code;
		this.message = message;
		this.statusCode = statusCode;
		this.details = details;

		// Keeps correct stack trace in Node.js
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}

	// What shows up when JSON.stringify(err) is called
	toJSON() {
		return {
			success: false as const,
			error: {
				code: this.code,
				message: this.message,
				details: this.details,
			},
		};
	}

	// For direct stringification, e.g. console.log(`${err}`)
	toString() {
		return JSON.stringify(this.toJSON(), null, 2);
	}
}
