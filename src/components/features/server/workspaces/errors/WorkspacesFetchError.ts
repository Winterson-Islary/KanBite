export class WorkspacesFetchError extends Error {
	constructor() {
		super("Failed to fetch workspaces");
	}
}
