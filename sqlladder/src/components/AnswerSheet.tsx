"use client";

import { useState } from "react";
import type { Topic } from "@/lib/types";
import { TypeBadge } from "./Badges";

export default function AnswerSheet({ topics }: { topics: Topic[] }) {
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    topics.forEach((t) => (init[t.id] = true));
    return init;
  });

  const toggle = (id: string) =>
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    topics.forEach((t) => (all[t.id] = true));
    setOpen(all);
  };
  const collapseAll = () => setOpen({});

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">📋 Answer Sheet</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            All answers, grouped by topic. Print-friendly.
          </p>
        </div>
        <div className="no-print flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={expandAll}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Expand all
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Collapse all
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            🖨 Print
          </button>
        </div>
      </header>

      <div className="space-y-4">
        {topics.map((t) => (
          <section
            key={t.id}
            className="print-card overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
          >
            <button
              type="button"
              onClick={() => toggle(t.id)}
              className="flex w-full items-center justify-between gap-3 px-5 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <span className="flex items-center gap-3">
                <span className="text-xl" aria-hidden>
                  {t.icon}
                </span>
                <span className="text-base font-semibold sm:text-lg">
                  {t.title}
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {t.questions.length} Qs
                </span>
              </span>
              <span className="text-slate-400">{open[t.id] ? "−" : "+"}</span>
            </button>

            {open[t.id] && (
              <div className="overflow-x-auto border-t border-slate-200 dark:border-slate-800">
                <table className="w-full min-w-[640px] border-collapse text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                    <tr>
                      <th className="px-3 py-2">Q#</th>
                      <th className="px-3 py-2">Type</th>
                      <th className="px-3 py-2">Question</th>
                      <th className="px-3 py-2">Answer / SQL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {t.questions.map((q, i) => (
                      <tr
                        key={q.id}
                        className="border-t border-slate-100 align-top dark:border-slate-800"
                      >
                        <td className="px-3 py-2 font-mono text-xs text-slate-500">{i + 1}</td>
                        <td className="px-3 py-2"><TypeBadge type={q.type} /></td>
                        <td className="px-3 py-2 text-slate-700 dark:text-slate-200">
                          {q.question}
                        </td>
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
        ))}
      </div>
    </div>
  );
}
