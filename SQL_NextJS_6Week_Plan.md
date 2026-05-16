# SQL + Next.js — 6-Week Weekend Learning Plan

Build a Student Management System while learning SQL from CRUD to advanced concepts.

## At a glance

| | |
|---|---|
| **Duration** | 6 weekends × 5 hours = 30 hours total |
| **Database** | PostgreSQL (local install or Neon cloud free tier) |
| **Framework** | Next.js 14+ (App Router) + TypeScript + Tailwind CSS |
| **DB layer** | Raw SQL via `pg` (weeks 1–5), Prisma ORM (week 6) |
| **Project** | Student Management System |
| **Outcome** | Production-style CRUD app + solid SQL fundamentals |

## What you will know by week 6

- Design normalised relational schemas (1:1, 1:N, M:N relationships).
- Write CRUD, JOINs, aggregations, subqueries, CTEs, and window functions confidently.
- Read query plans (EXPLAIN ANALYZE) and add indexes where they matter.
- Build a Next.js App-Router CRUD app with Server Actions and forms.
- Wrap raw SQL behind safe parameterised queries (no SQL injection).
- Migrate a raw-SQL codebase to Prisma and understand the trade-offs.
- Deploy a full-stack app to Vercel with a managed Postgres database.

## How to use this plan

- Each week has roughly five 1-hour blocks; treat them as a guide, not a stopwatch.
- Type every query yourself — do not copy-paste. Muscle memory is the point.
- End each weekend by committing your work to Git with a descriptive message.
- If a topic feels shaky, stay on it. The plan compounds — week 5 needs week 3.
- Keep a `notes.md` with gotchas you hit; review it weekly.

## Project schema (built progressively)

| Table | Columns (highlights) | Introduced |
|---|---|---|
| `students` | id, name, email (unique), dob, enrollment_date | Week 1 |
| `courses` | id, code (unique), title, credits | Week 3 |
| `enrollments` | student_id, course_id, semester (M:N bridge) | Week 3 |
| `grades` | enrollment_id, grade, graded_at | Week 4 |
| `users` | id, email, password_hash, role (for auth) | Week 6 |

---

## Week 1 — Foundations: Postgres, schemas, SELECT, Next.js skeleton

Get a clean environment, create your first table, learn how a Next.js App Router project is wired, and read your first rows from Postgres in a Next.js page. By Sunday night you have a running app that lists students from a real database.

### Hourly breakdown

**Hour 1 — Environment setup**
- Install PostgreSQL locally OR sign up for a free Neon project.
- Install pgAdmin or DBeaver as a GUI client.
- **Output:** Postgres reachable; connection string saved in a notes file.

**Hour 2 — SQL fundamentals: tables & constraints**
- `CREATE DATABASE`, `CREATE TABLE`, data types (INT, TEXT, VARCHAR, DATE, TIMESTAMPTZ, BOOLEAN, IDENTITY).
- Constraints: PRIMARY KEY, NOT NULL, UNIQUE, CHECK, DEFAULT.
- **Output:** `students` table created with proper constraints.

**Hour 3 — Reading data**
- `INSERT` (single and multi-row), `SELECT`, `WHERE`, `AND/OR`, `BETWEEN`, `IN`, `LIKE`, `IS NULL`, `ORDER BY`, `LIMIT/OFFSET`.
- **Output:** 20+ seed rows inserted; 8 SELECT queries written by hand.

**Hour 4 — Next.js project setup**
- `npx create-next-app@latest sms --typescript --tailwind --app`.
- Install `pg` and `dotenv`; add `.env.local` with `DATABASE_URL`.
- **Output:** Next.js dev server running on `localhost:3000`.

**Hour 5 — First DB-backed page**
- Write `lib/db.ts` exporting a singleton `pg.Pool`.
- Build `/students` Server Component that queries and renders all students.
- **Output:** Page shows real DB data.

