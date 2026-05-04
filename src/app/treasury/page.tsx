import { AppShell } from "@/components/app-shell";
import { TreasuryWorkspace } from "@/components/treasury-workspace";
import { getCurrentRole } from "@/lib/auth-server";
import { getCashflowDataset } from "@/lib/data/cashflow";

export default async function TreasuryPage() {
  const [{ categories, channels, movements }, role] = await Promise.all([
    getCashflowDataset(),
    getCurrentRole("treasury"),
  ]);

  return (
    <AppShell active="/treasury" role={role} title="Tesoreria">
      <TreasuryWorkspace
        categories={categories}
        channels={channels}
        movements={movements}
      />
    </AppShell>
  );
}
