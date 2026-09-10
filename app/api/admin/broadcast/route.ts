import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { Resend } from "resend";
import BroadcastEmail from "@/lib/email/BroadcastEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { recipients, subject, message } = await request.json();

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json(
        { error: "No recipients provided" },
        { status: 400 }
      );
    }

    if (!subject || !message) {
      return NextResponse.json(
        { error: "Subject and message are required" },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    const { data: users, error } = await supabaseAdmin
      .from('orders')
      .select('buyer_name, buyer_email')
      .eq('payment_status', 'paid')
      .in('buyer_email', recipients);

    if (error || !users) {
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: 500 }
      );
    }

    const uniqueUsers = Array.from(
      new Map(users.map(u => [u.buyer_email, u])).values()
    );

    let successCount = 0;
    let failedCount = 0;

    for (const user of uniqueUsers) {
      try {
        await resend.emails.send({
          from: `Vibe District <tickets@vibingdistrict.com>`,
          to: [user.buyer_email],
          subject: subject,
          react: BroadcastEmail({
            buyerName: user.buyer_name || "Attendee",
            subject: subject,
            message: message,
          }),
        });
        successCount++;
      } catch (err) {
        failedCount++;
        console.error(`Failed to send to ${user.buyer_email}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      successCount,
      failedCount,
    });
  } catch (error) {
    console.error("Broadcast error:", error);
    return NextResponse.json(
      { error: "Failed to send broadcast" },
      { status: 500 }
    );
  }
}