export class ProjectCreateError extends Error {
	constructor() {
		super("Failed to create project");
	}
}
