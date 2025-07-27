import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	// envDir: "../.env",
	server: {
		port: 10101,
		proxy: {
			"/api": {
				target: "http://localhost:9911/api",
				changeOrigin: true,
				secure: false,
			},
			"/hello": {
				target: "http://localhost:9911/hello",
				changeOrigin: true,
				secure: false,
			},
		},
	},
});
