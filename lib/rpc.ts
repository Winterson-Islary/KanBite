import type { AppType } from "@/app/api/[[...route]]/route";
import { hc } from "hono/client";
import { ENV } from "./config";

export const client = hc<AppType>(ENV.NEXT_PUBLIC_API_URL);
