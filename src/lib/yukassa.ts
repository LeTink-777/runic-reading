import { randomUUID } from "node:crypto";

const API_URL = "https://api.yookassa.ru/v3/payments";

export interface CreatePaymentInput {
  amount: number;
  description: string;
  returnUrl: string;
  metadata?: Record<string, string>;
}

export interface CreatePaymentResult {
  id: string;
  status: string;
  confirmationUrl: string;
}

interface YooKassaPayment {
  id: string;
  status: string;
  confirmation?: { confirmation_url?: string };
}

function credentials(): { shopId: string; secretKey: string } {
  const shopId = process.env.NEXT_PUBLIC_YUKASSA_SHOP_ID;
  const secretKey = process.env.YUKASSA_SECRET_KEY;

  if (!shopId || !secretKey) {
    throw new Error(
      "YooKassa credentials are missing: set NEXT_PUBLIC_YUKASSA_SHOP_ID and YUKASSA_SECRET_KEY",
    );
  }
  return { shopId, secretKey };
}

/**
 * Creates a redirect payment.
 *
 * No payment_method_data is sent on purpose — omitting it makes YooKassa render
 * every method enabled for the shop (bank card, SberPay, СБП, T-Pay, ЮMoney)
 * on the hosted confirmation page. Pinning payment_method_type would collapse
 * the page to a single method.
 */
export async function createPayment({
  amount,
  description,
  returnUrl,
  metadata,
}: CreatePaymentInput): Promise<CreatePaymentResult> {
  const { shopId, secretKey } = credentials();
  const auth = Buffer.from(`${shopId}:${secretKey}`).toString("base64");

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Idempotence-Key": randomUUID(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: { value: amount.toFixed(2), currency: "RUB" },
      capture: true,
      confirmation: { type: "redirect", return_url: returnUrl },
      description,
      metadata,
    }),
    cache: "no-store",
  });

  const payload = (await response.json()) as YooKassaPayment & {
    description?: string;
    code?: string;
  };

  if (!response.ok) {
    throw new Error(
      `YooKassa responded ${response.status}: ${payload.code ?? "unknown"} ${
        payload.description ?? ""
      }`.trim(),
    );
  }

  const confirmationUrl = payload.confirmation?.confirmation_url;
  if (!confirmationUrl) {
    throw new Error("YooKassa did not return a confirmation URL");
  }

  return { id: payload.id, status: payload.status, confirmationUrl };
}
