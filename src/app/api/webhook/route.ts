import { NextResponse } from "next/server";

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
      // Reading delivery is fulfilled manually from these details.
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
