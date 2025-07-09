export class WorkspacesDeleteError extends Error {
	constructor() {
		super("Failed to delete workspace");
	}
}
