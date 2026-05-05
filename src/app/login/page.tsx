import { Suspense } from "react";

import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main
      className="flex min-h-screen items-center justify-center px-4 py-10"
      style={{
        background: `radial-gradient(ellipse at 50% 20%, var(--bg-surface-alt), var(--bg-base))`,
        color: "var(--text-primary)",
      }}
    >
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
