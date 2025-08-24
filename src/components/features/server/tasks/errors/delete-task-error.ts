export class TaskDeleteError extends Error {
	constructor() {
		super("Failed to delete task");
	}
}
