export class LoginError extends Error {
	constructor() {
		super("Failed to log in");
	}
}
