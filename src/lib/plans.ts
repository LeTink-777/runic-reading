export type PlanId = "basic" | "full" | "premium";

export interface Plan {
  id: PlanId;
  title: string;
  price: number;
  oldPrice: number;
  description: string;
  delivery: string;
  features: string[];
  badge?: string;
}

export const PLANS: Record<PlanId, Plan> = {
  basic: {
    id: "basic",
    title: "Базовый расклад",
    price: 290,
    oldPrice: 890,
    description: "Базовый рунический расклад",
    delivery: "24",
    features: [
      "Все 3 руны расшифрованы",
      "Общее послание рун",
      "PDF 6 страниц",
      "Email за 24 часа",
    ],
    badge: "Осталось 8 мест",
  },
  full: {
    id: "full",
    title: "Полный расклад",
    price: 590,
    oldPrice: 2190,
    description: "Полный рунический расклад",
    delivery: "12",
    features: [
      "Все 3 руны + глубокий разбор",
      "Детальный анализ по выбранной теме",
      "Рекомендации на каждую неделю месяца",
      "Руна-защитница на месяц",
      "PDF 16 страниц",
      "Email за 12 часов",
    ],
    badge: "ВЫБОР 74%",
  },
  premium: {
    id: "premium",
    title: "Расклад + Разбор",
    price: 1190,
    oldPrice: 4500,
    description: "Рунический расклад + аудио разбор",
    delivery: "6",
    features: [
      "Всё из полного расклада",
      "Аудио разбор 12 минут",
      "Руна для медитации (персональная)",
      "Ответ на твой вопрос рунам",
      "PDF + аудио",
      "Приоритет: 6 часов",
    ],
  },
};

export const PLAN_ORDER: PlanId[] = ["basic", "full", "premium"];

export function formatPrice(value: number): string {
  return value.toLocaleString("ru-RU").replace(/ /g, " ");
}