### SQL concepts introduced
- Data types and choosing the right one (TEXT vs VARCHAR, TIMESTAMPTZ vs TIMESTAMP).
- Constraints: PRIMARY KEY, UNIQUE, NOT NULL, CHECK, DEFAULT.
- Auto-increment IDs: SERIAL vs GENERATED ALWAYS AS IDENTITY (prefer the latter).
- Basic SELECT with WHERE, ORDER BY, LIMIT, OFFSET.
- Pattern matching with LIKE / ILIKE.

### Next.js concepts introduced
- App Router file conventions: `page.tsx`, `layout.tsx`, `loading.tsx`.
- Server Components vs Client Components — the default and when to opt out.
- Reading environment variables on the server only.
- Using `pg` Pool as a module-scope singleton (avoid creating a pool per request).

### Code snippet — minimal `lib/db.ts` (singleton pool)
```ts
import { Pool } from 'pg';
declare global { var pgPool: Pool | undefined; }
export const pool = global.pgPool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
});
if (process.env.NODE_ENV !== 'production') global.pgPool = pool;
```

### Practice exercises
- Return students enrolled in the last 30 days, newest first.
- Return students whose email ends with `@accenture.com`.
- Add a CHECK constraint that ensures `dob` is at least 16 years before today.
- Try inserting 5 rows where email is missing — observe what NOT NULL prevents.
- Make `/students` accept a `?search=` query param that filters by name (use parameterised query, NOT string concat).

### Definition of done
- Repo initialised with Git, first commit made.
- `students` table exists with seed data.
- Visiting `/students` shows live DB rows in a styled table.
- Zero hard-coded SQL parameters — all values pass through `$1`, `$2` placeholders.

> **Safety rule for the whole plan:** never build SQL by concatenating user input. Always use parameterised queries: `pool.query('SELECT ... WHERE name = $1', [name])`. This is the single most important habit to form.

---

## Week 2 — CRUD end-to-end with raw SQL and Server Actions

Turn the read-only page from week 1 into a fully working CRUD app. You will write INSERT / UPDATE / DELETE by hand and learn the Next.js Server Actions pattern that lets a form call server code without writing a separate API route.

### Hourly breakdown

**Hour 1 — UPDATE and DELETE**
- `UPDATE ... SET ... WHERE`, `DELETE FROM ... WHERE`.
- `RETURNING` clause to get back affected rows.
- **Output:** 10 update/delete queries written by hand.

**Hour 2 — Server Actions**
- Build `app/students/actions.ts` with `createStudent`, `updateStudent`, `deleteStudent`.
- Use `revalidatePath` to refresh the list after a mutation.
- **Output:** Three server actions compile and work.

**Hour 3 — Form component**
- Build a `StudentForm` Client Component used for both create and edit.
- Client-side validation + server-side revalidation.
- **Output:** Form posts to the create action.

**Hour 4 — Edit & delete UI**
- Add edit page `/students/[id]/edit` with dynamic route.
- Add delete confirmation. Add success/error flash messages.
- **Output:** Full create/read/update/delete works in the browser.

**Hour 5 — Validation & polish**
- Add Zod validation on the server side.
- Display field-level errors; polish styling with Tailwind.
- **Output:** Invalid email or missing name shows inline error; DB never receives bad data.

### SQL concepts introduced
- UPDATE with WHERE — and the danger of forgetting the WHERE.
- DELETE with WHERE; soft delete vs hard delete (briefly).
- `RETURNING *` — get the new/updated row in a single round trip.
- Conditional UPDATE: only update non-null fields (COALESCE pattern).

### Next.js concepts introduced
- Server Actions (`'use server'`) — what runs where.
- `revalidatePath` and `revalidateTag` for cache invalidation.
- Dynamic routes `[id]`.
- Progressive enhancement — forms work even with JS disabled.
- Zod for input validation at the server boundary.

