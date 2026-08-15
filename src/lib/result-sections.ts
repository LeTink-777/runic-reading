import {
  POSITION_HINTS,
  POSITIONS,
  drawRunes,
  interpretationFor,
  type Rune,
  type TopicId,
} from "@/lib/runes";
import type { PlanId } from "@/lib/plans";
import type { PdfSection } from "@/lib/pdf-generator";

/**
 * Собирает разделы расклада для PDF в письме, PDF по кнопке и открытого
 * результата на /thank-you — чтобы все три источника совпадали.
 *
 * drawRunes() детерминирован по имени, поэтому расклад не зависит от момента
 * генерации и одинаков во всех трёх местах.
 */

const VALID_TOPICS: TopicId[] = ["love", "money", "path", "question"];

function isTopicId(value: unknown): value is TopicId {
  return typeof value === "string" && VALID_TOPICS.includes(value as TopicId);
}

function isPlanId(value: unknown): value is PlanId {
  return value === "basic" || value === "full" || value === "premium";
}

export type RunicInput = {
  name: string;
  topic: TopicId;
};

/**
 * Базовый тариф открывает две руны из трёх, полный и премиум — весь расклад
 * вместе с общим посланием.
 */
function runeCountForPlan(plan: PlanId): number {
  return plan === "basic" ? 2 : 3;
}

export function generateResultSections(
  input: RunicInput,
  plan: string | null | undefined
): PdfSection[] {
  const resolvedPlan: PlanId = isPlanId(plan) ? plan : "full";
  const reading = drawRunes(input.name, input.topic);

  const runes: Rune[] = [reading.rune1, reading.rune2, reading.rune3];
  const count = runeCountForPlan(resolvedPlan);

  const sections: PdfSection[] = runes.slice(0, count).map((rune, index) => ({
    title: `${POSITIONS[index]} — ${rune.symbol} ${rune.name}`,
    content: [
      `${POSITION_HINTS[index].charAt(0).toUpperCase()}${POSITION_HINTS[index].slice(1)}.`,
      `Ключевые значения: ${rune.keywords}.`,
      interpretationFor(rune, input.topic),
      `Совет руны: ${rune.advice}`,
    ].join("\n\n"),
  }));

  // Общее послание собирает три руны воедино, поэтому в урезанном раскладе
  // его показывать нечестно — оно ссылается на руну, которая ещё закрыта.
  if (resolvedPlan !== "basic") {
    sections.push({
      title: "Общее послание расклада",
      content: reading.overallMessage,
    });
  }

  return sections;
}

/** Читает данные расклада из metadata ЮKassa — там всё приходит строками. */
export function inputFromMetadata(
  metadata: Record<string, string>
): RunicInput | null {
  const name = metadata.name;
  if (!name) return null;

  return {
    name,
    topic: isTopicId(metadata.topic) ? metadata.topic : "path",
  };
}

/** Строка под заголовком отчёта: имя владельца расклада. */
export function buildSubtitle(input: RunicInput): string {
  return input.name;
}
