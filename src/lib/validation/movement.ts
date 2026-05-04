import type { MovementDraft } from "@/lib/repositories/financial-repository";

export type MovementValidationContext = {
  allowedCategoryIds: string[];
  allowedChannelIds: string[];
};

export function validateMovementDraft(
  draft: MovementDraft,
  context: MovementValidationContext,
) {
  if (!Number.isFinite(draft.amount) || draft.amount <= 0) {
    return "El importe debe ser mayor a cero.";
  }

  if (!draft.date) {
    return "La fecha es obligatoria.";
  }

  if (!context.allowedCategoryIds.includes(draft.categoryId)) {
    return "La categoria seleccionada no esta autorizada.";
  }

  if (!context.allowedChannelIds.includes(draft.channelId)) {
    return "El canal seleccionado no esta autorizado.";
  }

  return null;
}
