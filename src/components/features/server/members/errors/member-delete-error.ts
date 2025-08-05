export class MemberDeleteError extends Error {
	constructor() {
		super("Failed to delete member");
	}
}
