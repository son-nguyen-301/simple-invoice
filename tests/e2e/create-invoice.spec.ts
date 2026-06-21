import { expect, test } from "@playwright/test";

import { seedSession } from "./helpers/session";

const INVOICES_GLOB = "**/api/services/invoice-service/1.0.0/invoices**";

test.beforeEach(async ({ context }) => {
  await seedSession(context);
});

async function fillRequiredFields(page: import("@playwright/test").Page) {
  await page
    .getByTestId("invoice-details-section-invoice-number")
    .fill("INV0001");
  await page
    .getByTestId("invoice-details-section-invoice-date")
    .fill("2026-06-21");
  await page.getByTestId("invoice-details-section-due-date").fill("2026-06-28");
  await page.getByTestId("customer-section-first-name").fill("Nguyen");
  await page.getByTestId("customer-section-last-name").fill("Dung");
  await page.getByTestId("customer-section-email").fill("nguyen@example.com");
  await page.getByTestId("customer-section-mobile").fill("+6597594971");
  await page.getByTestId("line-item-section-item-name").fill("Honda Motor");
  await page.getByTestId("line-item-section-item-reference").fill("itemRef");
  await page.getByTestId("line-item-section-quantity").fill("2");
  await page.getByTestId("line-item-section-rate").fill("1000");
}

test("creates an invoice and shows the success confirmation", async ({
  page,
}) => {
  type CapturedBody = {
    invoices: {
      items: { itemReference?: string }[];
      customer: { addresses?: { countryCode?: string }[] };
    }[];
  };

  let captured: { body: CapturedBody; operationMode?: string } | null = null;

  await page.route(INVOICES_GLOB, async (route) => {
    const request = route.request();

    if (request.method() === "POST") {
      captured = {
        body: request.postDataJSON(),
        operationMode: request.headers()["operation-mode"],
      };

      await route.fulfill({ json: { data: { invoiceId: "new-1" } } });

      return;
    }

    await route.fulfill({
      json: { data: [], paging: { totalRecords: 0 } },
    });
  });

  await page.goto("/create");
  await fillRequiredFields(page);

  // Country is a filterable combobox of ISO2 codes (the API rejects free-text
  // country names); search by code, then pick the option.
  await page.getByTestId("country-select-trigger").click();
  await page.getByTestId("country-select-search").fill("VN");
  await page.getByTestId("country-select-option-VN").click();

  await page.getByTestId("invoice-summary-submit").click();

  await expect(
    page.getByTestId("use-create-invoice-success-toast"),
  ).toBeVisible();
  await expect(page).toHaveURL((url) => url.pathname === "/");

  const body = captured!.body;

  expect(body.invoices).toHaveLength(1);
  expect(body.invoices[0].items).toHaveLength(1);
  expect(body.invoices[0].items[0].itemReference).toBe("itemRef");
  expect(body.invoices[0].customer.addresses?.[0].countryCode).toBe("VN");
  expect(captured!.operationMode).toBe("SYNC");
});

test("blocks submission and shows errors when required fields are empty", async ({
  page,
}) => {
  let posted = false;

  await page.route(INVOICES_GLOB, async (route) => {
    if (route.request().method() === "POST") {
      posted = true;
    }

    await route.fulfill({ json: { data: [], paging: { totalRecords: 0 } } });
  });

  await page.goto("/create");
  await page.getByTestId("invoice-summary-submit").click();

  await expect(
    page.getByTestId("invoice-details-section-invoice-number-error"),
  ).toBeVisible();
  await expect(
    page.getByTestId("line-item-section-item-name-error"),
  ).toBeVisible();
  expect(posted).toBe(false);
});
