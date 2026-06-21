import { expect, test } from "@playwright/test";

import { seedSession } from "./helpers/session";

const INVOICES_GLOB = "**/api/services/invoice-service/1.0.0/invoices**";

test.beforeEach(async ({ context }) => {
  await seedSession(context);
});

async function fillRequiredFields(page: import("@playwright/test").Page) {
  await page.getByLabel(/Invoice number/).fill("INV0001");
  await page.getByLabel(/Invoice date/).fill("2026-06-21");
  await page.getByLabel(/Due date/).fill("2026-06-28");
  await page.getByLabel(/First name/).fill("Nguyen");
  await page.getByLabel(/Last name/).fill("Dung");
  await page.getByLabel(/Email/).fill("nguyen@example.com");
  await page.getByLabel(/Item name/).fill("Honda Motor");
  await page.getByLabel(/Item reference/).fill("itemRef");
  await page.getByLabel(/Quantity/).fill("2");
  await page.getByLabel(/Rate/).fill("1000");
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
  await page.getByLabel("Country", { exact: true }).click();
  await page.getByPlaceholder(/Search country/).fill("VN");
  await page.getByRole("option", { name: "Vietnam (VN)" }).click();

  await page.getByRole("button", { name: /create invoice/i }).click();

  await expect(page.getByText("Invoice created")).toBeVisible();
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
  await page.getByRole("button", { name: /create invoice/i }).click();

  await expect(page.getByText("Invoice number is required")).toBeVisible();
  await expect(page.getByText("Item name is required")).toBeVisible();
  expect(posted).toBe(false);
});
