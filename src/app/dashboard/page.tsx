import { AppShell } from "@/components/app-shell";
import { DashboardWorkspace } from "@/components/dashboard/dashboard-workspace";
import { getCurrentRole } from "@/lib/auth-server";
import { getCashflowDataset } from "@/lib/data/cashflow";

export default async function DashboardPage() {
  const [{ categories, channels, movements }, role] = await Promise.all([
    getCashflowDataset(),
    getCurrentRole("admin"),
  ]);

  return (
    <AppShell active="/dashboard" role={role} title="Panel Admin">
      <DashboardWorkspace
        categories={categories}
        channels={channels}
        movements={movements}
      />
    </AppShell>
  );
}
