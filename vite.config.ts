import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    // Allow the forwarded Codespaces URL (https://<name>-5173.app.github.dev)
    allowedHosts: [".app.github.dev"]
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
    allowedHosts: [".app.github.dev"]
  }
});