### Code snippet — server action with parameterised SQL
```ts
'use server';
import { pool } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createStudent(form: FormData) {
  const name = String(form.get('name'));
  const email = String(form.get('email'));
  await pool.query(
    'INSERT INTO students(name, email) VALUES ($1, $2)',
    [name, email]
  );
  revalidatePath('/students');
}
```

### Practice exercises
- Add a `deleted_at` column and change DELETE to UPDATE (soft delete); hide soft-deleted rows from `/students`.
- Make UPDATE skip fields that the form left blank (COALESCE pattern).
- Catch Postgres error code `23505` (unique violation) and show "Email already used".
- Add a server-side rate limit: 5 inserts per minute per IP.
- Add `created_at` / `updated_at` with `DEFAULT now()` and a trigger to update `updated_at`.

### Definition of done
- All four CRUD operations work end-to-end.
- Server actions return clearly typed success/error results.
- No SQL injection surface (parameterised everywhere).
- Form re-renders with field-level errors on invalid submit.

---

## Week 3 — Relationships and JOINs (courses + enrollments)

Move from a single table to a real relational schema. Add courses and a many-to-many enrollments bridge. This is the weekend you internalise INNER, LEFT, RIGHT, FULL OUTER JOINs by building screens that need each one.

### Hourly breakdown

**Hour 1 — Schema design**
- Design `courses` and `enrollments` tables.
- FOREIGN KEY, ON DELETE CASCADE vs RESTRICT vs SET NULL.
- Composite primary keys.
- **Output:** Two new tables created with proper FKs.

**Hour 2 — INNER JOIN**
- Only matching rows. Multi-table joins. Joining on more than one column.
- **Output:** 10 INNER JOIN queries written.

**Hour 3 — Outer joins**
- LEFT JOIN — keep all from the left side; when NULL appears.
- RIGHT JOIN, FULL OUTER JOIN, CROSS JOIN (briefly).
- **Output:** Queries for "students with no enrollments" and "courses with no students".

**Hour 4 — Courses CRUD + enrollment screen**
- Reuse week-2 patterns for courses CRUD.
- Build enrollment page that assigns a student to a course for a semester.
- **Output:** `/courses` and `/enrollments` pages working.

**Hour 5 — Student detail page**
- Build `/students/[id]` showing the student plus all their enrolled courses (single JOIN query, grouped in the UI).
- **Output:** Detail page shows joined data correctly.

### SQL concepts introduced
- FOREIGN KEY constraints and ON DELETE/UPDATE actions.
- INNER JOIN, LEFT/RIGHT/FULL OUTER JOIN, CROSS JOIN.
- Self joins and aliasing tables.
- Joining on composite keys.
- NULL semantics in joins (why `LEFT JOIN + WHERE x IS NULL` is the "anti-join" pattern).

### Next.js concepts introduced
- Composing multiple queries on one page vs one rich JOIN query.
- Shaping query results into nested objects in the data layer (not the JSX).
- Loading UI with `loading.tsx` and Suspense.

### Code snippet — anti-join: students with no enrollments
```sql
SELECT s.id, s.name
FROM students s
LEFT JOIN enrollments e ON e.student_id = s.id
WHERE e.student_id IS NULL;
```

### Practice exercises
- Return each course's title with its enrolled student count, including courses with zero enrolments.
- Find pairs of students who share at least one course (self-join on enrollments).
- Add ON DELETE CASCADE to enrollments → students; observe what happens when you delete a student.
- Build a page that shows a course's roster (course title + list of students).
- Find students enrolled in BOTH course X and course Y — try at least two approaches.

### Definition of done
- Three connected tables with referential integrity.
- Working CRUD for students and courses.
- Enrollment screen that prevents duplicate `(student_id, course_id, semester)` rows.
- At least one screen powered by a JOIN that touches all three tables.

---

## Week 4 — Aggregations, GROUP BY, subqueries (first reports)

Add a `grades` table and build a small reports/dashboard area. This is the medium-SQL weekend: GROUP BY, HAVING, aggregate functions, and subqueries (scalar and correlated). You will also wire up pagination properly.

