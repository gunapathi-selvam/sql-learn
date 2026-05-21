# Sakila SQL Dojo 🥋

A self-study SQL practice platform inspired by SQLZoo, built on the MySQL Sakila sample database. Next.js 14 (App Router) + TypeScript + Tailwind. No backend — all 200 questions live in a single JSON file.

## Run locally

```bash
cd sqlladder
npm install
npm run dev
```

Open <http://localhost:3000>.

## Deploy to Vercel

Push to a Git repository, import the repo in Vercel, accept defaults. No env vars required.

## Project layout

```
sqlladder/
├── src/
│   ├── app/
│   │   ├── layout.tsx                   # Root layout, theme + nav
│   │   ├── page.tsx                     # Home (topic grid)
│   │   ├── topics/[slug]/page.tsx       # Topic detail (dynamic route)
│   │   ├── answers/page.tsx             # Global answer sheet
│   │   ├── add/page.tsx                 # JSON snippet generator
│   │   ├── not-found.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── TopicCard.tsx
│   │   ├── TopicView.tsx
│   │   ├── QuestionCard.tsx
│   │   ├── AnswerSheet.tsx
│   │   ├── AddQuestionForm.tsx
│   │   ├── CodeBlock.tsx
│   │   ├── Badges.tsx
│   │   └── ProgressBar.tsx
│   ├── lib/
│   │   ├── types.ts
│   │   ├── data.ts
│   │   ├── progress.ts                  # localStorage hooks
│   │   ├── theme.tsx                    # dark/light context
│   │   └── highlight.ts                 # tiny SQL syntax highlighter
│   └── data/
│       └── questions.json               # 200 questions (single source of truth)
├── tailwind.config.ts
├── postcss.config.mjs
├── next.config.mjs
└── tsconfig.json
```

## Adding new content

1. **Add a new question:** open `/add` in the running app, fill in the form, click *Copy JSON snippet*, then paste the object into `src/data/questions.json` inside the chosen topic's `questions` array.
2. **Add a whole new topic:** add a new object to the top-level array in `src/data/questions.json` with `id`, `title`, `description`, `icon`, and a `questions` array. The home page picks it up automatically — no code changes required.

## Keyboard shortcuts (on a topic page)

| Key | Action |
| --- | --- |
| `H` | Toggle hint |
| `A` | Reveal answer / SQL solution |
| `N` or `→` | Next question |
| `←` | Previous question |
