import { apiClient } from "@/lib/api/client";
import { INVOICES_PATH } from "@/lib/api/endpoints";
import type {
  CreateInvoicePayload,
  InvoiceCustomerInput,
  InvoiceExtensionInput,
  InvoiceFormValues,
  InvoiceInput,
  InvoiceItemInput,
} from "@/types/invoice";

function hasAny(...values: string[]): boolean {
  return values.some((value) => value.trim() !== "");
}

function buildExtensions(form: InvoiceFormValues): InvoiceExtensionInput[] {
  const taxRate = parseFloat(form.taxRate) || 0;
  const discount = parseFloat(form.discountValue) || 0;
  const extensions: InvoiceExtensionInput[] = [];

  if (taxRate > 0) {
    extensions.push({
      addDeduct: "ADD",
      type: "PERCENTAGE",
      value: taxRate,
      name: "tax",
    });
  }

  if (discount > 0) {
    extensions.push({
      addDeduct: "DEDUCT",
      type: "FIXED_VALUE",
      value: discount,
      name: "discount",
    });
  }

  return extensions;
}

function buildCustomer(form: InvoiceFormValues): InvoiceCustomerInput {
  const hasAddress = hasAny(
    form.premise,
    form.city,
    form.county,
    form.postcode,
    form.countryCode,
  );

  return {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    contact: {
      email: form.email.trim(),
      ...(form.mobile.trim() ? { mobileNumber: form.mobile.trim() } : {}),
    },
    ...(hasAddress
      ? {
          addresses: [
            {
              premise: form.premise.trim(),
              city: form.city.trim(),
              county: form.county.trim(),
              postcode: form.postcode.trim(),
              countryCode: form.countryCode.trim(),
              addressType: "BILLING",
            },
          ],
        }
      : {}),
  };
}

function buildItem(form: InvoiceFormValues): InvoiceItemInput {
  return {
    itemName: form.itemName.trim(),
    itemReference: form.itemReference.trim(),
    quantity: parseFloat(form.quantity) || 0,
    rate: parseFloat(form.rate) || 0,
    ...(form.itemDescription.trim()
      ? { description: form.itemDescription.trim() }
      : {}),
    ...(form.itemUOM.trim() ? { itemUOM: form.itemUOM.trim() } : {}),
  };
}

export function buildCreateInvoicePayload(
  form: InvoiceFormValues,
): CreateInvoicePayload {
  const extensions = buildExtensions(form);
  const hasBank = hasAny(form.accountName, form.accountNumber, form.sortCode);

  const invoice: InvoiceInput = {
    invoiceNumber: form.invoiceNumber.trim(),
    currency: form.currency,
    invoiceDate: form.invoiceDate,
    dueDate: form.dueDate,
    customer: buildCustomer(form),
    items: [buildItem(form)],
    ...(form.invoiceReference.trim()
      ? { invoiceReference: form.invoiceReference.trim() }
      : {}),
    ...(form.description.trim()
      ? { description: form.description.trim() }
      : {}),
    ...(hasBank
      ? {
          bankAccount: {
            accountName: form.accountName.trim(),
            accountNumber: form.accountNumber.trim(),
            sortCode: form.sortCode.trim(),
          },
        }
      : {}),
    ...(extensions.length ? { extensions } : {}),
  };

  return { invoices: [invoice] };
}

export async function createInvoice(form: InvoiceFormValues): Promise<unknown> {
  const payload = buildCreateInvoicePayload(form);
  const response = await apiClient.post(INVOICES_PATH, payload, {
    headers: { "Operation-Mode": "SYNC" },
  });

  return response.data;
}
