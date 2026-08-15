import { NextResponse } from "next/server";
import { generatePDF } from "@/lib/pdf-generator";
import { sendResultEmail } from "@/lib/email";
import {
  buildSubtitle,
  generateResultSections,
  inputFromMetadata,
} from "@/lib/result-sections";
import { clientIp, isYookassaAddress } from "@/lib/webhook-guard";
import { SITE_NAME } from "@/lib/site-name";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface WebhookBody {
  type?: string;
  event?: string;
  object?: {
    id?: string;
    status?: string;
    paid?: boolean;
    amount?: { value?: string; currency?: string };
    metadata?: Record<string, string>;
  };
}

/**
 * YooKassa delivers notifications here. Any non-2xx reply makes YooKassa retry
 * for 24 hours, so unexpected payloads are acknowledged rather than rejected —
 * only genuine processing failures should return an error status.
 */
export async function POST(request: Request) {
  const ip = clientIp(request);

  if (!isYookassaAddress(ip)) {
    console.warn("[webhook] rejected notification from unlisted address", { ip });
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  let body: WebhookBody;
  try {
    body = (await request.json()) as WebhookBody;
  } catch {
    return NextResponse.json({ received: true });
  }

  const event = body.event ?? body.type;
  const payment = body.object;

  switch (event) {
    case "payment.succeeded": {
      console.log("[webhook] payment succeeded", {
        id: payment?.id,
        amount: payment?.amount?.value,
        plan: payment?.metadata?.plan,
        email: payment?.metadata?.email,
        topic: payment?.metadata?.topic,
      });

      await deliverReading(payment?.metadata ?? {}, payment?.id ?? null);
      break;
    }
    case "payment.canceled": {
      console.log("[webhook] payment canceled", { id: payment?.id });
      break;
    }
    case "refund.succeeded": {
      console.log("[webhook] refund succeeded", { id: payment?.id });
      break;
    }
    default: {
      console.log("[webhook] unhandled event", event);
    }
  }

  return NextResponse.json({ received: true });
}

/**
 * Best-effort guard against sending the same reading twice.
 *
 * YooKassa repeats a notification until it gets a 200, and a delivery that
 * succeeded after a slow response would otherwise be re-sent. This lives in
 * the instance's memory, so it only covers retries that land on the same warm
 * lambda — the reliable fix is an order record in a database, which this
 * project does not have yet.
 */
const delivered = new Set<string>();

async function deliverReading(
  metadata: Record<string, string>,
  paymentId: string | null,
): Promise<void> {
  if (paymentId && delivered.has(paymentId)) {
    console.log("[webhook] reading already delivered, skipping", { paymentId });
    return;
  }

  const email = metadata.email;
  const input = inputFromMetadata(metadata);

  if (!email || !input) {
    console.error("[webhook] cannot deliver reading: metadata is incomplete", {
      paymentId,
      hasEmail: Boolean(email),
      hasInput: Boolean(input),
    });
    return;
  }

  try {
    const sections = generateResultSections(input, metadata.plan);

    const pdfBuffer = await generatePDF({
      title: "Твой рунический расклад",
      userName: input.name,
      subtitle: buildSubtitle(input),
      sections,
      siteName: SITE_NAME,
    });

    await sendResultEmail({
      to: email,
      subject: "Твой рунический расклад готов",
      userName: input.name,
      resultHtml: sections
        .map(
          (section) =>
            `<h3 style="color:#E8820C;font-size:17px;margin:24px 0 8px;">${section.title}</h3>` +
            `<p style="font-size:15px;line-height:1.6;margin:0;white-space:pre-line;">${section.content}</p>`,
        )
        .join(""),
      pdfBuffer,
      fileName: "runy.pdf",
      siteName: SITE_NAME,
    });

    if (paymentId) delivered.add(paymentId);

    console.log("[webhook] reading delivered", { paymentId, to: email });
  } catch (error) {
    // Swallowed on purpose: the caller still returns 200. A non-200 makes
    // YooKassa retry for hours, and a failure here is a delivery problem, not
    // a payment problem — the payment is already captured either way.
    console.error("[webhook] reading delivery failed", {
      paymentId,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
