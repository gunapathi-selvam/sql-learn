Project structure


sqlladder/
├── src/
│   ├── app/
│   │   ├── layout.tsx                          ← root layout + Navbar + ThemeProvider
│   │   ├── page.tsx                            ← / Home (hero + topic grid + how-to)
│   │   ├── globals.css                         ← Tailwind base + SQL syntax colors
│   │   ├── not-found.tsx
│   │   ├── topics/[slug]/page.tsx              ← /topics/:slug (SSG for all 10)
│   │   ├── answers/page.tsx                    ← /answers global answer sheet
│   │   └── add/page.tsx                        ← /add JSON snippet generator
│   ├── components/
│   │   ├── Navbar.tsx, ThemeToggle.tsx
│   │   ├── TopicCard.tsx, TopicView.tsx
│   │   ├── QuestionCard.tsx, AnswerSheet.tsx, AddQuestionForm.tsx
│   │   ├── CodeBlock.tsx, Badges.tsx, ProgressBar.tsx
│   ├── lib/
│   │   ├── types.ts, data.ts
│   │   ├── progress.ts                         ← localStorage hooks
│   │   ├── theme.tsx                           ← dark/light context (default dark)
│   │   └── highlight.ts                        ← tiny SQL syntax highlighter (zero deps)
│   └── data/questions.json                     ← 10 topics × 20 questions = 200, single source of truth
├── package.json, tsconfig.json
├── next.config.mjs, postcss.config.mjs, tailwind.config.ts
└── README.md
Verified

npm install → 385 packages, no errors.
npm run build → clean, zero warnings, 16 static pages generated (home, 10 topics SSG, answers, add, not-found, etc.).
Live HTTP smoke test against npm run start: /, /answers, /add → 200; all 10 /topics/:slug → 200; bad slug → 404.
JSON validated: 10 topics, each with exactly 8 MCQ + 6 Single + 6 Code = 20 questions, totaling 200.
Features delivered

Dark by default, light toggle, persisted to localStorage (FOUC blocker in <head>).
Topic grid with per-topic progress bar, difficulty mix, question count.
Per-question card: difficulty + type badges, hint toggle, MCQ option buttons with correct/incorrect highlighting, single-answer reveal, code answer with copy-to-clipboard.
Sticky sidebar question navigator (colored dots: MCQ blue / Single green / Code purple, green check for done).
Keyboard shortcuts: H hint, A answer, N/→ next, ← previous.
/answers accordion across all 200, expand/collapse all, print-friendly (@media print strips chrome).
/add live JSON snippet generator with copy-to-clipboard.
Fully responsive (Tailwind breakpoints) — mobile menu, fluid grid (1 col → 2 → 3 → 4), sidebar collapses to grid above the question on small screens.
How to run

cd "c:\New folder\dash\sqlladder"
npm install      # (already done)
npm run dev      # http://localhost:3000
Deploy to Vercel: push the folder to a Git repo, import — no env vars.

Adding new content (2 steps)
New question → open /add, fill the form, Copy JSON snippet, then paste into src/data/questions.json inside the chosen topic's questions array.
New topic → append a new object { id, title, description, icon, questions: [...] } to the top-level array in src/data/questions.json. Home page picks it up automatically; no code changes.