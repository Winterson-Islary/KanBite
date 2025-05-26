import { z } from "zod";

export const signInSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1, "Required").max(256, "Maximum 256 characters"),
});
