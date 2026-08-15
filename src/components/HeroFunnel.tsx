"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Wallet, Compass, Zap, Shield, Clock, Star, ArrowRight } from "lucide-react";
import RuneStone from "./RuneStone";
import { TOPICS, STORAGE_KEY, TIMER_KEY } from "@/lib/topics";
import { drawRunes, type TopicId } from "@/lib/runes";

const TOPIC_ICONS = {
  love: Heart,
  money: Wallet,
  path: Compass,
  question: Zap,
} as const;

export default function HeroFunnel() {
  const router = useRouter();
  const [topic, setTopic] = useState<TopicId | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [error, setError] = useState("");
  const [drawing, setDrawing] = useState(false);
  const [revealed, setRevealed] = useState(0);
  const formRef = useRef<HTMLDivElement>(null);

  function pickTopic(id: TopicId) {
    setTopic(id);
    window.setTimeout(
      () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }),
      120,
    );
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!topic) return;

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (cleanName.length < 2) {
      setError("Назови своё имя — руны обращаются по имени.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Проверь email — на него придёт расклад.");
      return;
    }

    setError("");
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        name: cleanName,
        email: cleanEmail,
        topic,
        question: question.trim(),
      }),
    );
    if (!window.localStorage.getItem(TIMER_KEY)) {
      window.localStorage.setItem(TIMER_KEY, String(Date.now()));
    }
    setDrawing(true);
  }

  // Reveal the three stones one at a time, then move to the result.
  useEffect(() => {
    if (!drawing) return;
    const timers = [
      window.setTimeout(() => setRevealed(1), 600),
      window.setTimeout(() => setRevealed(2), 1400),
      window.setTimeout(() => setRevealed(3), 2200),
      window.setTimeout(() => router.push("/result"), 3100),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [drawing, router]);

  const drawn = drawing && name.trim() && topic ? drawRunes(name.trim(), topic) : null;
  const drawnIds = drawn ? [drawn.rune1.id, drawn.rune2.id, drawn.rune3.id] : [];

  return (
    <div id="draw" className="relative">
      <h2
        className="font-display text-center"
        style={{ fontSize: "clamp(21px, 3.4vw, 28px)" }}
      >
        Для какой сферы тянуть руны?
      </h2>

      <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {TOPICS.map((t) => {
          const Icon = TOPIC_ICONS[t.id];
          const active = topic === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => pickTopic(t.id)}
              aria-pressed={active}
              className="stone-card flex min-h-[132px] cursor-pointer flex-col items-center justify-center gap-3 px-3 py-5 text-center md:min-h-[152px]"
              style={{
                borderColor: active ? "var(--accent-amber)" : undefined,
                boxShadow: active ? "var(--glow-amber)" : undefined,
              }}
            >
              <Icon
                size={26}
                strokeWidth={1.5}
                color={active ? "var(--accent-amber-light)" : "var(--accent-ice)"}
              />
              <span
                className="font-display leading-snug"
                style={{
                  fontSize: 14,
                  color: active ? "var(--accent-amber-light)" : "var(--text-primary)",
                }}
              >
                {t.label}
              </span>
              <span style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{t.hint}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence initial={false}>
        {topic && (
          <motion.div
            ref={formRef}
            key="form"
            initial={{ opacity: 0, y: 22, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 12, height: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 0.9, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <form onSubmit={handleSubmit} className="stone-card mt-6 p-6 md:p-8">
              <p className="eyebrow">Расклад на тему</p>
              <p
                className="font-display mt-1 mb-6"
                style={{ fontSize: 19, color: "var(--accent-amber-light)" }}
              >
                {TOPICS.find((t) => t.id === topic)?.label}
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="field-label" htmlFor="name">
                    Имя
                  </label>
                  <input
                    id="name"
                    className="field"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Как к тебе обращаться"
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="field"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="field-label" htmlFor="question">
                  Твой вопрос рунам
                  <span style={{ textTransform: "none", letterSpacing: 0, opacity: 0.6 }}>
                    {" "}
                    — необязательно
                  </span>
                </label>
                <textarea
                  id="question"
                  className="field"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="О чём ты хочешь спросить в этом месяце"
                  maxLength={400}
                />
              </div>

              {error && (
                <p className="mt-4" style={{ color: "var(--accent-amber-light)", fontSize: 15 }}>
                  {error}
                </p>
              )}

              <button type="submit" className="btn-amber pulse-amber mt-6 w-full">
                Вытянуть руны
                <ArrowRight size={18} strokeWidth={2.2} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Kept outside the form so the trust row is visible before a topic is picked. */}
      <div
        className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
        style={{ fontSize: 13, color: "var(--text-muted)" }}
      >
        <span className="flex items-center gap-1.5">
          <Shield size={14} strokeWidth={1.6} /> Бесплатный расклад
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={14} strokeWidth={1.6} /> Результат мгновенно
        </span>
        <span className="flex items-center gap-1.5">
          <Star size={14} strokeWidth={1.6} /> 29 840 раскладов выполнено
        </span>
      </div>

      {/* Draw ritual overlay */}
      <AnimatePresence>
        {drawing && (
          <motion.div
            key="ritual"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center px-5"
            style={{ background: "rgba(10, 12, 16, 0.96)" }}
          >
            <p className="eyebrow mb-8">Руны падают на полотно</p>
            <div className="flex items-center justify-center gap-4 md:gap-7">
              {[0, 1, 2].map((i) => {
                const open = revealed > i;
                return (
                  <motion.div
                    key={i}
                    animate={
                      open
                        ? { rotateY: 0, scale: [1, 1.12, 1] }
                        : { rotateY: 180, scale: 1 }
                    }
                    transition={{ duration: 0.55, ease: "easeOut" }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <RuneStone
                      runeId={drawnIds[i]}
                      faceDown={!open}
                      lit={open}
                      size={92}
                    />
                  </motion.div>
                );
              })}
            </div>
            <p
              className="font-display mt-9 text-center"
              style={{ fontSize: 17, color: "var(--text-secondary)" }}
            >
              {revealed === 0 && "Полотно расстелено"}
              {revealed === 1 && "Первая руна — прошлое"}
              {revealed === 2 && "Вторая руна — настоящее"}
              {revealed >= 3 && "Третья руна — будущее"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
