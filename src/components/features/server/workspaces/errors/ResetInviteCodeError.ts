export class ResetInviteCodeError extends Error {
	constructor() {
		super("Failed to reset invite code");
	}
}
