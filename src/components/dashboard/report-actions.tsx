"use client";

import { useState } from "react";
import { FileDown, FileSpreadsheet } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { VarianceRow } from "@/lib/data/analytics";
import type { CashMovement, LiquidityStatus } from "@/lib/liquidity";
import { formatMoney } from "@/lib/liquidity";
import {
  downloadBlob,
  toLiquiditySummaryRows,
  toMovementReportRows,
  toVarianceReportRows,
  type ReportScope,
} from "@/lib/reporting";

type ReportActionsProps = {
  movements: CashMovement[];
  scope: ReportScope;
  status: LiquidityStatus;
  varianceRows: VarianceRow[];
};

export function ReportActions({
  movements,
  scope,
  status,
  varianceRows,
}: ReportActionsProps) {
  const [exporting, setExporting] = useState<"excel" | "pdf" | null>(null);

  async function exportExcel() {
    setExporting("excel");
    try {
      const ExcelJS = await import("exceljs");
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "Cuchermercado MIS";
      workbook.created = new Date();

      const summarySheet = workbook.addWorksheet("Resumen");
      summarySheet.columns = [
        { header: "Indicador", key: "Indicador", width: 28 },
        { header: "Valor", key: "Valor", width: 24 },
      ];
      summarySheet.addRows(toLiquiditySummaryRows(status, scope));

      const varianceSheet = workbook.addWorksheet("Desviaciones");
      varianceSheet.columns = [
        { header: "Categoria", key: "Categoria", width: 28 },
        { header: "Canal", key: "Canal", width: 18 },
        { header: "Proyectado", key: "Proyectado", width: 18 },
        { header: "Real", key: "Real", width: 18 },
        { header: "Diferencia", key: "Diferencia", width: 16 },
      ];
      varianceSheet.addRows(toVarianceReportRows(varianceRows));

      const movementSheet = workbook.addWorksheet("Movimientos");
      movementSheet.columns = [
        { header: "Fecha", key: "Fecha", width: 16 },
        { header: "Tipo", key: "Tipo", width: 14 },
        { header: "Categoria", key: "Categoria", width: 28 },
        { header: "Canal", key: "Canal", width: 18 },
        { header: "Estado", key: "Estado", width: 16 },
        { header: "Importe", key: "Importe", width: 18 },
      ];
      movementSheet.addRows(toMovementReportRows(movements));

      for (const sheet of workbook.worksheets) {
        sheet.getRow(1).font = { bold: true };
      }

      const buffer = await workbook.xlsx.writeBuffer();
      downloadBlob(
        new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        `reporte-dashboard-${scope.toLowerCase()}.xlsx`,
      );
    } finally {
      setExporting(null);
    }
  }

  async function exportPdf() {
    setExporting("pdf");
    try {
      const { jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");
      const doc = new jsPDF();

      doc.setFontSize(16);
      doc.text("Reporte de flujo de caja", 14, 18);
      doc.setFontSize(10);
      doc.text(`Filtro: ${scope}`, 14, 26);
      doc.text(`Estado: ${status.label}`, 14, 32);
      doc.text(`Ratio: ${Number.isFinite(status.ratio) ? status.ratio.toFixed(2) : "N/A"}`, 14, 38);
      doc.text(`Saldo actual: ${formatMoney(status.currentBalance)}`, 14, 44);

      autoTable(doc, {
        body: varianceRows.map((row) => [
          row.category,
          row.channel,
          formatMoney(row.projected),
          formatMoney(row.real),
          `${(row.variance * 100).toFixed(1)}%`,
        ]),
        head: [["Categoria", "Canal", "Proyectado", "Real", "Diferencia"]],
        startY: 54,
        styles: { fontSize: 8 },
      });

      doc.save(`reporte-dashboard-${scope.toLowerCase()}.pdf`);
    } finally {
      setExporting(null);
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <Button disabled={exporting !== null} onClick={exportExcel} type="button" variant="outline">
        <FileSpreadsheet className="size-4" />
        {exporting === "excel" ? "Excel..." : "Excel"}
      </Button>
      <Button disabled={exporting !== null} onClick={exportPdf} type="button" variant="outline">
        <FileDown className="size-4" />
        {exporting === "pdf" ? "PDF..." : "PDF"}
      </Button>
    </div>
  );
}
