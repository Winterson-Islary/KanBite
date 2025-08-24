export class TaskUpdateError extends Error {
	constructor() {
		super("Failed to update task");
	}
}