### Hourly breakdown

**Hour 1 — Aggregates**
- Create `grades` table linked to enrollments; seed realistic grade data.
- COUNT, SUM, AVG, MIN, MAX, FILTER (Postgres-specific conditional aggregate).
- **Output:** `grades` table populated; 10 aggregate queries written.

**Hour 2 — GROUP BY**
- What GROUP BY actually does.
- HAVING vs WHERE (and when each runs).
- GROUPING SETS / ROLLUP / CUBE (briefly).
- **Output:** 5 grouped reports written by hand.

**Hour 3 — Subqueries**
- Scalar, `IN (...)`, `EXISTS (...)`, correlated subqueries.
- When a subquery beats a JOIN and vice versa.
- **Output:** Same report written 3 ways (JOIN, IN, EXISTS) — compared with EXPLAIN.

**Hour 4 — Dashboard page**
- Build `/dashboard`: total students, total courses, avg grade per course, top course by enrolment count.
- **Output:** Dashboard renders four real metrics from SQL.

**Hour 5 — Pagination**
- Server-side pagination for `/students` with `COUNT(*) OVER()` OR a second query.
- Total count + page links.
- **Output:** Pagination works for 200+ rows.

### SQL concepts introduced
- Aggregates: COUNT, SUM, AVG, MIN, MAX; `COUNT(*)` vs `COUNT(col)`.
- GROUP BY rule: every non-aggregated select column must be in the GROUP BY.
- HAVING vs WHERE — which runs before/after aggregation.
- Subquery styles: scalar, IN, EXISTS, correlated, derived tables.
- FILTER clause for conditional aggregates (cleaner than CASE-inside-SUM).
- Pagination patterns: OFFSET/LIMIT vs keyset pagination.

### Next.js concepts introduced
- URL search params as the source of truth for filters and page state.
- `<Link>` prefetching and pagination UX.
- Caching: `force-dynamic` vs default ISR for dashboards.

### Code snippet — conditional aggregate using FILTER
```sql
SELECT
  c.title,
  COUNT(*) AS total_enrolments,
  COUNT(*) FILTER (WHERE g.grade >= 70) AS passes,
  AVG(g.grade) AS avg_grade
FROM courses c
JOIN enrollments e ON e.course_id = c.id
LEFT JOIN grades g ON g.enrollment_id = e.id
GROUP BY c.id
HAVING COUNT(*) >= 3
ORDER BY avg_grade DESC NULLS LAST;
```

### Practice exercises
- Find courses where the average grade is below 50 AND at least 5 students are enrolled.
- Find students whose average grade is in the top 10% (use a subquery on AVG).
- Use EXISTS to find students who have at least one failing grade.
- Write "top 5 courses by enrolment" two ways: subquery and JOIN.
- Add `?from=YYYY-MM-DD&to=YYYY-MM-DD` to the dashboard and pass through safely.

### Definition of done
- `grades` table exists with realistic data spanning multiple semesters.
- `/dashboard` shows at least 4 metrics from real aggregate queries.
- Pagination works on `/students` with correct total count.
- You can explain — out loud — why HAVING and WHERE run at different times.

---

## Week 5 — Advanced SQL: CTEs, window functions, indexes, EXPLAIN

The advanced-SQL weekend. CTEs make complex queries readable; window functions unlock "top N per group" and running totals; EXPLAIN ANALYZE makes you a real engineer who can defend a query plan. You will also add indexes and watch query time drop.

### Hourly breakdown

**Hour 1 — CTEs**
- `WITH ...` — readability, chained CTEs, materialised vs not.
- Recursive CTE — one worked example (org chart or category tree).
- **Output:** Rewrite 2 nested subqueries as CTEs.

