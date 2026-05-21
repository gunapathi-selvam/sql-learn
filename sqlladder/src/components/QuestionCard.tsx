"use client";

import { useEffect, useState } from "react";
import type { Question } from "@/lib/types";
import { TypeBadge, DifficultyBadge } from "./Badges";
import CodeBlock from "./CodeBlock";

interface Props {
  question: Question;
  index: number;
  total: number;
  done: boolean;
  onToggleDone: () => void;
  revealSignal: number;
  hintSignal: number;
}

const LETTERS = ["A", "B", "C", "D", "E"];

export default function QuestionCard({
  question,
  index,
  total,
  done,
  onToggleDone,
  revealSignal,
  hintSignal,
}: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Reset state whenever the displayed question changes
  useEffect(() => {
    setSelected(null);
    setShowAnswer(false);
    setShowHint(false);
  }, [question.id]);

  // Keyboard shortcuts trigger via incrementing signals
  useEffect(() => {
    if (revealSignal > 0) setShowAnswer(true);
  }, [revealSignal]);

  useEffect(() => {
    if (hintSignal > 0) setShowHint((s) => !s);
  }, [hintSignal]);

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            Q{index + 1} / {total}
          </span>
          <TypeBadge type={question.type} />
          <DifficultyBadge difficulty={question.difficulty} />
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-800"
            checked={done}
            onChange={onToggleDone}
          />
          Mark as done
        </label>
      </header>

      <h2 className="text-base font-semibold leading-relaxed text-slate-900 sm:text-lg dark:text-slate-100">
        {question.question}
      </h2>

      {question.schemaTables && question.schemaTables.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
          <span>Tables:</span>
          {question.schemaTables.map((t) => (
            <code
              key={t}
              className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {t}
            </code>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setShowHint((s) => !s)}
          className="rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-200 dark:hover:bg-amber-900/50"
        >
          💡 {showHint ? "Hide hint" : "Show hint"}
          <span className="ml-1 hidden text-amber-700 sm:inline dark:text-amber-300">(H)</span>
        </button>

        {question.type !== "mcq" && (
          <button
            type="button"
            onClick={() => setShowAnswer((s) => !s)}
            className="rounded-md border border-blue-300 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-200 dark:hover:bg-blue-900/50"
          >
            🔓 {showAnswer ? "Hide answer" : "Reveal answer"}
            <span className="ml-1 hidden text-blue-700 sm:inline dark:text-blue-300">(A)</span>
          </button>
        )}
      </div>

      {showHint && (
        <div className="mt-3 animate-fade-in rounded-md border-l-4 border-amber-400 bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-900/20 dark:text-amber-100">
          {question.hint}
        </div>
      )}

      {question.type === "mcq" && question.options && (
        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {question.options.map((opt, i) => {
            const letter = LETTERS[i];
            const isCorrect = letter === question.answer;
            const isPicked = selected === letter;
            const reveal = selected !== null;

            let cls =
              "flex items-start gap-3 rounded-lg border p-3 text-left text-sm transition-colors ";
            if (!reveal) {
              cls +=
                "border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-500 dark:hover:bg-blue-950/40";
            } else if (isCorrect) {
              cls +=
                "border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-900/30";
            } else if (isPicked) {
              cls += "border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/30";
            } else {
              cls += "border-slate-200 bg-white opacity-60 dark:border-slate-800 dark:bg-slate-900";
            }

            return (
              <button
                key={letter}
                type="button"
                onClick={() => setSelected(letter)}
                disabled={reveal}
                className={cls}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {letter}
                </span>
                <span className="text-slate-800 dark:text-slate-100">{opt}</span>
              </button>
            );
          })}
        </div>
      )}

      {question.type === "mcq" && selected !== null && (
        <div className="mt-4 animate-fade-in rounded-md border-l-4 border-blue-500 bg-blue-50 p-3 text-sm dark:bg-blue-950/30">
          <p className="font-semibold text-blue-900 dark:text-blue-200">
            {selected === question.answer
              ? "✅ Correct!"
              : `❌ Not quite — the correct answer is ${question.answer}.`}
          </p>
          <p className="mt-1 text-slate-700 dark:text-slate-200">{question.explanation}</p>
        </div>
      )}

      {question.type === "single" && showAnswer && (
        <div className="mt-4 animate-fade-in space-y-3">
          <div className="rounded-md border-l-4 border-emerald-500 bg-emerald-50 p-3 dark:bg-emerald-900/20">
            <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              Answer
            </div>
            <div className="mt-1 font-mono text-base text-emerald-900 dark:text-emerald-100">
              {question.answer}
            </div>
          </div>
          <div className="rounded-md border-l-4 border-slate-400 bg-slate-50 p-3 text-sm text-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
            {question.explanation}
          </div>
        </div>
      )}

      {question.type === "code" && showAnswer && question.sql && (
        <div className="mt-4 animate-fade-in space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-purple-700 dark:text-purple-300">
            Solution
          </div>
          <CodeBlock sql={question.sql} />
          <div className="rounded-md border-l-4 border-slate-400 bg-slate-50 p-3 text-sm text-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
            {question.explanation}
          </div>
        </div>
      )}
    </article>
  );
}
