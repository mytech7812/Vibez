"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { Button } from "./Button";

export function CheckoutForm({
  queryString,
  total,
}: {
  queryString: string;
  total: string;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const params = new URLSearchParams(queryString);
    params.set("name", String(form.get("fullName") || ""));
    params.set("email", String(form.get("email") || ""));

    // Simulated processing delay — payment integration hooks in here later.
    setTimeout(() => {
      router.push(`/checkout/confirmation?${params.toString()}`);
    }, 300);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl text-ink">Your details</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Tickets and your receipt will be sent to this email.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Field label="Full name" name="fullName" placeholder="e.g. Amaka Johnson" required />
        <Field
          label="Email address"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
        />
        <Field
          label="Phone number"
          name="phone"
          type="tel"
          placeholder="080X XXX XXXX"
          required
        />
      </div>

      <div className="flex flex-col gap-3 border-t border-surface-line pt-6">
        <h3 className="text-sm font-medium text-ink">Payment</h3>
        <div className="rounded-card border border-dashed border-surface-line bg-surface-raised/40 p-4 text-sm text-ink-muted">
          Payment processing will be added at checkout. No charge is made in
          this preview — continuing will simulate a completed order.
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={submitting}
        className="w-full"
      >
        <Lock size={15} />
        {submitting ? "Processing…" : `Pay ${total}`}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-medium text-ink-muted">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="rounded-sm border border-surface-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-signal"
      />
    </label>
  );
}
