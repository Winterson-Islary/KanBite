export class MemberUpdateError extends Error {
	constructor() {
		super("failed to update member");
	}
}
