"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createInvoice } from "@/lib/api/create-invoice";
import type { InvoiceFormValues } from "@/types/invoice";

export function useCreateInvoice() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (form: InvoiceFormValues) => createInvoice(form),
    onSuccess: (_data, form) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Invoice created", {
        description: `Invoice ${form.invoiceNumber} was created successfully.`,
      });
      router.push("/");
    },
    onError: () => {
      toast.error("Couldn't create invoice", {
        description: "Please try again.",
      });
    },
  });
}
