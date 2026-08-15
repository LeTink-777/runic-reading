import type { Metadata, Viewport } from "next";
import { Cinzel, Crimson_Text, Space_Mono, Forum, PT_Serif } from "next/font/google";
import { FAQ } from "@/lib/faq";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

/* adjustFontFallback is off for the two Latin-only faces on purpose. next/font
   otherwise injects a metric-matched "Cinzel Fallback" / "Crimson Text Fallback"
   (built from a local Times-like face) directly after the font in the stack.
   That fallback does carry Cyrillic, so every Russian glyph would stop there
   and never reach Forum / PT Serif below it. */
const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  adjustFontFallback: false,
  fallback: ["Forum", "Times New Roman", "serif"],
});

const crimson = Crimson_Text({
  variable: "--font-crimson",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  adjustFontFallback: false,
  fallback: ["PT Serif", "Georgia", "serif"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

/* Cyrillic companions: Cinzel and Crimson Text carry no Cyrillic glyphs, and the
   entire interface is in Russian. Forum matches Cinzel's Roman-capital feel and
   PT Serif matches Crimson's old-book texture. */
const forum = Forum({
  variable: "--font-forum",
  subsets: ["cyrillic", "latin"],
  weight: ["400"],
  display: "swap",
});

const ptSerif = PT_Serif({
  variable: "--font-pt-serif",
  subsets: ["cyrillic", "latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const TITLE = "Рунический расклад онлайн — Три руны на ближайший месяц";
const DESCRIPTION =
  "Бесплатный рунический расклад на месяц онлайн. Вытяни три руны Elder Futhark — узнай что ждёт в любви, деньгах и на жизненном пути. Результат мгновенно.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "рунический расклад",
    "руны онлайн",
    "расклад рун",
    "руны расклад онлайн бесплатно",
    "рунический расклад на месяц",
    "руны гадание",
    "гадание на рунах онлайн",
    "руны значение",
    "Elder Futhark",
    "старший футарк",
    "руны на любовь",
    "руны на деньги",
    "руны на будущее",
    "рунический расклад на ситуацию",
    "вытянуть руну онлайн",
    "расклад рун бесплатно",
    "руны прогноз",
    "руны расшифровка",
  ],
  authors: [{ name: "Руны" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE_URL,
    siteName: "Руны — Рунический расклад",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon-32x32.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#111318",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Руны — Рунический расклад",
      description: DESCRIPTION,
      inLanguage: "ru-RU",
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#app`,
      name: "Рунический расклад онлайн",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Web",
      url: SITE_URL,
      description: DESCRIPTION,
      inLanguage: "ru-RU",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "RUB",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        ratingCount: "29840",
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: FAQ.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon-32x32.png" />
      </head>
      <body
        className={`${cinzel.variable} ${crimson.variable} ${spaceMono.variable} ${forum.variable} ${ptSerif.variable}`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
