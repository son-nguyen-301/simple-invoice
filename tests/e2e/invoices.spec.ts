import { expect, test } from "@playwright/test";

import { invoicesResponse } from "./fixtures/invoices";
import { seedSession } from "./helpers/session";

const INVOICES_GLOB = "**/api/services/invoice-service/1.0.0/invoices**";

test.beforeEach(async ({ context }) => {
  await seedSession(context);
});

test("renders invoices from the proxied response", async ({ page }) => {
  await page.route(INVOICES_GLOB, (route) =>
    route.fulfill({ json: invoicesResponse(3, 3) }),
  );

  await page.goto("/");

  await expect(page.getByTestId("invoice-list-heading")).toBeVisible();
  await expect(
    page.getByTestId("invoice-row-INV1001").filter({ visible: true }).first(),
  ).toBeVisible();
});

test("shows the empty state and clears filters", async ({ page }) => {
  await page.route(INVOICES_GLOB, (route) =>
    route.fulfill({ json: invoicesResponse(0, 0) }),
  );

  await page.goto("/?status=Paid&keyword=zzz");

  await expect(page.getByTestId("list-empty")).toBeVisible();
  await page.getByTestId("list-empty-clear-filters").click();
  await expect(page).toHaveURL(
    (url) => !url.search.includes("status") && !url.search.includes("keyword"),
  );
});

const VIEWPORTS = [
  { name: "desktop", width: 1280, height: 800 },
  { name: "mobile", width: 375, height: 812 },
  { name: "small", width: 320, height: 640 },
];

for (const viewport of VIEWPORTS) {
  test(`no horizontal scroll at ${viewport.name}`, async ({ page }) => {
    await page.route(INVOICES_GLOB, (route) =>
      route.fulfill({ json: invoicesResponse(5, 5) }),
    );

    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });
    await page.goto("/");
    await expect(
      page.getByTestId("invoice-row-INV1001").filter({ visible: true }).first(),
    ).toBeVisible();

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );

    expect(overflow).toBe(false);
  });
}

test("shows a loading overlay during a page transition", async ({ page }) => {
  await page.route(INVOICES_GLOB, (route) =>
    route.fulfill({ json: invoicesResponse(10, 41) }),
  );

  await page.goto("/");
  await expect(
    page.getByTestId("invoice-row-INV1001").filter({ visible: true }).first(),
  ).toBeVisible();

  // Delay only the page-2 transition (the later handler takes precedence),
  // keeping the initial load intercepted (hermetic) and fast.
  await page.route(INVOICES_GLOB, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    await route.fulfill({ json: invoicesResponse(10, 41) });
  });

  await page.getByTestId("invoices-pagination-page-2").click();

  await expect(page.getByTestId("list-loading-overlay")).toBeVisible();
  await expect(page.getByTestId("list-loading-overlay")).toHaveCount(0);
});
