import { test, expect } from "@playwright/test";

import { seedSession } from "./helpers/session";

test("unauthenticated visitor to / is redirected to /login", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/login$/);
});

test("authenticated visitor to /login is redirected to /", async ({
  context,
  page,
}) => {
  await seedSession(context);
  await page.goto("/login");
  await expect(page).toHaveURL("http://localhost:3000/");
});

test("unauthenticated visitor can view /login", async ({ page }) => {
  await page.goto("/login");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByTestId("login-page-heading")).toBeVisible();
});
