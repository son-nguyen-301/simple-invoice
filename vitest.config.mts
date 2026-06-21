import { defineConfig, configDefaults } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    // Enables @testing-library/react's automatic afterEach cleanup between renders.
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    // Keep Playwright e2e specs out of the Vitest run - Playwright owns
    // `tests/e2e/`; Vitest runs the unit specs under `tests/unit/`.
    exclude: [...configDefaults.exclude, "tests/e2e/**"],
  },
});
