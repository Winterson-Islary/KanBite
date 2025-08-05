export class MembersFetchError extends Error {
	constructor() {
		super("Failed to fetch members");
	}
}
