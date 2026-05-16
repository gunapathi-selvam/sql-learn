# Local AI Coding Agent — Setup Guide

A free, offline coding assistant for SQL + Next.js learning that runs entirely on your machine. Uses **Ollama** (local LLM runtime) + **Continue.dev** (VSCode extension) + a small coder model. No API hits. No cloud.

## What you're building

```
   VSCode  <--Continue.dev-->  Ollama (localhost:11434)  <-- Qwen 2.5 Coder
   (chat)      extension          local HTTP API              (the model)
```

When you ask a question in VSCode, Continue sends your prompt (plus any files/code you reference) to Ollama running on your own machine. The model generates the answer locally. Nothing leaves your laptop.

## Model recommendation by machine

| Machine | RAM | Model | Pull command |
|---|---|---|---|
| Linux laptop | 8 GB | Qwen 2.5 Coder 3B | `ollama pull qwen2.5-coder:3b` |
| Windows laptop | 24 GB | Qwen 2.5 Coder 7B | `ollama pull qwen2.5-coder:7b` |

Both are quantised (Q4_K_M by default) — good quality / small footprint.

---

## Part 1 — Install Ollama

### Linux

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

The installer detects your distro (Ubuntu, Fedora, Arch, etc.) and installs the binary + a systemd service that auto-starts Ollama on boot. After it finishes:

```bash
ollama --version          # verify install
systemctl status ollama   # should show "active (running)"
```

If systemd isn't available (rare), start manually with `ollama serve &`.

### Windows

1. Download the native installer: <https://ollama.com/download/windows>
2. Run `OllamaSetup.exe` — it installs to `%LOCALAPPDATA%\Programs\Ollama` (no admin required for per-user install).
3. Ollama starts automatically and lives in your system tray.
4. Verify in PowerShell:
   ```powershell
   ollama --version
   ```

If the command isn't found, log out and back in (PATH refresh), or open a new terminal.

---

## Part 2 — Pull and test your model

### Linux (8 GB)

```bash
ollama pull qwen2.5-coder:3b
ollama run qwen2.5-coder:3b "Explain the difference between INNER JOIN and LEFT JOIN in PostgreSQL with a short example."
```

### Windows (24 GB)

```powershell
ollama pull qwen2.5-coder:7b
ollama run qwen2.5-coder:7b "Explain the difference between INNER JOIN and LEFT JOIN in PostgreSQL with a short example."
```

You should see a streaming answer in 5–15 seconds. If you get one, the model works. Press `Ctrl+D` (Linux) / `Ctrl+C` (Windows) to exit the interactive prompt.

**Tip:** you can pull other models alongside and switch later:
- `ollama pull llama3.1:8b` — general-purpose, decent at SQL explanations
- `ollama pull deepseek-coder-v2:lite` — alternative coder model, also good
- `ollama pull phi3.5:3.8b` — Microsoft's small model, lighter than Qwen 3B

List what you have with `ollama list`. Remove with `ollama rm <name>`.

---

## Part 3 — Install Continue.dev in VSCode

1. Open VSCode.
2. Extensions sidebar (`Ctrl+Shift+X`) → search **Continue** → install the one published by *Continue* (verified publisher).
3. After install, click the **Continue** icon in the activity bar (looks like a `>_`).
4. When the welcome screen asks about provider, choose **"Use a local model with Ollama"**.

---

## Part 4 — Configure Continue to use your local model

Continue's config lives at:

- Linux: `~/.continue/config.yaml`
- Windows: `%USERPROFILE%\.continue\config.yaml`

Open it (`Ctrl+Shift+P` → `Continue: Open Config`) and paste — adjust the model name for your machine:

```yaml
name: Local Coder
version: 1.0.0
schema: v1

models:
  - name: Qwen Coder (local)
    provider: ollama
    model: qwen2.5-coder:7b      # change to qwen2.5-coder:3b on Linux 8GB
    roles:
      - chat
      - edit
      - apply
    defaultCompletionOptions:
      contextLength: 8192
      temperature: 0.2

  - name: Autocomplete (local)
    provider: ollama
    model: qwen2.5-coder:3b      # use the 3b for fast inline completions
    roles:
      - autocomplete

context:
  - provider: file
  - provider: code
  - provider: codebase
  - provider: folder
  - provider: terminal
  - provider: problems
```

