import Link from "next/link";
import { Circle, Minus, ArrowRight } from "lucide-react";
import RuneEmbers from "@/components/RuneEmbers";
import HeroStones from "@/components/HeroStones";
import HeroFunnel from "@/components/HeroFunnel";
import { FAQ } from "@/lib/faq";

const QUOTES = [
  {
    text: "Расклад на деньги оказался точнее чем я ожидала. Через 2 недели всё сбылось.",
    author: "Ольга, 33 года",
  },
  {
    text: "Руны предупредили меня об уходе из отношений. Я послушала — не пожалела.",
    author: "Диана, 27 лет",
  },
  {
    text: "Общий расклад на месяц стал моим навигатором. Беру каждый месяц.",
    author: "Сергей, 41 год",
  },
];

const POSITION_CARDS = [
  {
    Icon: Circle,
    title: "Прошлое",
    text: "что привело тебя сюда",
    body: "Первая руна показывает корень ситуации — решение или событие, с которого всё началось.",
  },
  {
    Icon: Minus,
    title: "Настоящее",
    text: "где ты находишься сейчас",
    body: "Вторая руна описывает текущую расстановку сил и то, что держит тебя в этой точке.",
  },
  {
    Icon: ArrowRight,
    title: "Будущее",
    text: "что тебя ждёт",
    body: "Третья руна раскрывает тенденцию ближайших тридцати дней и её главный поворот.",
  },
];

