export const WORKERS = process.env.WEB_CONCURRENCY ?? 1;
export const PORT = process.env.PORT ?? 8008;
export const NODE_ENV = process.env.NODE_ENV ?? "development";
export const IS_DEVELOPMENT = NODE_ENV !== "production";
