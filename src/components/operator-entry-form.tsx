"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, PlusCircle, RefreshCcw, ShieldCheck, TrendingDown, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/input";
import type { Category, Channel } from "@/lib/data/demo";
import { createMovement } from "@/lib/repositories/financial-mutations";
import { validateMovementDraft } from "@/lib/validation/movement";

type OperatorEntryFormProps = {
  categories: Category[];
  channels: Channel[];
};

export function OperatorEntryForm({ categories, channels }: OperatorEntryFormProps) {
  const defaultCategory = categories[0]?.id ?? "";
  const defaultChannel = channels[0]?.id ?? "";
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState(defaultCategory);
  const [channelId, setChannelId] = useState(defaultChannel);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [type, setType] = useState<"income" | "expense">("income");
  const [message, setMessage] = useState<{
    text: string;
    tone: "error" | "success";
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
      isProjected: false,
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
        text: result.demo ? "Movimiento validado en modo demo." : "Movimiento registrado.",
        tone: "success",
      });
    } catch (error) {
      setMessage({
        text: error instanceof Error ? error.message : "No se pudo registrar.",
        tone: "error",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-xl overflow-hidden border-teal-100">
      <div className="h-1 bg-teal-700" />
      <CardHeader className="bg-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Carga ciega</CardTitle>
            <p className="mt-2 text-sm text-slate-600">Movimiento operativo</p>
          </div>
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
            <ShieldCheck className="size-5" />
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={onSubmit}>
          <div className="grid grid-cols-2 gap-2">
            <Button
              className="h-12"
              onClick={() => {
                setType("income");
                setCategoryId(categories.find((category) => category.type === "income")?.id ?? "");
              }}
              type="button"
              variant={type === "income" ? "success" : "outline"}
            >
              <TrendingUp className="size-4" />
              Ingreso
            </Button>
            <Button
              className="h-12"
              onClick={() => {
                setType("expense");
                setCategoryId(categories.find((category) => category.type === "expense")?.id ?? "");
              }}
              type="button"
              variant={type === "expense" ? "primary" : "outline"}
            >
              <TrendingDown className="size-4" />
              Egreso
            </Button>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="amount">Importe</Label>
            <Input
              className="h-14 text-xl font-semibold"
              id="amount"
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

          <div className="grid gap-2">
            <Label htmlFor="category">Categoria</Label>
            <Select
              id="category"
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

          <div className="grid gap-2">
            <Label htmlFor="channel">Canal</Label>
            <Select
              id="channel"
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

          <div className="grid gap-2">
            <Label htmlFor="date">Fecha</Label>
            <Input
              id="date"
              onChange={(event) => setDate(event.target.value)}
              required
              type="date"
              value={date}
            />
          </div>

          {message ? (
            <p
              className={
                message.tone === "success"
                  ? "inline-flex items-center gap-2 rounded-lg bg-teal-50 px-3 py-2 text-sm font-medium text-teal-800"
                  : "rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
              }
            >
              {message.tone === "success" ? <CheckCircle2 className="size-4" /> : null}
              {message.text}
            </p>
          ) : null}

          <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
            <Button className="h-12 text-base" disabled={submitting} type="submit">
              <PlusCircle className="size-5" />
              {submitting ? "Guardando..." : "Guardar movimiento"}
            </Button>
            <Button
              className="h-12"
              onClick={() => {
                setAmount("");
                setMessage(null);
              }}
              type="button"
              variant="outline"
            >
              <RefreshCcw className="size-4" />
              Limpiar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
