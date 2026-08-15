"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Zap, ArrowRight } from "lucide-react";
import RuneStone from "@/components/RuneStone";
import RuneEmbers from "@/components/RuneEmbers";
import { useUserData } from "@/lib/useUserData";
import { PLANS, type PlanId } from "@/lib/plans";
import { drawRunes } from "@/lib/runes";

const FALLBACK_RUNES = ["fehu", "sowilo", "dagaz"];

function ThankYouContent() {
  const params = useSearchParams();
  const user = useUserData();

  const name = user?.name ?? "";
  const email = user?.email ?? "";
  const runeIds = useMemo(() => {
    if (!user) return FALLBACK_RUNES;
    const reading = drawRunes(user.name, user.topic);
    return [reading.rune1.id, reading.rune2.id, reading.rune3.id];
  }, [user]);

  const planParam = params.get("plan");
  const plan: PlanId =
    planParam === "basic" || planParam === "premium" || planParam === "full"
      ? planParam
      : "full";
  const hours = PLANS[plan].delivery;

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 38%, rgba(232, 130, 12, 0.17), transparent 70%)",
        }}
      />
      <RuneEmbers count={12} />

      <div className="relative w-full max-w-[620px] text-center">
        <div className="flex items-center justify-center gap-4">
          {runeIds.map((id, i) => (
            <motion.div
              key={id + i}
              initial={{ opacity: 0, y: 26, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: i * 0.18, ease: "easeOut" }}
            >
              <RuneStone runeId={id} lit size={88} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="mt-10 flex justify-center"
        >
          <CheckCircle size={56} strokeWidth={1.3} color="var(--accent-amber)" />
        </motion.div>

        <h1 className="mt-6" style={{ fontSize: "clamp(24px, 4.4vw, 28px)" }}>
          {name ? `${name}, руны услышали тебя` : "Руны услышали тебя"}
        </h1>

        <p className="mx-auto mt-4 max-w-[44ch]" style={{ color: "var(--text-secondary)" }}>
          Расклад уже готовится и придёт на{" "}
          <span style={{ color: "var(--accent-ice)" }}>{email || "твой email"}</span> через{" "}
          {hours} часов
        </p>

        {/* Upsell */}
        <div
          className="mt-12 rounded-sm p-6 text-left md:p-8"
          style={{
            border: "1px solid rgba(232,130,12,0.4)",
            background: "rgba(232,130,12,0.05)",
          }}
        >
          <Zap size={20} strokeWidth={1.7} color="var(--accent-amber)" />
          <h2 className="mt-3" style={{ fontSize: 20 }}>
            Хочешь расклад на следующий месяц тоже?
          </h2>
          <p className="mt-3" style={{ color: "var(--text-secondary)" }}>
            Подписка на ежемесячный рунический расклад — 390 ₽/месяц
          </p>
          <a
            href="https://t.me/dvdkmv"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-amber mt-6 w-full"
          >
            Подписаться
            <ArrowRight size={18} strokeWidth={2.2} />
          </a>
        </div>

        <Link
          href="/"
          className="font-display mt-10 inline-block"
          style={{ fontSize: 13, letterSpacing: "0.1em", color: "var(--text-muted)" }}
        >
          НА ГЛАВНУЮ
        </Link>
      </div>
    </main>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<main className="min-h-screen" />}>
      <ThankYouContent />
    </Suspense>
  );
}
