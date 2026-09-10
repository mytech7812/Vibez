"use client";

import { useState, useEffect } from "react";
import { getSupabase } from "@/lib/supabase";
import { AdminCard } from "@/components/admin/AdminCard";
import { Send, Users, Mail, CheckCircle, AlertCircle } from "lucide-react";

interface PaidUser {
  id: string;
  buyer_name: string;
  buyer_email: string;
  order_reference: string;
}

export default function BroadcastPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [recipientType, setRecipientType] = useState<"all" | "manual">("all");
  const [manualEmails, setManualEmails] = useState("");
  const [paidUsers, setPaidUsers] = useState<PaidUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ success: number; failed: number } | null>(null);

  useEffect(() => {
    fetchPaidUsers();
  }, []);

  async function fetchPaidUsers() {
    setLoading(true);
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from('orders')
      .select('id, buyer_name, buyer_email, order_reference')
      .eq('payment_status', 'paid')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPaidUsers(data);
    }
    setLoading(false);
  }

  const getRecipients = () => {
    if (recipientType === "all") {
      return paidUsers;
    } else {
      const emails = manualEmails.split(",").map(e => e.trim().toLowerCase()).filter(Boolean);
      return paidUsers.filter(user => emails.includes(user.buyer_email.toLowerCase()));
    }
  };

  const getRecipientEmails = () => {
    if (recipientType === "all") {
      return paidUsers.map(u => u.buyer_email);
    } else {
      return manualEmails.split(",").map(e => e.trim().toLowerCase()).filter(Boolean);
    }
  };

  const getRecipientCount = () => {
    if (recipientType === "all") {
      return paidUsers.length;
    } else {
      return manualEmails.split(",").filter(e => e.trim()).length;
    }
  };

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      alert("Please enter both a subject and message.");
      return;
    }

    const recipients = getRecipientEmails();
    if (recipients.length === 0) {
      alert("No recipients found.");
      return;
    }

    const confirmMessage = `This will send to ${recipients.length} recipient(s). Continue?`;
    if (!confirm(confirmMessage)) return;

    setSending(true);
    setResult(null);

    try {
      const response = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients,
          subject,
          message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        setSubject("");
        setMessage("");
      } else {
        alert("Failed to send: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      alert("Failed to send emails.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl text-[var(--a-ink)]">📧 Broadcast Email</h1>
        <p className="mt-1 text-sm text-[var(--a-ink-muted)]">
          Send updates, venue details, or announcements to paid attendees.
        </p>
      </div>

      <AdminCard title="Compose Message">
        <div className="flex flex-col gap-5">
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-[var(--a-ink-muted)] mb-1">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Important: Venue Details for Afterglow"
              className="w-full rounded-md border border-[var(--a-line)] bg-[var(--a-surface-raised)] px-4 py-2.5 text-sm text-[var(--a-ink)] focus:border-signal"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-[var(--a-ink-muted)] mb-1">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
              placeholder="Write your message here..."
              className="w-full rounded-md border border-[var(--a-line)] bg-[var(--a-surface-raised)] px-4 py-2.5 text-sm text-[var(--a-ink)] focus:border-signal"
            />
          </div>

          {/* Recipients */}
          <div>
            <label className="block text-sm font-medium text-[var(--a-ink-muted)] mb-2">
              Recipients
            </label>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setRecipientType("all")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  recipientType === "all"
                    ? "bg-signal text-white"
                    : "bg-[var(--a-surface-raised)] text-[var(--a-ink-muted)] border border-[var(--a-line)]"
                }`}
              >
                <Users size={16} className="inline mr-1.5" />
                All Paid Users ({paidUsers.length})
              </button>
              <button
                onClick={() => setRecipientType("manual")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  recipientType === "manual"
                    ? "bg-signal text-white"
                    : "bg-[var(--a-surface-raised)] text-[var(--a-ink-muted)] border border-[var(--a-line)]"
                }`}
              >
                <Mail size={16} className="inline mr-1.5" />
                Manual Emails
              </button>
            </div>

            {recipientType === "manual" && (
              <div className="mt-3">
                <input
                  type="text"
                  value={manualEmails}
                  onChange={(e) => setManualEmails(e.target.value)}
                  placeholder="Enter emails separated by commas"
                  className="w-full rounded-md border border-[var(--a-line)] bg-[var(--a-surface-raised)] px-4 py-2.5 text-sm text-[var(--a-ink)] focus:border-signal"
                />
                <p className="text-xs text-[var(--a-ink-faint)] mt-1">
                  Enter emails separated by commas. Only paid users will receive the email.
                </p>
              </div>
            )}

            <div className="mt-2 text-sm text-[var(--a-ink-muted)]">
              {loading ? "Loading recipients..." : `Sending to: ${getRecipientCount()} recipient(s)`}
            </div>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={sending || getRecipientCount() === 0}
            className="w-full sm:w-auto bg-signal text-white px-6 py-3 rounded-md font-medium hover:bg-signal-dim transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <>
                <span className="inline-block animate-spin mr-2">⏳</span>
                Sending...
              </>
            ) : (
              <>
                <Send size={18} className="inline mr-2" />
                Send Broadcast
              </>
            )}
          </button>

          {/* Result */}
          {result && (
            <div className="p-4 rounded-md bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-emerald-500 font-medium">
                <CheckCircle size={18} className="inline mr-2" />
                Sent successfully!
              </p>
              <p className="text-sm text-[var(--a-ink-muted)] mt-1">
                {result.success} delivered, {result.failed} failed.
              </p>
            </div>
          )}
        </div>
      </AdminCard>
    </div>
  );
}