Save the file. Continue auto-reloads.

**Why two models on Windows?** The 7B is smart enough for chat answers; the 3B is fast enough for inline ghost-text autocompletions. If you only want one, drop the autocomplete block.

---

## Part 5 — First test against your project

1. Open your `sms/` project folder in VSCode (the Next.js project from week 1).
2. Open the Continue chat panel (`Ctrl+L`).
3. Try these prompts:

```
@codebase What tables does this project use? Show me their columns.

@file lib/db.ts Explain what this file does and why we use a singleton pool.

@students/page.tsx Why is this a Server Component? What would change if I made it a Client Component?

Write a parameterised SQL query that finds all students enrolled in courses with the word "Database" in the title. Use the schema in @file lib/db.ts.
```

`@codebase`, `@file`, `@folder`, `@terminal`, `@problems` are Continue's context providers. Use them generously — the model is only as good as the context you give it.

---

## Tips for getting good answers from a small local model

Local 3B–7B models are weaker than Claude. Compensate by being more deliberate:

- **Be specific in prompts.** "Explain GROUP BY" → bland answer. "Explain GROUP BY using the `enrollments` table in @file db.sql, with an example that counts students per course" → focused answer.
- **Paste errors verbatim.** Don't paraphrase a stack trace; paste it.
- **One topic per chat session.** Open a new chat (`Ctrl+Shift+L`) when you switch topics — keeps context relevant.
- **Use lower temperature for SQL** (`temperature: 0.2`) — less creative, more correct. Already set in the config above.
- **Ask it to show its working.** "Write the query AND explain each line" gets you teaching, not just code.
- **When the answer feels wrong, it probably is.** Verify SQL against PostgreSQL docs. Verify Next.js patterns against nextjs.org/docs. Local models hallucinate API surfaces more than Claude does.

## When to fall back to Claude

The local agent is your *daily driver*. Save Claude for:

- Architectural decisions ("should this be one big query or three small ones?")
- Subtle bugs the local model couldn't crack after two attempts
- Code review on a finished week — paste your week's work and ask for issues
- Weeks 5–6 of the plan (advanced SQL, query plan analysis, Prisma migration trade-offs)

A reasonable rhythm: 80% local for day-to-day Q&A, ~1 Claude session per weekend for review and hard problems.

---

## Troubleshooting

**`ollama: command not found` after install (Linux)** — `source ~/.bashrc` or open a new terminal.

**Continue can't reach Ollama** — verify `curl http://localhost:11434/api/tags` returns JSON. If not, Ollama isn't running. Start with `ollama serve` (Linux) or check the tray icon (Windows).

**Model responses are extremely slow** — you may be swapping to disk. Check `free -h` (Linux) or Task Manager (Windows). Drop to a smaller model: `qwen2.5-coder:1.5b` runs in ~2 GB RAM.

**Out of disk space** — models live in `~/.ollama/models` (Linux) or `%USERPROFILE%\.ollama\models` (Windows). Each model is 2–10 GB. Remove unused ones with `ollama rm <name>`.

**Windows: AutoCAD + 3D software make things sluggish** — close them before running the model. The 7B model needs ~6 GB free RAM; if you have 8 GB committed to AutoCAD, Ollama will swap.

**Linux 8 GB feels too tight** — try `qwen2.5-coder:1.5b` instead of 3B. Lower quality but fits comfortably with your IDE and browser open.

---

## What's next

Once this is working, you have a free, private learning companion that can read your code. Combine it with [SQL_NextJS_6Week_Plan.md](SQL_NextJS_6Week_Plan.md):

- During week-1 hour 5 (building `lib/db.ts`), ask the local agent to explain each line as you paste it.
- During week-2 (Server Actions), use `@file actions.ts` and ask "what could go wrong with this?".
- During week-5 (window functions), the local model may struggle — that's the moment to use Claude.

Happy building.
