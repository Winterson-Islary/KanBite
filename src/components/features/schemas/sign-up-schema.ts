import { z } from "zod";

export const signUpSchema = z.object({
	username: z.string().trim().nonempty("Required"),
	email: z.string().email().nonempty(),
	password: z
		.string()
		.nonempty("Required")
		.min(8, "Minimum 8 characters")
		.max(256, "Maximum 256 characters"),
});
