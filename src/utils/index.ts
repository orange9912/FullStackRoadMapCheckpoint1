import { fileURLToPath } from "url";
import { dirname } from "path";

export const get__filename = () => fileURLToPath(import.meta.url);

export const get__dirname = () => dirname(fileURLToPath(import.meta.url));