"use client";

import Link from "next/link";
import type { Topic } from "@/lib/types";
import { useAllProgress, countDone } from "@/lib/progress";
import ProgressBar from "./ProgressBar";

function difficultyMix(topic: Topic) {
  const counts = { easy: 0, medium: 0, hard: 0 } as Record<string, number>;
  topic.questions.forEach((q) => {
    counts[q.difficulty]++;
  });
  return counts;
}

export default function TopicCard({ topic }: { topic: Topic }) {
  const progress = useAllProgress();
  const done = countDone(progress, topic.id);
  const total = topic.questions.length;
  const mix = difficultyMix(topic);

  return (
    <Link
      href={`/topics/${topic.id}`}
      className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="text-3xl" aria-hidden>
          {topic.icon}
        </div>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {total} Qs
        </span>
      </div>

      <h3 className="mt-3 text-lg font-semibold text-slate-900 group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
        {topic.title}
      </h3>
      <p className="mt-1 line-clamp-3 text-sm text-slate-600 dark:text-slate-400">
        {topic.description}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] font-medium">
        <span className="rounded-md bg-green-500/15 px-1.5 py-0.5 text-green-700 dark:text-green-300">
          {mix.easy} easy
        </span>
        <span className="rounded-md bg-amber-500/15 px-1.5 py-0.5 text-amber-700 dark:text-amber-300">
          {mix.medium} med
        </span>
        <span className="rounded-md bg-red-500/15 px-1.5 py-0.5 text-red-700 dark:text-red-300">
          {mix.hard} hard
        </span>
      </div>

      <div className="mt-auto pt-4">
        <ProgressBar value={done} max={total} />
      </div>
    </Link>
  );
}
