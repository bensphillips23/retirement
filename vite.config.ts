import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// CHANGE THIS to "/<your-repo-name>/" for GitHub Pages, sucka
const repoBase = "/retirement/";

export default defineConfig({
  plugins: [react()],
  base: repoBase
});
