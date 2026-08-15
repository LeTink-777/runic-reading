import { NextResponse } from "next/server";
import { createPayment } from "@/lib/yukassa";
import { PLANS, type PlanId } from "@/lib/plans";
import { resolveReturnOrigin } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface CheckoutBody {
  plan?: string;
  userData?: {
    name?: string;
    email?: string;
    topic?: string;
  };
}

function isPlanId(value: unknown): value is PlanId {
  return value === "basic" || value === "full" || value === "premium";
}

export async function POST(request: Request) {
  let body: CheckoutBody;
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  if (!isPlanId(body.plan)) {
    return NextResponse.json({ error: "Неизвестный тариф" }, { status: 400 });
  }

  const plan = PLANS[body.plan];
  const name = body.userData?.name?.trim() ?? "";
  const email = body.userData?.email?.trim() ?? "";
  const topic = body.userData?.topic ?? "path";

  if (!name || !email) {
    return NextResponse.json({ error: "Не хватает имени или email" }, { status: 400 });
  }

  try {
    const payment = await createPayment({
      amount: plan.price,
      description: plan.description,
      returnUrl: `${resolveReturnOrigin(request)}/thank-you?plan=${plan.id}`,
      metadata: { plan: plan.id, name, email, topic },
    });

    return NextResponse.json({
      confirmationUrl: payment.confirmationUrl,
      paymentId: payment.id,
    });
  } catch (error) {
    console.error("[checkout] payment creation failed", error);
    return NextResponse.json(
      { error: "Не удалось создать платёж. Попробуй ещё раз." },
      { status: 502 },
    );
  }
}
