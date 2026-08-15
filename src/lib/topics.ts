import type { TopicId } from "./runes";

export interface Topic {
  id: TopicId;
  label: string;
  short: string;
  hint: string;
}

export const TOPICS: Topic[] = [
  {
    id: "love",
    label: "Любовь и отношения",
    short: "Любовь",
    hint: "чувства, пара, притяжение",
  },
  {
    id: "money",
    label: "Деньги и работа",
    short: "Деньги",
    hint: "доход, дело, карьера",
  },
  {
    id: "path",
    label: "Общий расклад на месяц",
    short: "Путь",
    hint: "направление ближайших 30 дней",
  },
  {
    id: "question",
    label: "Конкретный вопрос",
    short: "Вопрос",
    hint: "прямой ответ рун",
  },
];

export function topicById(id: string | null | undefined): Topic {
  return TOPICS.find((t) => t.id === id) ?? TOPICS[2];
}

export interface UserData {
  name: string;
  email: string;
  topic: TopicId;
  question: string;
}

export const STORAGE_KEY = "runic_data";
export const TIMER_KEY = "runic_timer_start";
export const SPOTS_KEY = "runic_spots";

export function readUserData(): UserData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<UserData>;
    if (!parsed.name || !parsed.email) return null;
    return {
      name: parsed.name,
      email: parsed.email,
      topic: (parsed.topic ?? "path") as TopicId,
      question: parsed.question ?? "",
    };
  } catch {
    return null;
  }
}
