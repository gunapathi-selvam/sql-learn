"use client";

import { useMemo, useState } from "react";
import type { Difficulty, QuestionType } from "@/lib/types";
import { topics } from "@/lib/data";

export default function AddQuestionForm() {
  const [topicId, setTopicId] = useState(topics[0]?.id ?? "");
  const [id, setId] = useState("new-01");
  const [type, setType] = useState<QuestionType>("mcq");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [question, setQuestion] = useState("");
  const [hint, setHint] = useState("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [answer, setAnswer] = useState("");
  const [sql, setSql] = useState("");
  const [explanation, setExplanation] = useState("");
  const [schemaTables, setSchemaTables] = useState("");
  const [copied, setCopied] = useState(false);

  const snippet = useMemo(() => {
    const obj: Record<string, unknown> = {
      id: id || "new-01",
      type,
      difficulty,
      question,
      hint,
    };
    if (type === "mcq") {
      obj.options = options;
      obj.answer = answer;
    } else if (type === "single") {
      obj.answer = answer;
    } else if (type === "code") {
      obj.sql = sql;
    }
    obj.explanation = explanation;
    obj.schemaTables = schemaTables
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return JSON.stringify(obj, null, 2);
  }, [id, type, difficulty, question, hint, options, answer, sql, explanation, schemaTables]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  const inputCls =
    "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100";
  const labelCls = "block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400";

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">✍️ Add a question</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Fill in the form to generate a JSON snippet. Copy it and paste into{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-800">
            src/data/questions.json
          </code>{" "}
          inside the chosen topic&apos;s <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-800">questions</code> array.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <form className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Target topic</label>
              <select
                className={inputCls + " mt-1"}
                value={topicId}
                onChange={(e) => setTopicId(e.target.value)}
              >
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.id})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Question id (unique within topic)</label>
              <input
                className={inputCls + " mt-1 font-mono"}
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="e.g. bs-21"
              />
            </div>
            <div>
              <label className={labelCls}>Type</label>
              <select
                className={inputCls + " mt-1"}
                value={type}
                onChange={(e) => setType(e.target.value as QuestionType)}
              >
                <option value="mcq">MCQ</option>
                <option value="single">Single answer</option>
                <option value="code">Code</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Difficulty</label>
              <select
                className={inputCls + " mt-1"}
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              >
                <option value="easy">easy</option>
                <option value="medium">medium</option>
                <option value="hard">hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Question</label>
            <textarea
              className={inputCls + " mt-1"}
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What does the SELECT statement do?"
            />
          </div>

          <div>
            <label className={labelCls}>Hint</label>
            <input
              className={inputCls + " mt-1"}
              value={hint}
              onChange={(e) => setHint(e.target.value)}
              placeholder="Short nudge in the right direction"
            />
          </div>

          {type === "mcq" && (
            <div>
              <label className={labelCls}>Options (A–D)</label>
              <div className="mt-1 space-y-2">
                {options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-5 text-center font-bold text-slate-500">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <input
                      className={inputCls}
                      value={opt}
                      onChange={(e) =>
                        setOptions((arr) =>
                          arr.map((v, idx) => (idx === i ? e.target.value : v))
                        )
                      }
                      placeholder={`Option ${String.fromCharCode(65 + i)}`}
                    />
                  </div>
                ))}
              </div>
              <label className={labelCls + " mt-3"}>Correct letter</label>
              <input
                className={inputCls + " mt-1 w-24 font-mono"}
                value={answer}
                onChange={(e) => setAnswer(e.target.value.toUpperCase())}
                maxLength={1}
                placeholder="B"
              />
            </div>
          )}

          {type === "single" && (
            <div>
              <label className={labelCls}>Answer (short text)</label>
              <input
                className={inputCls + " mt-1 font-mono"}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="WHERE"
              />
            </div>
          )}

          {type === "code" && (
            <div>
              <label className={labelCls}>SQL solution</label>
              <textarea
                className={inputCls + " mt-1 font-mono"}
                rows={5}
                value={sql}
                onChange={(e) => setSql(e.target.value)}
                placeholder="SELECT * FROM actor;"
              />
            </div>
          )}

          <div>
            <label className={labelCls}>Explanation</label>
            <textarea
              className={inputCls + " mt-1"}
              rows={3}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Why this answer is correct…"
            />
          </div>

          <div>
            <label className={labelCls}>Schema tables (comma separated)</label>
            <input
              className={inputCls + " mt-1 font-mono"}
              value={schemaTables}
              onChange={(e) => setSchemaTables(e.target.value)}
              placeholder="actor, film"
            />
          </div>
        </form>

        <aside className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Generated JSON</h2>
            <button
              type="button"
              onClick={onCopy}
              className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              {copied ? "Copied!" : "Copy JSON snippet"}
            </button>
          </div>
          <pre className="code-scroll max-h-[60vh] overflow-auto rounded-lg border border-slate-800 bg-slate-900 p-4 font-mono text-xs leading-relaxed text-slate-100">
{snippet}
          </pre>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            <strong>Paste into</strong>{" "}
            <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">
              src/data/questions.json
            </code>{" "}
            inside the <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">questions</code> array of topic{" "}
            <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">{topicId}</code>. Save the file — your new question appears immediately on next reload.
          </p>
        </aside>
      </div>
    </div>
  );
}
