export class ProjectDeleteError extends Error {
	constructor() {
		super("Failed to delete project");
	}
}
