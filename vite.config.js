import { defineConfig } from "vite";
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import react from "@vitejs/plugin-react";

import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [react(), nodePolyfills()],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
});
