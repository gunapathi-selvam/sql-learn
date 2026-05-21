import Link from "next/link";
import { topics, totalQuestions } from "@/lib/data";
import TopicCard from "@/components/TopicCard";

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6 sm:p-10 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="relative max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            🥋 Self-study SQL practice
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-slate-50">
            Sakila SQL Dojo
          </h1>
          <p className="mt-3 text-base text-slate-600 sm:text-lg dark:text-slate-300">
            {totalQuestions()} hand-written questions across {topics.length} topics, all built
            on the MySQL <span className="font-semibold">Sakila</span> sample database. MCQs,
            short answers, and full SQL — with hints, explanations, and progress tracking.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/topics/${topics[0].id}`}
              className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              Start with {topics[0].title} →
            </Link>
            <Link
              href="/answers"
              className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              View answer sheet
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Topics</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Pick a topic — your progress is saved on this device.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {topics.map((t) => (
            <TopicCard key={t.id} topic={t} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xl font-bold tracking-tight">How to use</h2>
        <ul className="mt-3 grid grid-cols-1 gap-3 text-sm text-slate-600 sm:grid-cols-3 dark:text-slate-300">
          <li className="rounded-lg border border-slate-100 p-3 dark:border-slate-800">
            <div className="font-semibold text-blue-600 dark:text-blue-400">1. Pick a topic</div>
            <p className="mt-1">Each topic has 20 questions: MCQ, short answer and full SQL.</p>
          </li>
          <li className="rounded-lg border border-slate-100 p-3 dark:border-slate-800">
            <div className="font-semibold text-purple-600 dark:text-purple-400">2. Try, then reveal</div>
            <p className="mt-1">Use <kbd className="rounded bg-slate-100 px-1 dark:bg-slate-800">H</kbd> for hint, <kbd className="rounded bg-slate-100 px-1 dark:bg-slate-800">A</kbd> for answer, <kbd className="rounded bg-slate-100 px-1 dark:bg-slate-800">N</kbd> for next.</p>
          </li>
          <li className="rounded-lg border border-slate-100 p-3 dark:border-slate-800">
            <div className="font-semibold text-emerald-600 dark:text-emerald-400">3. Mark as done</div>
            <p className="mt-1">Tick the checkbox to track progress — it&apos;s saved in your browser.</p>
          </li>
        </ul>
      </section>
    </div>
  );
}