**Hour 2 — Window functions**
- `OVER`, `PARTITION BY`, `ORDER BY`.
- ROW_NUMBER, RANK, DENSE_RANK, NTILE, LAG, LEAD.
- `SUM/AVG OVER ()` for running totals.
- **Output:** 5 window-function queries written.

**Hour 3 — Indexes**
- B-tree, partial, multi-column, covering indexes.
- When NOT to add an index.
- Watching `pg_stat_user_indexes`.
- **Output:** Add 3 indexes, verify usage with EXPLAIN.

**Hour 4 — EXPLAIN ANALYZE**
- EXPLAIN vs EXPLAIN ANALYZE.
- Reading the plan: seq scan vs index scan, nested loop vs hash join, rows estimated vs actual.
- **Output:** Three slow queries diagnosed and fixed.

**Hour 5 — Advanced screens**
- Build "top 3 students per course by grade" using a window function.
- Build "grade trend per student" (LAG to compare to previous semester).
- **Output:** Two advanced screens live.

### SQL concepts introduced
- Common Table Expressions (CTEs) and the WITH clause.
- Recursive CTEs for hierarchical / graph-ish data.
- Window functions and the `OVER (PARTITION BY ... ORDER BY ...)` syntax.
- Frame clauses (`ROWS BETWEEN ...` and `RANGE BETWEEN ...`).
- Index types in Postgres (B-tree default; GIN/BRIN exist for special cases).
- Reading EXPLAIN ANALYZE: rows, cost, actual time, loops.

### Next.js concepts introduced
- Server-side data composition — multiple queries stitched in one Server Component.
- Streaming UI with Suspense boundaries for slow analytics queries.

### Code snippet — top 3 students per course (window function)
```sql
WITH ranked AS (
  SELECT
    s.name, c.title, g.grade,
    ROW_NUMBER() OVER (
      PARTITION BY c.id ORDER BY g.grade DESC
    ) AS rn
  FROM grades g
  JOIN enrollments e ON e.id = g.enrollment_id
  JOIN students s ON s.id = e.student_id
  JOIN courses c ON c.id = e.course_id
)
SELECT * FROM ranked WHERE rn <= 3;
```

### Practice exercises
- Use a recursive CTE to build a category tree (add a `categories` table with `parent_id`).
- Use LAG to compute each student's grade change between semesters.
- Use NTILE(4) to label students into quartiles by average grade.
- Add a partial index: `CREATE INDEX ... ON students(email) WHERE deleted_at IS NULL;` and verify it is used.
- Take one slow page (>200ms), capture EXPLAIN ANALYZE before/after adding an index, paste both into your notes.

### Definition of done
- At least one CTE and at least one window function in production code.
- Three useful indexes added with reasoning written in a comment.
- Notes file contains at least one before/after EXPLAIN with timing.
- You can describe — without notes — what PARTITION BY does.

> **Indexing reality check:** add an index only when you have a slow query and EXPLAIN shows a sequential scan on a big table. Indexes cost write performance and disk. "Just add an index" is a smell.

---

## Week 6 — Transactions, Prisma, auth, deploy

Tie everything together. Learn transactions properly, introduce Prisma so you feel what an ORM gives and takes away, add a thin auth layer so the app isn't wide open, and deploy to Vercel + Neon. End the plan with a real URL you can share.

### Hourly breakdown

**Hour 1 — Transactions**
- `BEGIN` / `COMMIT` / `ROLLBACK`.
- Why grading should be transactional.
- Isolation levels (briefly): READ COMMITTED vs SERIALIZABLE.
- **Output:** Wrap the "enrol + create initial grade" flow in a transaction.

**Hour 2 — Prisma intro**
- Install Prisma; run `prisma db pull` to introspect your existing schema.
- Generate the client; compare a Prisma query vs the raw SQL it replaces.
- **Output:** Prisma client generated; one query migrated.

**Hour 3 — Partial migration to Prisma**
- Migrate `students` CRUD from raw `pg` to Prisma.
- Keep one screen on raw SQL on purpose — write a note about when you'd choose each.
- **Output:** Mixed-mode app working.

