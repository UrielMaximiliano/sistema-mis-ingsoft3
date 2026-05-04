import type { CashMovement } from "@/lib/liquidity";

export type Category = {
  id: string;
  name: string;
  description: string;
  type: "income" | "expense";
};

export type Channel = {
  id: string;
  name: "Mayorista" | "Minorista";
};

export const categories: Category[] = [
  {
    id: "cat-sales",
    name: "Ventas",
    description: "Ingresos por ventas diarias",
    type: "income",
  },
  {
    id: "cat-collections",
    name: "Cobranzas",
    description: "Cobros pendientes de clientes",
    type: "income",
  },
  {
    id: "cat-payroll",
    name: "Sueldos",
    description: "Nomina semanal y mensual",
    type: "expense",
  },
  {
    id: "cat-services",
    name: "Servicios",
    description: "Luz, gas, internet y mantenimiento",
    type: "expense",
  },
  {
    id: "cat-critical-suppliers",
    name: "Proveedores Criticos",
    description: "Pagos que sostienen operacion comercial",
    type: "expense",
  },
  {
    id: "cat-logistics",
    name: "Logistica",
    description: "Fletes y distribucion",
    type: "expense",
  },
];

export const channels: Channel[] = [
  { id: "channel-wholesale", name: "Mayorista" },
  { id: "channel-retail", name: "Minorista" },
];

export const movements: CashMovement[] = [
  {
    id: "mov-001",
    amount: 1820000,
    category: "Ventas",
    channel: "Mayorista",
    date: "2026-05-01",
    isProjected: false,
    type: "income",
  },
  {
    id: "mov-002",
    amount: 1260000,
    category: "Ventas",
    channel: "Minorista",
    date: "2026-05-02",
    isProjected: false,
    type: "income",
  },
  {
    id: "mov-003",
    amount: 840000,
    category: "Proveedores Criticos",
    channel: "Mayorista",
    date: "2026-05-02",
    isProjected: false,
    type: "expense",
  },
  {
    id: "mov-004",
    amount: 530000,
    category: "Servicios",
    channel: "Minorista",
    date: "2026-05-03",
    isProjected: false,
    type: "expense",
  },
  {
    id: "mov-005",
    amount: 2050000,
    category: "Cobranzas",
    channel: "Mayorista",
    date: "2026-05-06",
    isProjected: true,
    type: "income",
  },
  {
    id: "mov-006",
    amount: 980000,
    category: "Ventas",
    channel: "Minorista",
    date: "2026-05-07",
    isProjected: true,
    type: "income",
  },
  {
    id: "mov-007",
    amount: 1560000,
    category: "Sueldos",
    channel: "Mayorista",
    date: "2026-05-08",
    isProjected: true,
    type: "expense",
  },
  {
    id: "mov-008",
    amount: 610000,
    category: "Servicios",
    channel: "Minorista",
    date: "2026-05-08",
    isProjected: true,
    type: "expense",
  },
  {
    id: "mov-009",
    amount: 1725000,
    category: "Proveedores Criticos",
    channel: "Mayorista",
    date: "2026-05-09",
    isProjected: true,
    type: "expense",
  },
  {
    id: "mov-010",
    amount: 420000,
    category: "Logistica",
    channel: "Mayorista",
    date: "2026-05-10",
    isProjected: true,
    type: "expense",
  },
];
