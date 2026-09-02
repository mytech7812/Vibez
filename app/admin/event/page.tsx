"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { AdminCard } from "@/components/admin/AdminCard";
import { getSupabase } from "@/lib/supabase";

interface EventData {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  doors_open: string;
  venue_name: string;
  venue_address: string;
  city: string;
  description: string;
  lineup: string[];
}

export default function AdminEventPage() {
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<EventData | null>(null);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    date: "",
    doors_open: "",
    venue_name: "",
    venue_address: "",
    city: "",
    description: "",
    lineup: "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function fetchEvent() {
      const supabase = getSupabase();
      const { data } = await supabase
        .from('events')
        .select('*')
        .single();

      if (data) {
        setEvent(data);
        setForm({
          title: data.title || "",
          subtitle: data.subtitle || "",
          date: data.date ? data.date.slice(0, 10) : "",
          doors_open: data.doors_open || "",
          venue_name: data.venue_name || "",
          venue_address: data.venue_address || "",
          city: data.city || "",
          description: data.description || "",
          lineup: data.lineup ? data.lineup.join(", ") : "",
        });
      }
      setLoading(false);
    }

    fetchEvent();
  }, []);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    if (!event) return;

    const supabase = getSupabase();

    const updatedData = {
      title: form.title,
      subtitle: form.subtitle,
      date: new Date(form.date).toISOString(),
      doors_open: form.doors_open,
      venue_name: form.venue_name,
      venue_address: form.venue_address,
      city: form.city,
      description: form.description,
      lineup: form.lineup.split(",").map((s) => s.trim()).filter(Boolean),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('events')
      .update(updatedData)
      .eq('id', event.id);

    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      alert('Error saving event: ' + error.message);
    }
  }

  if (loading) {
    return <div className="text-center py-20 text-[var(--a-ink-muted)]">Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl text-[var(--a-ink)]">Event</h1>
        <p className="mt-1 text-sm text-[var(--a-ink-muted)]">
          Update the details shown on the public event page.
        </p>
      </div>

      <AdminCard>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field
            label="Event title"
            value={form.title}
            onChange={(v) => update("title", v)}
          />
          <Field
            label="Subtitle"
            value={form.subtitle}
            onChange={(v) => update("subtitle", v)}
          />
          <Field
            label="Date"
            type="date"
            value={form.date}
            onChange={(v) => update("date", v)}
          />
          <Field
            label="Doors open"
            value={form.doors_open}
            onChange={(v) => update("doors_open", v)}
          />
          <Field
            label="Venue name"
            value={form.venue_name}
            onChange={(v) => update("venue_name", v)}
          />
          <Field
            label="City"
            value={form.city}
            onChange={(v) => update("city", v)}
          />
          <Field
            label="Venue address"
            value={form.venue_address}
            onChange={(v) => update("venue_address", v)}
            full
          />
          <Field
            label="Lineup (comma separated)"
            value={form.lineup}
            onChange={(v) => update("lineup", v)}
            full
          />
          <label className="flex flex-col gap-2 sm:col-span-2">
            <span className="text-xs font-medium text-[var(--a-ink-muted)]">
              Description
            </span>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={4}
              className="rounded-md border border-[var(--a-line)] bg-[var(--a-surface-raised)] px-3 py-2.5 text-sm leading-relaxed text-[var(--a-ink)] focus:border-signal"
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end border-t border-[var(--a-line)] pt-5">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 rounded-md bg-signal px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-signal-dim"
          >
            {saved ? (
              <>
                <Check size={14} /> Saved
              </>
            ) : (
              "Save changes"
            )}
          </button>
        </div>
      </AdminCard>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  full = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  full?: boolean;
}) {
  return (
    <label className={`flex flex-col gap-2 ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-xs font-medium text-[var(--a-ink-muted)]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-[var(--a-line)] bg-[var(--a-surface-raised)] px-3 py-2.5 text-sm text-[var(--a-ink)] focus:border-signal"
      />
    </label>
  );
}
