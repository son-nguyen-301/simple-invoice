import "@testing-library/jest-dom/vitest";
import { loadEnvConfig } from "@next/env";

// Auto-load .env / .env.test exactly as Next does. Vitest runs with
// NODE_ENV=test, so loadEnvConfig picks up .env.test (and intentionally NOT
// .env.local) - keeping tests hermetic and consistent across machines/CI. This
// is the same loader the app and playwright.config.ts use, just driven by a
// different NODE_ENV. Test-specific env that a test exercises (e.g. a missing
// API_BASE_URL -> "misconfigured") is still set per-test via vi.stubEnv(...).
loadEnvConfig(process.cwd());

// Radix UI components (e.g. Checkbox) use ResizeObserver which is not available in jsdom.
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
