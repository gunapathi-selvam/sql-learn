import type { Difficulty, QuestionType } from "@/lib/types";

const typeStyle: Record<QuestionType, string> = {
  mcq: "bg-blue-500/15 text-blue-600 ring-blue-500/30 dark:text-blue-300",
  single: "bg-emerald-500/15 text-emerald-600 ring-emerald-500/30 dark:text-emerald-300",
  code: "bg-purple-500/15 text-purple-600 ring-purple-500/30 dark:text-purple-300",
};

const typeLabel: Record<QuestionType, string> = {
  mcq: "MCQ",
  single: "Single",
  code: "Code",
};

export function TypeBadge({ type }: { type: QuestionType }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${typeStyle[type]}`}
    >
      {typeLabel[type]}
    </span>
  );
}

const diffStyle: Record<Difficulty, string> = {
  easy: "bg-green-500/15 text-green-700 ring-green-500/30 dark:text-green-300",
  medium: "bg-amber-500/15 text-amber-700 ring-amber-500/30 dark:text-amber-300",
  hard: "bg-red-500/15 text-red-700 ring-red-500/30 dark:text-red-300",
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset ${diffStyle[difficulty]}`}
    >
      {difficulty}
    </span>
  );
}

export const typeColorDot: Record<QuestionType, string> = {
  mcq: "bg-blue-500",
  single: "bg-emerald-500",
  code: "bg-purple-500",
};
