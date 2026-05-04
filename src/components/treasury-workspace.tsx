"use client";

import { useMemo, useState } from "react";
import { FileSpreadsheet, Landmark, Rows3 } from "lucide-react";

import { ChannelScopeFilter } from "@/components/channel-scope-filter";
import { TreasuryDataEntryForm } from "@/components/treasury-data-entry-form";
import { TreasuryReconciliation } from "@/components/treasury-reconciliation";
import { Button } from "@/components/ui/button";
import type { Category, Channel } from "@/lib/data/demo";
import type { CashMovement } from "@/lib/liquidity";
import {
  downloadBlob,
  filterMovementsByScope,
  toMovementReportRows,
  type ReportScope,
} from "@/lib/reporting";

type TreasuryWorkspaceProps = {
  categories: Category[];
  channels: Channel[];
  movements: CashMovement[];
};

export function TreasuryWorkspace({
  categories,
  channels,
  movements,
}: TreasuryWorkspaceProps) {
  const [scope, setScope] = useState<ReportScope>("Todo");
  const [exporting, setExporting] = useState(false);
  const filteredMovements = useMemo(
    () => filterMovementsByScope(movements, scope),
    [movements, scope],
  );
  const channelCount = useMemo(
    () => new Set(filteredMovements.map((movement) => movement.channel)).size,
    [filteredMovements],
  );

  async function exportExcel() {
    setExporting(true);
    try {
      const ExcelJS = await import("exceljs");
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "Cuchermercado MIS";
      workbook.created = new Date();

      const sheet = workbook.addWorksheet("Conciliacion semanal");
      sheet.columns = [
        { header: "Fecha", key: "Fecha", width: 16 },
        { header: "Tipo", key: "Tipo", width: 14 },
        { header: "Categoria", key: "Categoria", width: 28 },
        { header: "Canal", key: "Canal", width: 18 },
        { header: "Estado", key: "Estado", width: 16 },
        { header: "Importe", key: "Importe", width: 18 },
      ];
      sheet.addRows(toMovementReportRows(filteredMovements));
      sheet.getRow(1).font = { bold: true };

      const buffer = await workbook.xlsx.writeBuffer();
      downloadBlob(
        new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        `conciliacion-${scope.toLowerCase()}.xlsx`,
      );
    } finally {
      setExporting(false);
    }
  }

  return (
    <>
      <TreasuryDataEntryForm categories={categories} channels={channels} />
      <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <ChannelScopeFilter onChange={setScope} value={scope} />
          <div className="grid gap-3 sm:grid-cols-[auto_auto_auto] sm:items-center">
            <div className="inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-semibold text-slate-700">
              <Rows3 className="size-4 text-slate-500" />
              {filteredMovements.length} registros
            </div>
            <div className="inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-semibold text-slate-700">
              <Landmark className="size-4 text-slate-500" />
              {channelCount || 0} canales
            </div>
            <Button disabled={exporting} onClick={exportExcel} type="button" variant="outline">
              <FileSpreadsheet className="size-4" />
              {exporting ? "Exportando..." : "Exportar Excel"}
            </Button>
          </div>
        </div>
      </section>
      <TreasuryReconciliation movements={filteredMovements} />
    </>
  );
}
