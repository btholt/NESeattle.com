import { mkdir, writeFile } from "node:fs/promises";
import { getEventsResponse } from "../artifacts/api-server/src/routes/events.ts";
import { logger } from "../artifacts/api-server/src/lib/logger.ts";

const response = await getEventsResponse(logger);
const directory = new URL("../artifacts/local-guide/dist/public/api/events/", import.meta.url);
await mkdir(directory, { recursive: true });
await writeFile(new URL("index.json", directory), JSON.stringify(response));
