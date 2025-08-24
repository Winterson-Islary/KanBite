export class TaskCreateError extends Error {
	constructor() {
		super("Failed to create task");
	}
}
