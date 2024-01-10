import { defineConfig } from "vite";
import genToolsMetadata from "./build_plugins/gen_tools_metadata";
import {} from "vite";

export default defineConfig({
    plugins: [genToolsMetadata()],
    build: {
        target: ["esnext", "chrome95", "firefox122"],
    },
});
