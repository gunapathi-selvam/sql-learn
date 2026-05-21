"use client";

import { useState } from "react";
import { highlightSQL } from "@/lib/highlight";

export default function CodeBlock({ sql }: { sql: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard may be unavailable in insecure contexts; fail silently
    }
  };

  return (
    <div className="relative">
      <pre
        className="code-scroll overflow-x-auto rounded-lg border border-slate-800 bg-slate-900 p-4 font-mono text-sm leading-relaxed text-slate-100 print:border print:bg-white print:text-black"
        aria-label="SQL code"
      >
        <code
          dangerouslySetInnerHTML={{ __html: highlightSQL(sql) }}
        />
      </pre>
      <button
        type="button"
        onClick={onCopy}
        className="no-print absolute right-2 top-2 rounded-md border border-slate-700 bg-slate-800/80 px-2 py-1 text-xs font-medium text-slate-200 backdrop-blur hover:bg-slate-700"
        aria-label="Copy SQL"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
