import { createFinancialRepository } from "@/lib/repositories/financial-repository";

export async function getCashflowDataset() {
  return createFinancialRepository().getCashflowDataset();
}
