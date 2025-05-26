interface EnvConfig {
	NEXT_PUBLIC_API_URL: string;
}

export const ENV: Readonly<EnvConfig> = {
	NEXT_PUBLIC_API_URL:
		process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001",
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
