import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true, // port busy-a irundha error kaatum, silent-a vera port-ku maaradhu
    watch: {
      usePolling: true, // file changes detect aaga
      interval: 300,
    },
    hmr: { overlay: true },
  },
});