// Mirrors the real upstream list shape (verified 2026-06-21): bare `data` array,
// `paging.totalRecords`, status as an array of { key, value }, amount in
// `totalAmount`, customer with firstName/lastName (no email).
export function makeInvoice(index: number) {
  return {
    invoiceId: `id-${index}`,
    invoiceNumber: `INV10${String(index).padStart(2, "0")}`,
    customer: {
      firstName: "Customer",
      lastName: String(index),
    },
    currency: "GBP",
    invoiceDate: "2021-05-27",
    dueDate: "2021-06-04",
    totalAmount: 100 * index,
    status: [{ key: index % 2 === 0 ? "Paid" : "Due", value: true }],
  };
}

export function invoicesResponse(count: number, total = count) {
  return {
    data: Array.from({ length: count }, (_, i) => makeInvoice(i + 1)),
    paging: { pageNumber: 1, pageSize: 10, totalRecords: total },
  };
}
