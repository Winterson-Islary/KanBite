export class TaskGetError extends Error {
	constructor() {
		super("Failed to get tasks");
	}
}