**Hour 4 — Basic auth**
- `users` table; sign-in with email + password (bcrypt hash).
- iron-session or NextAuth Credentials provider.
- Protect mutation routes.
- **Output:** Login screen + protected `/dashboard`.

**Hour 5 — Deploy**
- Push to GitHub. Deploy to Vercel.
- Move DB to Neon (or keep local + use a tunnel).
- Smoke test the live URL.
- **Output:** Live app reachable; final commit pushed.

### SQL concepts introduced
- Transactions and ACID — what each letter actually guarantees.
- Isolation levels and the anomalies each prevents (dirty read, non-repeatable read, phantom read, serialisation anomaly).
- `SELECT ... FOR UPDATE` and row-level locking (one paragraph is enough at this stage).

### Next.js concepts introduced
- Splitting your data layer: when Prisma helps, when raw SQL is still better (reporting, window-function-heavy queries).
- Auth basics with hashed passwords; never store plain-text.
- Environment management across local / preview / production on Vercel.
- Database connection limits on serverless (use Prisma Data Proxy or PgBouncer pooling).

### Code snippet — transactional enrol-and-grade
```ts
const client = await pool.connect();
try {
  await client.query('BEGIN');
  const e = await client.query(
    'INSERT INTO enrollments(student_id, course_id, semester) VALUES ($1,$2,$3) RETURNING id',
    [studentId, courseId, semester]
  );
  await client.query(
    'INSERT INTO grades(enrollment_id, grade) VALUES ($1, NULL)',
    [e.rows[0].id]
  );
  await client.query('COMMIT');
} catch (err) {
  await client.query('ROLLBACK');
  throw err;
} finally {
  client.release();
}
```

### Practice exercises
- Add a "transfer enrolment from course A to course B" action implemented as a transaction.
- Deliberately throw mid-transaction; verify nothing was written.
- Migrate the courses CRUD to Prisma; compare lines of code and readability with the raw-SQL version.
- Add a `role` column to users (`admin` | `viewer`) and hide mutation buttons for viewers.
- Write a one-page `LEARNED.md` summarising the 5 most surprising things you picked up.

### Definition of done
- At least one multi-statement flow is wrapped in a transaction with rollback tested.
- Prisma is installed and at least one CRUD module uses it.
- App requires login for mutations; passwords are hashed.
- App is deployed to a public URL backed by managed Postgres.
- Git history tells the story: clear commits per week.

> **You did it.** Six weekends, one Student Management System, and SQL that actually sticks. Keep the repo open, keep poking at queries, and bookmark the resources below — the difference between comfortable and confident is another 20 hours of deliberate practice on real problems.

---

## Resources

- **PostgreSQL docs** — postgresql.org/docs (the single best SQL reference).
- **Use The Index, Luke** — use-the-index-luke.com (indexes & query plans).
- **PostgreSQL Tutorial** — postgresqltutorial.com (worked examples).
- **Next.js docs — Data Fetching & Server Actions** — nextjs.org/docs.
- **node-postgres (pg) docs** — node-postgres.com.
- **Prisma docs** — prisma.io/docs (introduce only in week 6).
- **SQLBolt** — sqlbolt.com (10-minute interactive drills).
- **pgexercises.com** — 80+ graded SQL exercises against a real schema.

## After week 6 — where to go next

- Add full-text search (Postgres `tsvector` / `tsquery`).
- Add a reporting page using materialized views and refresh strategies.
- Introduce database migrations properly (Prisma Migrate or Drizzle Kit).
- Add tests: unit (vitest), integration (testcontainers-postgres), e2e (Playwright).
- Learn database backup/restore, role-based access, and row-level security.
- Read *SQL Performance Explained* by Markus Winand — short, transformative.

---

*Plan for gunapathi.selvam@accenture.com. Adjust pace freely — the plan is a scaffold, not a contract.*
