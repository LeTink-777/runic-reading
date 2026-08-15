import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface LegalShellProps {
  title: string;
  updated: string;
  children: React.ReactNode;
}

export default function LegalShell({ title, updated, children }: LegalShellProps) {
  return (
    <main className="shell-narrow py-14 md:py-20">
      <Link
        href="/"
        className="font-display inline-flex items-center gap-2"
        style={{ fontSize: 13, letterSpacing: "0.1em", color: "var(--accent-stone)" }}
      >
        <ArrowLeft size={15} strokeWidth={1.8} />
        НА ГЛАВНУЮ
      </Link>

      <h1 className="mt-8" style={{ fontSize: "clamp(26px, 4.4vw, 36px)" }}>
        {title}
      </h1>
      <p className="mt-3" style={{ fontSize: 14, color: "var(--text-muted)" }}>
        Редакция от {updated}
      </p>

      <hr className="hairline my-8" />

      <div className="legal-body flex flex-col gap-5" style={{ color: "var(--text-secondary)" }}>
        {children}
      </div>

      <hr className="hairline my-10" />

      <div style={{ fontSize: 14, color: "var(--text-muted)" }}>
        <p>Евдокимов Даниил Владимирович</p>
        <p>ИНН 381928138362</p>
        <p>Налог на профессиональный доход (самозанятый)</p>
        <p>Email: danyavdkmvv3@gmail.com</p>
        <p>Telegram: @dvdkmv</p>
      </div>
    </main>
  );
}
