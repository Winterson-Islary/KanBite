export class WorkspacesFetchError extends Error {
	constructor() {
		super("Failed to fetch workspaces");
	}
}

export class UnauthorizedError extends Error {
	public readonly statusCode: number;

	constructor(message = "Unauthorized access.") {
		super(message);
		this.name = "UnauthorizedError"; // Good practice to set the name
		this.statusCode = 401; // Common HTTP status code for Unauthorized
	}
}

export class WorkspaceUpdateError extends Error {
	constructor() {
		super("Failed to update workspaces");
	}
}
