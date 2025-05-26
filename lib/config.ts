interface EnvConfig {
	NEXT_PUBLIC_API_URL: string;
}

function getEnvVariable(key: keyof EnvConfig, defaultValue?: string) {
	const value = process.env[key];
	if (value === undefined && defaultValue === undefined) {
		throw new Error(`Environment variable ${key} is not set`);
	}
	// biome-ignore lint/style/noNonNullAssertion: < If execution reaches this line, it confirms that value or defaultValue holds a valid assignment >
	return value ?? defaultValue!;
}

export const ENV: Readonly<EnvConfig> = {
	NEXT_PUBLIC_API_URL: getEnvVariable(
		"NEXT_PUBLIC_API_URL",
		"http://localhost:3001",
	),
};

//? For Development Server
if (process.env.NODE_ENV === "development") {
	for (const key in ENV) {
		if (
			ENV[key as keyof EnvConfig] === undefined ||
			ENV[key as keyof EnvConfig] === null
		) {
			console.log(
				`Warning: Environment variable "${key} is not set in .env.local or has an invalid value"`,
			);
		}
	}
}
