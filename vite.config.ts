import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // listen on all interfaces
    port: 5000,
    allowedHosts: [
      "1e6365cf-5447-497a-bc0f-dd0b7ef1f7a1-00-16n8fhs8zza85.pike.replit.dev",
    ], // allow all network hosts
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
});
