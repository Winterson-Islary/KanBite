import z from "zod";

const configSchema = z.object({
	apiUrl: z.string().url().default("http://localhost:3001"),
	appwrite: z.object({
		endpoint: z
			.string()
			.url({ message: "NEXT_PUBLIC_APPWRITE_ENDPOINT must be a valid url" }),
		project: z
			.string()
			.min(1, { message: "NEXT_PUBLIC_APPWRITE_PROJECT is required" }),
		databaseId: z
			.string()
			.min(1, { message: "NEXT_PUBLIC_APPWRITE_DATABASE_ID is required" }),
		workspacesId: z
			.string()
			.min(1, { message: "NEXT_PUBLIC_APPWRITE_WORKSPACES_ID is required" }),
		bucketId: z
			.string()
			.min(1, { message: "NEXT_PUBLIC_APPWRITE_BUCKET_ID is required" }),
		membersId: z
			.string()
			.min(1, { message: "NEXT_PUBLIC_APPWRITE_MEMBERS_ID is required" }),
		projectsId: z
			.string()
			.min(1, { message: "NEXT_PUBLIC_APPWRITE_PROJECTS_ID is required" }),
		tasksId: z
			.string()
			.min(1, { message: "NEXT_PUBLIC_APPWRITE_TASKS_ID is required" }),
	}),
	server: z.object({
		appwriteKey: z.string().min(1, {
			message: "NEXT_APPWRITE_KEY is a required server-side secret",
		}),
	}),
});

const loadConfig = () => {
	const rawConfig = {
		apiUrl: process.env.NEXT_PUBLIC_API_URL,
		appwrite: {
			endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
			project: process.env.NEXT_PUBLIC_APPWRITE_PROJECT,
			databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
			workspacesId: process.env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID,
			bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
			membersId: process.env.NEXT_PUBLIC_APPWRITE_MEMBERS_ID,
			projectsId: process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_ID,
			tasksId: process.env.NEXT_PUBLIC_APPWRITE_TASKS_ID,
		},
		server: {
			appwriteKey: process.env.NEXT_APPWRITE_KEY,
		},
	};

	try {
		return configSchema.parse(rawConfig);
	} catch (error) {
		if (error instanceof z.ZodError) {
			console.error(
				"❌ Invalid environment configuration:",
				error.flatten().fieldErrors,
			);
			throw new Error(
				"Invalid environment variables. Check the console for details.",
			);
		}
		throw error;
	}
};

export const config = Object.freeze(loadConfig());
export type AppConfig = z.infer<typeof configSchema>;
