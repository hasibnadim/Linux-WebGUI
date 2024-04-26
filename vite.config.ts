import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": require("path").resolve(__dirname, "gui"),
    },
  },
  build: {
    outDir: "client",
  },
  plugins: [react({})],

  server: {
    proxy: {
      "/socket.io": {
        target: "http://localhost:3000",
        ws: true,
      },
      "/api": "http://localhost:3000/api", 
    },
  },
});
