"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Shield, RotateCcw, Star, Clock, Loader2 } from "lucide-react";
import RuneGlyph from "./RuneGlyph";
import { PLANS, formatPrice, type PlanId } from "@/lib/plans";
import { useCountdown, useSpots } from "@/lib/useFunnelState";
import type { UserData } from "@/lib/topics";
import { topicById } from "@/lib/topics";

interface StoneSlot {
  key: string;
  plan: PlanId | null;
  rune: string;
  /** Vertical offset in px that shapes the arc. */
  lift: number;
  tilt: number;
}

const SLOTS: StoneSlot[] = [
  { key: "s1", plan: "basic", rune: "fehu", lift: 26, tilt: -10 },
  { key: "s2", plan: "full", rune: "sowilo", lift: 6, tilt: -5 },
  { key: "s3", plan: "premium", rune: "dagaz", lift: 0, tilt: 0 },
  { key: "s4", plan: null, rune: "algiz", lift: 6, tilt: 5 },
  { key: "s5", plan: null, rune: "othala", lift: 26, tilt: 10 },
];

export default function StonePricing({ user }: { user: UserData }) {
  const [flipped, setFlipped] = useState<Record<string, boolean>>({ s2: true });
  const [selected, setSelected] = useState<PlanId>("full");
  const [loading, setLoading] = useState<PlanId | null>(null);
  const [error, setError] = useState("");

  const countdown = useCountdown();
  const spots = useSpots();
  const topic = topicById(user.topic);

  function handleStone(slot: StoneSlot) {
    setFlipped((prev) => ({ ...prev, [slot.key]: true }));
    if (slot.plan) setSelected(slot.plan);
  }

  async function checkout(plan: PlanId) {
    setLoading(plan);
    setError("");
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          userData: { name: user.name, email: user.email, topic: user.topic },
        }),
      });
      const data = (await response.json()) as {
        confirmationUrl?: string;
        error?: string;
      };
      if (!response.ok || !data.confirmationUrl) {
        throw new Error(data.error ?? "Не удалось создать платёж");
      }
      window.location.href = data.confirmationUrl;
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Оплата временно недоступна, попробуй ещё раз",
      );
      setLoading(null);
    }
  }

  const plan = PLANS[selected];

  return (
    <section className="mt-14">
      <div className="text-center">
        <p className="eyebrow">Выбор пути</p>
        <h2 className="mt-2" style={{ fontSize: "clamp(23px, 4vw, 32px)" }}>
          Выбери свой путь — переверни камень
        </h2>
        <p className="mx-auto mt-3 max-w-[46ch]" style={{ color: "var(--text-secondary)" }}>
          Пять камней лежат рубашкой вверх. Три из них хранят расклад, два — просто руны.
        </p>
      </div>

      {/* Arc of stones */}
      <div className="no-scrollbar mt-10 overflow-x-auto pb-2">
        <div
          className="mx-auto flex min-w-max items-end justify-center gap-3 px-2 md:gap-5"
          style={{ paddingTop: 34 }}
        >
          {SLOTS.map((slot) => {
            const isFlipped = Boolean(flipped[slot.key]);
            const isActive = slot.plan !== null && selected === slot.plan;
            const slotPlan = slot.plan ? PLANS[slot.plan] : null;

            return (
              <button
                key={slot.key}
                type="button"
                onClick={() => handleStone(slot)}
                aria-label={
                  slotPlan ? `Открыть тариф ${slotPlan.title}` : "Перевернуть камень"
                }
                className="flip-scene shrink-0 cursor-pointer bg-transparent p-0"
                style={{
                  width: 104,
                  height: 104,
                  marginBottom: slot.lift,
                  transform: `rotate(${slot.tilt}deg)`,
                }}
              >
                <div className={`flip-inner ${isFlipped ? "is-flipped" : ""}`}>
                  {/* Back of the stone */}
                  <div className="flip-face">
                    <div
                      className="rune-stone is-back h-full w-full"
                      style={
                        isActive
                          ? { boxShadow: "0 0 26px rgba(232,130,12,0.45)" }
                          : undefined
                      }
                    >
                      <span
                        className="font-display"
                        style={{ fontSize: 30, color: "var(--accent-amber)", opacity: 0.8 }}
                      >
                        ?
                      </span>
                    </div>
                  </div>

                  {/* Face of the stone */}
                  <div className="flip-face flip-face-back">
                    <div
                      className={`rune-stone h-full w-full ${isActive ? "is-lit" : ""}`}
                      style={{ flexDirection: "column", gap: 2 }}
                    >
                      {slotPlan ? (
                        <>
                          <RuneGlyph
                            id={slot.rune}
                            size={32}
                            color="var(--accent-amber-light)"
                            strokeWidth={1.2}
                          />
                          <span
                            className="font-display px-2 text-center leading-tight"
                            style={{ fontSize: 10.5, color: "var(--text-primary)" }}
                          >
                            {slotPlan.title}
                          </span>
                        </>
                      ) : (
                        <RuneGlyph
                          id={slot.rune}
                          size={44}
                          color="var(--accent-ice)"
                          strokeWidth={1.2}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Plan detail */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.34, ease: [0.22, 0.9, 0.3, 1] }}
          className="mt-8"
        >
          <div
            className="stone-card p-6 md:p-8"
            style={
              selected === "full"
                ? {
                    borderColor: "rgba(232,130,12,0.5)",
                    boxShadow: "0 0 34px rgba(232,130,12,0.22), 0 12px 32px rgba(0,0,0,0.4)",
                  }
                : undefined
            }
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 style={{ fontSize: "clamp(21px, 3vw, 26px)" }}>{plan.title}</h3>
                <div className="mt-2 flex items-baseline gap-3">
                  <span
                    className="font-display"
                    style={{ fontSize: 32, color: "var(--accent-amber-light)", fontWeight: 700 }}
                  >
                    {formatPrice(plan.price)} ₽
                  </span>
                  <span
                    style={{
                      fontSize: 17,
                      color: "var(--text-muted)",
                      textDecoration: "line-through",
                    }}
                  >
                    {formatPrice(plan.oldPrice)} ₽
                  </span>
                </div>
              </div>

              {plan.badge && (
                <span
                  className="font-display"
                  style={{
                    fontSize: 11.5,
                    letterSpacing: "0.12em",
                    padding: "7px 12px",
                    borderRadius: 2,
                    border: "1px solid rgba(232,130,12,0.45)",
                    color: "var(--accent-amber-light)",
                    background: "rgba(232,130,12,0.08)",
                  }}
                >
                  {plan.badge}
                </span>
              )}
            </div>

            <ul className="mt-6 flex flex-col gap-2.5">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5">
                  <Check
                    size={17}
                    strokeWidth={2}
                    color="var(--accent-ice)"
                    style={{ marginTop: 4, flexShrink: 0 }}
                  />
                  <span style={{ color: "var(--text-secondary)" }}>
                    {feature === "Детальный анализ по выбранной теме"
                      ? `Тема: ${topic.label} — детальный анализ`
                      : feature}
                  </span>
                </li>
              ))}
            </ul>

            {selected === "full" && countdown && (
              <p
                className="mt-6 flex items-center gap-2"
                style={{ fontSize: 14, color: "var(--accent-amber)" }}
              >
                <Clock size={15} strokeWidth={1.8} />
                Цена вырастет через {countdown}
              </p>
            )}

            {selected === "premium" && spots !== null && (
              <p
                className="mt-6 flex items-center gap-2"
                style={{ fontSize: 14, color: "var(--accent-amber)" }}
              >
                <Star size={15} strokeWidth={1.8} />
                Осталось {spots} мест
              </p>
            )}

            <button
              type="button"
              onClick={() => checkout(selected)}
              disabled={loading !== null}
              className={`btn-amber mt-7 w-full ${selected === "full" ? "pulse-amber" : ""}`}
            >
              {loading === selected ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Открываем оплату
                </>
              ) : (
                `Получить за ${formatPrice(plan.price)} ₽`
              )}
            </button>

            {error && (
              <p
                className="mt-4 text-center"
                style={{ color: "var(--accent-amber-light)", fontSize: 15 }}
              >
                {error}
              </p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <div
        className="mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-3"
        style={{ fontSize: 13.5, color: "var(--text-muted)" }}
      >
        <span className="flex items-center gap-2">
          <Shield size={16} strokeWidth={1.6} /> Оплата ЮKassa — все методы
        </span>
        <span className="flex items-center gap-2">
          <RotateCcw size={16} strokeWidth={1.6} /> Возврат за 3 дня
        </span>
        <span className="flex items-center gap-2">
          <Star size={16} strokeWidth={1.6} /> 29 840 раскладов выполнено
        </span>
      </div>
    </section>
  );
}
