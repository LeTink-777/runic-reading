"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, Wallet, Compass, Zap, Lock, Loader2 } from "lucide-react";
import RuneStone from "@/components/RuneStone";
import RuneEmbers from "@/components/RuneEmbers";
import StonePricing from "@/components/StonePricing";
import { readUserData, topicById } from "@/lib/topics";
import { useUserData } from "@/lib/useUserData";
import {
  drawRunes,
  interpretationFor,
  POSITIONS,
  POSITION_HINTS,
  type Rune,
} from "@/lib/runes";

const TOPIC_ICONS = {
  love: Heart,
  money: Wallet,
  path: Compass,
  question: Zap,
} as const;

/** Splits the overall message so only the opening sentence stays readable. */
function splitFirstSentence(text: string): [string, string] {
  const index = text.indexOf(". ");
  if (index === -1) return [text, ""];
  return [text.slice(0, index + 1), text.slice(index + 2)];
}

export default function ResultPage() {
  const router = useRouter();
  const user = useUserData();
  const reading = useMemo(
    () => (user ? drawRunes(user.name, user.topic) : null),
    [user],
  );

  // Nobody drew any runes in this browser — send them back to the form.
  // localStorage is read directly here so hydration's null snapshot never
  // triggers a redirect on a visitor who does have a saved draw.
  useEffect(() => {
    if (!readUserData()) router.replace("/");
  }, [router]);

  if (!user || !reading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Loader2
          size={26}
          className="animate-spin"
          color="var(--accent-amber)"
          aria-label="Раскладываем руны"
        />
      </main>
    );
  }

  const topic = topicById(user.topic);
  const TopicIcon = TOPIC_ICONS[topic.id];
  const runes: Rune[] = [reading.rune1, reading.rune2, reading.rune3];
  const [firstSentence, restOfMessage] = splitFirstSentence(reading.overallMessage);

  return (
    <main>
      {/* Header */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 65% 60% at 50% 0%, rgba(232, 130, 12, 0.18), transparent 70%)",
          }}
        />
        <RuneEmbers count={14} />

        <div className="shell-narrow relative pt-14 pb-10 text-center md:pt-18">
          <Link
            href="/"
            className="font-display"
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "var(--accent-amber)",
              letterSpacing: "0.14em",
            }}
          >
            РУНЫ
          </Link>

          <h1 className="mt-8" style={{ fontSize: "clamp(27px, 5vw, 42px)" }}>
            {user.name}, твой рунический расклад
          </h1>

          <span
            className="font-display mt-5 inline-flex items-center gap-2"
            style={{
              fontSize: 13,
              letterSpacing: "0.1em",
              padding: "9px 16px",
              borderRadius: 2,
              border: "1px solid var(--border)",
              background: "var(--bg-card)",
              color: "var(--accent-ice)",
            }}
          >
            <TopicIcon size={15} strokeWidth={1.7} />
            {topic.label}
          </span>

          {user.question && (
            <p
              className="mx-auto mt-6 max-w-[50ch]"
              style={{ fontStyle: "italic", color: "var(--text-secondary)" }}
            >
              «{user.question}»
            </p>
          )}
        </div>
      </section>

      <div className="shell-narrow pb-20">
        {/* The three runes */}
        <div className="flex flex-col gap-5">
          {runes.map((rune, i) => {
            const state = i === 0 ? "open" : i === 1 ? "partial" : "locked";

            return (
              <motion.article
                key={rune.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.16 }}
                className="stone-card p-6 md:p-8"
              >
                <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-8">
                  <div className="shrink-0">
                    <RuneStone
                      runeId={state === "locked" ? undefined : rune.id}
                      faceDown={state === "locked"}
                      lit={state === "open"}
                      size={128}
                      label={
                        state === "locked"
                          ? "Скрытая руна"
                          : `Руна ${rune.name}, символ ${rune.symbol}`
                      }
                    />
                  </div>

                  <div className="min-w-0 flex-1 text-center md:text-left">
                    <p className="eyebrow">
                      {POSITIONS[i]} — {POSITION_HINTS[i]}
                    </p>

                    {state === "locked" ? (
                      <>
                        <h2 className="mt-2" style={{ fontSize: 24 }}>
                          Третья руна скрыта
                        </h2>
                        <p className="mt-3" style={{ color: "var(--text-secondary)" }}>
                          Камень лежит рубашкой вверх. Руна будущего откроется вместе с
                          полным раскладом.
                        </p>
                      </>
                    ) : (
                      <>
                        <h2 className="mt-2" style={{ fontSize: 24 }}>
                          {rune.name}
                        </h2>
                        <p
                          className="mt-1"
                          style={{ fontSize: 14, color: "var(--text-muted)" }}
                        >
                          {rune.keywords}
                        </p>

                        {state === "open" ? (
                          <>
                            <p className="mt-4" style={{ color: "var(--text-secondary)" }}>
                              {interpretationFor(rune, topic.id)}
                            </p>
                            <p
                              className="mt-4"
                              style={{
                                fontStyle: "italic",
                                color: "var(--accent-amber-light)",
                              }}
                            >
                              {rune.advice}
                            </p>
                          </>
                        ) : (
                          <div className="relative mt-4">
                            <p className="locked-text" style={{ color: "var(--text-secondary)" }}>
                              {interpretationFor(rune, topic.id)}
                            </p>
                            <p
                              className="locked-text mt-4"
                              style={{ fontStyle: "italic", color: "var(--accent-amber-light)" }}
                            >
                              {rune.advice}
                            </p>
                            <span
                              className="absolute inset-0 flex items-center justify-center"
                              aria-hidden="true"
                            >
                              <Lock size={22} strokeWidth={1.6} color="var(--accent-amber)" />
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Overall message */}
        <div className="stone-card amber-edge mt-6 p-6 md:p-8">
          <p className="eyebrow">Послание рун на твой месяц</p>
          <p className="mt-3" style={{ fontSize: 18, color: "var(--text-primary)" }}>
            {firstSentence}
          </p>
          {restOfMessage && (
            <div className="relative mt-3">
              <p className="locked-text" style={{ fontSize: 18 }}>
                {restOfMessage}
              </p>
              <span
                className="absolute inset-0 flex items-center justify-center"
                aria-hidden="true"
              >
                <Lock size={20} strokeWidth={1.6} color="var(--accent-amber)" />
              </span>
            </div>
          )}
        </div>

        {/* Inline lock notice */}
        <div
          className="mt-6 flex flex-col items-center gap-3 rounded-sm p-6 text-center"
          style={{
            border: "1px solid rgba(232,130,12,0.35)",
            background: "rgba(232,130,12,0.06)",
          }}
        >
          <Lock size={20} strokeWidth={1.7} color="var(--accent-amber)" />
          <h2 style={{ fontSize: 21 }}>Открой полный расклад трёх рун</h2>
          <p className="max-w-[46ch]" style={{ color: "var(--text-secondary)" }}>
            Узнай послание каждой руны и общий прогноз на месяц
          </p>
        </div>

        <StonePricing user={user} />
      </div>
    </main>
  );
}
