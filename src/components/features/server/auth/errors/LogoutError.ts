export class LogoutError extends Error {
	constructor() {
		super("Failed to log out");
	}
}
