import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { readFileSync } from "fs";
import * as yaml from "js-yaml";
import path from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const configPath = path.resolve(__dirname, "../config.yaml");
const configFile = readFileSync(configPath, "utf8");
const config = yaml.load(configFile) as {
	frontend: { port; host };
	backend: { port; host };
};

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss(), tsconfigPaths()],
	// envDir: "../.env",
	server: {
		port: config.frontend.port,
		host: config.frontend.host,
		proxy: {
			"/api": {
				target: `http://${config.backend.host}:${config.backend.port}/api`,
				changeOrigin: true,
				secure: false,
			},
			"/hello": {
				target: `http://${config.backend.host}:${config.backend.port}/hello`,
				changeOrigin: true,
				secure: false,
			},
		},
	},
});