export default function Home() {
  return (
    <main>
      {/* Top bar */}
      <header
        style={{
          borderBottom: "1px solid var(--border)",
          background: "rgba(17, 19, 24, 0.85)",
          backdropFilter: "blur(8px)",
          position: "sticky",
          top: 0,
          zIndex: 30,
        }}
      >
        <div className="shell flex items-center justify-between py-4">
          <div className="flex items-baseline gap-3">
            <span
              className="font-display"
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "var(--accent-amber)",
                letterSpacing: "0.14em",
              }}
            >
              РУНЫ
            </span>
            <span
              className="hidden sm:inline"
              style={{ fontSize: 14, color: "var(--text-muted)" }}
            >
              Рунический расклад
            </span>
          </div>
          <Link
            href="#draw"
            className="font-display"
            style={{ fontSize: 13, letterSpacing: "0.1em", color: "var(--accent-ice)" }}
          >
            ВЫТЯНУТЬ РУНЫ
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 32%, rgba(232, 130, 12, 0.16), transparent 70%)",
          }}
        />
        <RuneEmbers />

        <div className="shell relative pt-16 pb-14 md:pt-24 md:pb-20">
          <h1
            className="mx-auto max-w-[15ch] text-center"
            style={{ fontSize: "clamp(34px, 6vw, 60px)", color: "var(--text-primary)" }}
          >
            Руны открывают что ждёт тебя в ближайший месяц
          </h1>

          <p
            className="mx-auto mt-6 max-w-[54ch] text-center"
            style={{ fontSize: 18, color: "var(--text-secondary)" }}
          >
            Вытяни три руны — и получи расклад на любовь, деньги и путь на следующие
            30 дней
          </p>

          <div className="mt-12 mb-14">
            <HeroStones />
          </div>

          <div className="shell-narrow" style={{ padding: 0 }}>
            <HeroFunnel />
          </div>
        </div>
      </section>

      {/* Section 1 — what a runic reading is */}
      <section style={{ background: "var(--bg-secondary)" }} className="py-16 md:py-20">
        <div className="shell-narrow">
          <p className="eyebrow">Основа</p>
          <h2 className="mt-2" style={{ fontSize: "clamp(24px, 4vw, 34px)" }}>
            Что такое рунический расклад
          </h2>

          <div className="stone-card amber-edge mt-7 p-6 md:p-9">
            <p style={{ color: "var(--text-secondary)" }}>
              Elder Futhark — старейший рунический ряд из 24 знаков, которым германские
              народы пользовались с I по VIII век. Каждая руна была одновременно буквой,
              звуком и образом: Феху означала скот и богатство, Иса — лёд и остановку,
              Дагаз — рассвет. Гадание строилось не на предсказании точных событий, а на
              чтении силы, которая сейчас действует в жизни человека.
            </p>
            <p className="mt-4" style={{ color: "var(--text-secondary)" }}>
              Расклад из трёх рун — самая старая и самая честная форма. Он не обещает
              готовых ответов, он показывает линию: откуда ты пришла, где стоишь и куда
              смотрит ближайший месяц. Руны говорят коротко, и потому их легко услышать —
              если задать точный вопрос.
            </p>

            <hr className="hairline my-7" />

            <p
              className="font-display"
              style={{
                fontSize: "clamp(18px, 2.6vw, 23px)",
                fontStyle: "italic",
                color: "var(--accent-amber-light)",
                lineHeight: 1.45,
              }}
            >
              «Руны — это голос древней мудрости, говорящей на языке символов»
            </p>
          </div>
        </div>
      </section>

      {/* Section 2 — the three positions */}
      <section className="py-16 md:py-20">
        <div className="shell">
          <p className="eyebrow text-center">Структура</p>
          <h2 className="mt-2 text-center" style={{ fontSize: "clamp(24px, 4vw, 34px)" }}>
            Три руны расклада
          </h2>

          <div className="mt-9 grid gap-4 md:grid-cols-3 md:gap-5">
            {POSITION_CARDS.map(({ Icon, title, text, body }) => (
              <div key={title} className="stone-card p-6">
                <Icon size={24} strokeWidth={1.5} color="var(--accent-ice)" />
                <h3 className="mt-4" style={{ fontSize: 20 }}>
                  {title}
                </h3>
                <p
                  className="mt-1"
                  style={{ fontSize: 14, color: "var(--accent-amber)", fontStyle: "italic" }}
                >
                  {text}
                </p>
                <p className="mt-3" style={{ color: "var(--text-secondary)", fontSize: 16 }}>
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 — social proof */}
      <section style={{ background: "var(--bg-secondary)" }} className="py-16 md:py-20">
        <div className="shell-narrow">
          <p className="eyebrow">Отзывы</p>
          <h2 className="mt-2" style={{ fontSize: "clamp(24px, 4vw, 34px)" }}>
            Что говорят о раскладах
          </h2>

          <div className="mt-8 flex flex-col gap-4">
            {QUOTES.map((q) => (
              <blockquote key={q.author} className="stone-card amber-edge p-6">
                <p style={{ fontSize: 17, fontStyle: "italic", color: "var(--text-primary)" }}>
                  «{q.text}»
                </p>
                <footer
                  className="font-display mt-3"
                  style={{ fontSize: 13, letterSpacing: "0.08em", color: "var(--text-muted)" }}
                >
                  {q.author}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20">
        <div className="shell-narrow">
          <p className="eyebrow">Вопросы</p>
          <h2 className="mt-2" style={{ fontSize: "clamp(24px, 4vw, 34px)" }}>
            Частые вопросы
          </h2>
          <div className="mt-8 flex flex-col gap-3">
            {FAQ.map((item) => (
              <details key={item.q} className="stone-card p-5">
                <summary
                  className="font-display cursor-pointer list-none"
                  style={{ fontSize: 17 }}
                >
                  {item.q}
                </summary>
                <p className="mt-3" style={{ color: "var(--text-secondary)", fontSize: 16 }}>
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="pb-20">
        <div className="shell-narrow text-center">
          <h2 style={{ fontSize: "clamp(23px, 3.6vw, 30px)" }}>
            Три руны уже ждут тебя
          </h2>
          <p className="mx-auto mt-4 max-w-[46ch]" style={{ color: "var(--text-secondary)" }}>
            Бесплатный расклад занимает меньше минуты и приходит сразу на экран.
          </p>
          <Link href="#draw" className="btn-amber mt-7 w-full sm:w-auto">
            Вытянуть руны
            <ArrowRight size={18} strokeWidth={2.2} />
          </Link>
        </div>
      </section>

      <footer style={{ borderTop: "1px solid var(--border)" }} className="py-8">
        <div
          className="shell flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left"
          style={{ fontSize: 13.5, color: "var(--text-muted)" }}
        >
          <span>Евдокимов Даниил Владимирович, ИНН 381928138362</span>
          <span className="flex gap-5">
            <Link href="/privacy" style={{ color: "var(--accent-stone)" }}>
              Политика конфиденциальности
            </Link>
            <Link href="/offer" style={{ color: "var(--accent-stone)" }}>
              Оферта
            </Link>
          </span>
        </div>
      </footer>
    </main>
  );
}
