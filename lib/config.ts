interface EnvConfig {
	NEXT_PUBLIC_API_URL: string;
	NEXT_PUBLIC_APPWRITE_ENDPOINT: string;
	NEXT_PUBLIC_APPWRITE_PROJECT: string;
	NEXT_APPWRITE_KEY: string;
	NEXT_PUBLIC_APPWRITE_DATABASE_ID: string;
	NEXT_PUBLIC_APPWRITE_WORKSPACES_ID: string;
	NEXT_PUBLIC_APPWRITE_BUCKET_ID: string;
	NEXT_PUBLIC_APPWRITE_MEMBERS_ID: string;
}

export const ENV: Readonly<EnvConfig> = {
	NEXT_PUBLIC_API_URL:
		process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001",
	NEXT_PUBLIC_APPWRITE_ENDPOINT:
		process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? "",
	NEXT_PUBLIC_APPWRITE_PROJECT: process.env.NEXT_PUBLIC_APPWRITE_PROJECT ?? "",
	NEXT_APPWRITE_KEY: process.env.NEXT_APPWRITE_KEY ?? "",
	NEXT_PUBLIC_APPWRITE_DATABASE_ID:
		process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? "",
	NEXT_PUBLIC_APPWRITE_WORKSPACES_ID:
		process.env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID ?? "",
	NEXT_PUBLIC_APPWRITE_BUCKET_ID:
		process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID ?? "",
	NEXT_PUBLIC_APPWRITE_MEMBERS_ID:
		process.env.NEXT_PUBLIC_APPWRITE_MEMBERS_ID ?? "",
} as const;

type EnvKeys = keyof typeof ENV;

if (process.env.NODE_ENV === "development") {
	for (const key in ENV) {
		const val = ENV[key as EnvKeys];
		if (!val || val === "") {
			console.warn(`Warning: Env variable ${key} is missing or empty`);
		}
	}
}
