# Continue.dev config kit — SQL + Next.js local tutor

A portable, expandable configuration for [Continue.dev](https://continue.dev) tuned for learning SQL and Next.js with a local Ollama model. Drop it into `~/.continue/` on Linux or `%USERPROFILE%\.continue\` on Windows and you're done.

## What you get

- **4 model slots** wired up (chat 7B, chat 3B, autocomplete 1.5B, embeddings) — pick the chat model that fits your machine from Continue's dropdown.
- **9 slash commands** for SQL/Next.js learning workflows.
- **Always-on rules** that tell the model about your project schema, your stack, and safety expectations (parameterised queries, no hallucination).
- **Indexed docs** for PostgreSQL, Next.js, node-postgres, and Prisma — query with `@docs`.

## Folder structure

```
continue-config/
├── README.md              <- this file
├── config.yaml            <- main config (models, context, rules, docs)
└── prompts/               <- slash commands; one file = one command
    ├── explain-sql.prompt        -> /explain-sql
    ├── review-query.prompt       -> /review-query
    ├── optimize-sql.prompt       -> /optimize-sql
    ├── safe-query.prompt         -> /safe-query
    ├── explain-error.prompt      -> /explain-error
    ├── teach.prompt              -> /teach
    ├── review-server-action.prompt -> /review-server-action
    ├── migration.prompt          -> /migration
    └── quiz.prompt               -> /quiz
```

## Install

### Windows

```powershell
# From the folder containing this README:
$dest = "$env:USERPROFILE\.continue"
New-Item -ItemType Directory -Path "$dest\prompts" -Force | Out-Null
Copy-Item -Path .\config.yaml -Destination $dest -Force
Copy-Item -Path .\prompts\*.prompt -Destination "$dest\prompts" -Force
```

### Linux

```bash
# From the folder containing this README:
mkdir -p ~/.continue/prompts
cp config.yaml ~/.continue/
cp prompts/*.prompt ~/.continue/prompts/
```

Then in VSCode: command palette → **Continue: Reload Window** (or just restart VSCode).

## Required model pulls

Run once on each machine:

```
# Both machines: small + embeddings (mandatory)
ollama pull qwen2.5-coder:1.5b
ollama pull nomic-embed-text

# Windows 24GB: full chat model
ollama pull qwen2.5-coder:7b

# Linux 8GB: smaller chat model
ollama pull qwen2.5-coder:3b
```

## Pick your chat model in Continue

Open the Continue chat panel (`Ctrl+L`). At the top there's a model dropdown — choose **Local 7B (Windows 24GB)** or **Local 3B (Linux 8GB)** depending on the machine. Continue remembers your choice per workspace.

## First test prompts

After install, open your `sms/` project in VSCode and try:

```
/teach window functions

/safe-query find the top 3 students by average grade across all courses

@file lib/db.ts /review-server-action

/quiz INNER JOIN vs LEFT JOIN
```

## How to extend

This config is designed to grow with you. Three common extensions:

### Add a new slash command

Drop a new file in `prompts/` with the `.prompt` extension:

```
---
name: My Command
description: One-line description shown in the slash-command picker
---

System instructions for the model go here.

User input lands at the placeholder below:

{{{ input }}}
```

Save it. The next time you type `/` in the chat, your new command appears. Restart Continue if it doesn't show up.

Good prompt-writing rules of thumb:
- Lead with **what to do**, then **how to format the answer**, then the input placeholder.
- Be explicit about what NOT to do ("Do not invent column names", "Do not give the answer in quiz mode").
- Test it on a small input first — small models follow detailed prompts better than vague ones.

### Add a new model

Edit `config.yaml`, copy any existing block under `models:`, and adjust:

```yaml
  - name: My New Model
    provider: ollama          # or openai, anthropic, gemini, etc.
    model: deepseek-coder-v2:lite
    roles: [chat, edit, apply]
    defaultCompletionOptions:
      contextLength: 8192
      temperature: 0.2
```

Reload Continue and pick it from the dropdown.

### Add a new rule

Append a string to the `rules:` list in `config.yaml`. Rules are concatenated into every chat's system prompt, so keep them short and high-signal.

Example: as you progress in the learning plan, add:

```yaml
rules:
  - |
    Current week: 4 (aggregations, GROUP BY, subqueries).
    Lean into these concepts when answering; introduce window functions
    and CTEs only if directly asked.
```

Delete the rule when you've moved past that week.

### Add a docs source

Append to the `docs:` list in `config.yaml`:

```yaml
docs:
  - name: My Library
    startUrl: https://example.com/docs
```

Then command palette → **Continue: Reindex Docs**.

## Tips for getting the best out of a small local model

- **Always use a slash command** when one fits. The prompt scaffolding makes the small model behave much more reliably than free-form chat.
- **Use `@file` or `@code` generously.** The model can only reason about what you give it. Don't ask "is this safe?" without `@file actions.ts`.
- **For SQL, prefer `@docs PostgreSQL` over the model's memory.** Local models hallucinate function names. Indexed docs ground the answer.
- **One topic per chat.** Open a fresh chat (`Ctrl+Shift+L`) when switching subjects — context bleeds between turns and confuses small models.
- **If the answer feels off, run `/review-query` or `/explain-error` to second-guess it.** Two passes of a small model often beats one pass of frustration.

## When to skip the local model and use Claude

- Anything from week 5–6 of the learning plan (window functions, query plans, Prisma).
- A bug the local model couldn't crack after two attempts.
- A code-review of a finished week.
- "Should I do X or Y" architectural decisions.

Use the local model for ~80% of day-to-day questions. Use Claude for the ~20% that need the extra horsepower.
