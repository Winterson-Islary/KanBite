import winston from "winston";

const levels = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	debug: 4,
};

const level = () => {
	return process.env.LOG_LEVEL || "info";
};

const colors = {
	error: "red",
	warn: "yellow",
	info: "blue",
	http: "magenta",
	debug: "white",
};

winston.addColors(colors);

const isProduction = process.env.NODE_ENV === "production";

const developmentFormat = winston.format.combine(
	winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
	winston.format.colorize({ all: true }),
	// This is the crucial part for stack traces.
	winston.format.errors({ stack: true }),
	winston.format.printf((info) => {
		// We manually construct the log message to include the stack trace if it exists.
		const message = `${info.timestamp} [${info.level}]: ${info.message}`;
		return info.stack ? `${message}\n${info.stack}` : message;
	}),
);

// The format for production is structured JSON. This is what log analysis tools expect.
const productionFormat = winston.format.combine(
	winston.format.timestamp(),
	// Also include stack traces in production JSON logs.
	winston.format.errors({ stack: true }),
	winston.format.json(),
);

const transports = [new winston.transports.Console()];

const logger = winston.createLogger({
	level: level(),
	levels,
	// Use the appropriate format based on the environment.
	format: isProduction ? productionFormat : developmentFormat,
	transports,
});

export default logger;
