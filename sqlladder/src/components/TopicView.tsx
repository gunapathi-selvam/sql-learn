"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Topic } from "@/lib/types";
import QuestionCard from "./QuestionCard";
import ProgressBar from "./ProgressBar";
import { TypeBadge, typeColorDot } from "./Badges";
import { useTopicProgress } from "@/lib/progress";

export default function TopicView({ topic }: { topic: Topic }) {
  const [current, setCurrent] = useState(0);
  const { done, toggle } = useTopicProgress(topic.id);
  const total = topic.questions.length;
  const doneCount = useMemo(
    () => Object.values(done).filter(Boolean).length,
    [done]
  );

  const [revealSignal, setRevealSignal] = useState(0);
  const [hintSignal, setHintSignal] = useState(0);

  const goNext = useCallback(() => {
    setCurrent((c) => Math.min(total - 1, c + 1));
  }, [total]);

  const goPrev = useCallback(() => {
    setCurrent((c) => Math.max(0, c - 1));
  }, []);

  // Keyboard shortcuts: H, A, N + arrow keys
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const k = e.key.toLowerCase();
      if (k === "h") {
        e.preventDefault();
        setHintSignal((s) => s + 1);
      } else if (k === "a") {
        e.preventDefault();
        setRevealSignal((s) => s + 1);
      } else if (k === "n" || e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  const q = topic.questions[current];

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link
              href="/"
              className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              ← All topics
            </Link>
            <h1 className="mt-1 flex items-center gap-3 text-2xl font-bold tracking-tight sm:text-3xl">
              <span aria-hidden>{topic.icon}</span>
              {topic.title}
            </h1>
            <p className="mt-1 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
              {topic.description}
            </p>
          </div>
          <div className="min-w-[180px] flex-1 sm:max-w-xs">
            <ProgressBar value={doneCount} max={total} />
          </div>
        </div>

        <div className="mt-4 hidden flex-wrap items-center gap-3 text-xs text-slate-500 sm:flex dark:text-slate-400">
          <span className="font-semibold uppercase tracking-wide">Shortcuts:</span>
          <kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono dark:bg-slate-800">H</kbd> hint
          <kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono dark:bg-slate-800">A</kbd> answer
          <kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono dark:bg-slate-800">N</kbd>
          <span>/</span>
          <kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono dark:bg-slate-800">→</kbd> next
          <kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono dark:bg-slate-800">←</kbd> previous
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="px-1 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Questions
            </h3>
            <ol className="grid max-h-[60vh] grid-cols-5 gap-1.5 overflow-y-auto lg:max-h-[70vh] lg:grid-cols-4">
              {topic.questions.map((qq, i) => {
                const isActive = i === current;
                const isDone = !!done[qq.id];
                return (
                  <li key={qq.id}>
                    <button
                      type="button"
                      onClick={() => setCurrent(i)}
                      className={`relative flex h-10 w-full items-center justify-center rounded-md text-xs font-bold transition-colors ${
                        isActive
                          ? "bg-slate-900 text-white shadow dark:bg-slate-100 dark:text-slate-900"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                      }`}
                      title={`Q${i + 1} · ${qq.type}`}
                    >
                      {i + 1}
                      <span
                        className={`absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${typeColorDot[qq.type]}`}
                        aria-hidden
                      />
                      {isDone && (
                        <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                          ✓
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ol>

            <div className="mt-3 space-y-1.5 border-t border-slate-100 px-1 pt-3 text-[11px] text-slate-500 dark:border-slate-800 dark:text-slate-400">
              <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> MCQ</div>
              <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Single</div>
              <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-purple-500" /> Code</div>
            </div>
          </div>
        </aside>

        <section className="space-y-4">
          <QuestionCard
            question={q}
            index={current}
            total={total}
            done={!!done[q.id]}
            onToggleDone={() => toggle(q.id)}
            revealSignal={revealSignal}
            hintSignal={hintSignal}
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={goPrev}
              disabled={current === 0}
              className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              ← Previous
            </button>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {current + 1} of {total}
            </span>
            <button
              type="button"
              onClick={goNext}
              disabled={current === total - 1}
              className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              Next →
            </button>
          </div>

          <AnswerTable topic={topic} />
        </section>
      </div>
    </div>
  );
}

function AnswerTable({ topic }: { topic: Topic }) {
  const [open, setOpen] = useState(false);
  return (
    <section className="mt-8 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-xl px-5 py-3 text-left text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800/50"
      >
        <span>📋 Full answer sheet — {topic.title}</span>
        <span className="text-slate-400">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="overflow-x-auto border-t border-slate-200 px-1 sm:px-3 dark:border-slate-800">
          <table className="w-full min-w-[600px] border-collapse text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <th className="px-3 py-2">Q#</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Question</th>
                <th className="px-3 py-2">Answer / SQL</th>
              </tr>
            </thead>
            <tbody>
              {topic.questions.map((q, i) => (
                <tr key={q.id} className="border-t border-slate-100 align-top dark:border-slate-800">
                  <td className="px-3 py-2 font-mono text-xs text-slate-500">{i + 1}</td>
                  <td className="px-3 py-2"><TypeBadge type={q.type} /></td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-200">{q.question}</td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-800 dark:text-slate-100">
                    {q.type === "code" ? (
                      <pre className="code-scroll whitespace-pre-wrap break-words rounded bg-slate-100 p-2 dark:bg-slate-800">{q.sql}</pre>
                    ) : (
                      <span>{q.answer}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
