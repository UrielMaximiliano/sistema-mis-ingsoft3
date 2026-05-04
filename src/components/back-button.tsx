"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { roleHome } from "@/lib/auth";
import type { UserRole } from "@/lib/supabase/types";

type BackButtonProps = {
  role: UserRole;
};

export function BackButton({ role }: BackButtonProps) {
  const router = useRouter();

  function goBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(roleHome[role]);
  }

  return (
    <Button onClick={goBack} type="button" variant="outline">
      <ArrowLeft className="size-4" />
      Volver
    </Button>
  );
}
