"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  DatabaseZap,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/input";
import type { Category, Channel } from "@/lib/data/demo";
import { createMovement } from "@/lib/repositories/financial-mutations";
import { validateMovementDraft } from "@/lib/validation/movement";

type TreasuryDataEntryFormProps = {
  categories: Category[];
  channels: Channel[];
};

export function TreasuryDataEntryForm({ categories, channels }: TreasuryDataEntryFormProps) {
  const defaultCategory = categories[0]?.id ?? "";
  const defaultChannel = channels[0]?.id ?? "";
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState(defaultCategory);
  const [channelId, setChannelId] = useState(defaultChannel);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [isProjected, setIsProjected] = useState(true);
  const [message, setMessage] = useState<{
    text: string;
    tone: "error" | "success";
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [type, setType] = useState<"income" | "expense">("income");

  const filteredCategories = useMemo(
    () => categories.filter((category) => category.type === type),
    [categories, type],
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const draft = {
      amount: Number(amount),
      categoryId,
      channelId,
      date,
      isProjected,
      type,
    };

    const validationError = validateMovementDraft(draft, {
      allowedCategoryIds: categories.map((category) => category.id),
      allowedChannelIds: channels.map((channel) => channel.id),
    });

    if (validationError) {
      setMessage({ text: validationError, tone: "error" });
      return;
    }

    setSubmitting(true);
    try {
      const result = await createMovement(draft);
      setAmount("");
      setMessage({
        text: result.demo
          ? "Dato integrado en modo demo."
          : "Dato integrado en la base financiera.",
        tone: "success",
      });
    } catch (error) {
      setMessage({
        text: error instanceof Error ? error.message : "No se pudo integrar el dato.",
        tone: "error",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="h-1 bg-[linear-gradient(90deg,#2563eb,#0f766e)]" />
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Carga de Tesoreria</CardTitle>
            <p className="mt-2 text-sm text-slate-600">Integracion semanal</p>
          </div>
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
            <DatabaseZap className="size-5" />
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 lg:grid-cols-6 xl:grid-cols-7" onSubmit={onSubmit}>
          <div className="grid gap-2 lg:col-span-2">
            <Label htmlFor="treasury-status">Estado</Label>
            <Select
              id="treasury-status"
              onChange={(event) => setIsProjected(event.target.value === "projected")}
              value={isProjected ? "projected" : "real"}
            >
              <option value="projected">Proyectado</option>
              <option value="real">Real</option>
            </Select>
          </div>

          <div className="grid gap-2 lg:col-span-1">
            <Label htmlFor="treasury-type">Tipo</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                className="h-11 px-3"
                onClick={() => {
                  setType("income");
                  setCategoryId(
                    categories.find((category) => category.type === "income")?.id ?? "",
                  );
                }}
                type="button"
                variant={type === "income" ? "success" : "outline"}
              >
                <TrendingUp className="size-4" />
                Ingreso
              </Button>
              <Button
                className="h-11 px-3"
                onClick={() => {
                  setType("expense");
                  setCategoryId(
                    categories.find((category) => category.type === "expense")?.id ?? "",
                  );
                }}
                type="button"
                variant={type === "expense" ? "primary" : "outline"}
              >
                <TrendingDown className="size-4" />
                Egreso
              </Button>
            </div>
          </div>

          <div className="grid gap-2 lg:col-span-1">
            <Label htmlFor="treasury-amount">Importe</Label>
            <Input
              id="treasury-amount"
              inputMode="decimal"
              min="0.01"
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0.00"
              required
              step="0.01"
              type="number"
              value={amount}
            />
          </div>

          <div className="grid gap-2 lg:col-span-1">
            <Label htmlFor="treasury-category">Categoria</Label>
            <Select
              id="treasury-category"
              onChange={(event) => setCategoryId(event.target.value)}
              value={categoryId}
            >
              {filteredCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid gap-2 lg:col-span-1">
            <Label htmlFor="treasury-channel">Canal</Label>
            <Select
              id="treasury-channel"
              onChange={(event) => setChannelId(event.target.value)}
              value={channelId}
            >
              {channels.map((channel) => (
                <option key={channel.id} value={channel.id}>
                  {channel.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid gap-2 lg:col-span-1">
            <Label htmlFor="treasury-date">Fecha</Label>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                className="pl-9"
                id="treasury-date"
                onChange={(event) => setDate(event.target.value)}
                required
                type="date"
                value={date}
              />
            </div>
          </div>

          {message ? (
            <p
              className={
                message.tone === "success"
                  ? "inline-flex items-center gap-2 rounded-lg bg-teal-50 px-3 py-2 text-sm font-medium text-teal-800 lg:col-span-4"
                  : "rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 lg:col-span-4"
              }
            >
              {message.tone === "success" ? <CheckCircle2 className="size-4" /> : null}
              {message.text}
            </p>
          ) : null}

          <Button className="h-11 lg:col-span-2" disabled={submitting} type="submit">
            <DatabaseZap className="size-4" />
            {submitting ? "Integrando..." : "Integrar dato"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
