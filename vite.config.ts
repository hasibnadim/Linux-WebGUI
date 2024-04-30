import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "gui"),
      "@scn/*": path.resolve(__dirname, "gui", "react", "components", "ui"),
    },
  },
  build: {
    outDir: "client",
  },
  plugins: [react({})],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/resource/scss/global.scss";`,
      },
    },
  },
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
