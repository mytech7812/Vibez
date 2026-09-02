"use client";

import { FormEvent, useState } from "react";
import { Lock } from "lucide-react";
import { Button } from "./Button";

export function CheckoutForm({
  total,
  tierQuantities,
}: {
  total: string;
  tierQuantities: Record<string, number>;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const name = String(form.get("fullName") || "");
    const email = String(form.get("email") || "");
    const phone = String(form.get("phone") || "");

    try {
      const response = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          phone,
          tierQuantities,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Payment initialization failed");
      }

      // Redirect to Paystack
      window.location.href = data.authorization_url;
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setSubmitting(false);
    }
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

      {error && (
        <div className="rounded-md bg-red-500/10 border border-red-500 p-3 text-sm text-red-500">
          {error}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={submitting}
        className="w-full"
      >
        <Lock size={15} />
        {submitting ? "Processing..." : `Pay ${total}`}
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
