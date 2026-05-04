import { AppShell } from "@/components/app-shell";
import { OperatorEntryForm } from "@/components/operator-entry-form";
import { getCurrentRole } from "@/lib/auth-server";
import { getCashflowDataset } from "@/lib/data/cashflow";

export default async function OperatorPage() {
  const [{ categories, channels }, role] = await Promise.all([
    getCashflowDataset(),
    getCurrentRole("operator"),
  ]);

  return (
    <AppShell active="/operator" role={role} title="Operacion">
      <OperatorEntryForm categories={categories} channels={channels} />
    </AppShell>
  );
}
