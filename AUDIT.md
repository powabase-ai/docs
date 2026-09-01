# Powabase docs audit — v2 (2026-05-29)

Planning document, not user-facing content. Inventories the state of the docs against
the platform reality and recommends a sequence of follow-up PRs.

**This is a full rewrite (v2)** of the original audit. Three independent verifier
passes against v1 found (a) load-bearing errors that would have injected bugs into
the docs if applied, (b) entire missing categories of doc work, and (c) a wrong
framing of "what the BaaS even is." This v2 corrects all of that.

The biggest change: **what counts as "the BaaS"**. v1 framed the audit around the
agentic `/api/*` surface and treated PostgREST/Auth/Storage/Realtime as adjacent
add-ons. The actual product is the **full Supabase-derived stack** with the agentic
`/api/*` layered on top — and crucially, the **agentic `ai.*` schema is itself
queryable via PostgREST under RLS**. v1 ignored this; v2 treats it as a first-class
capability with major docs implications.

---

## TL;DR

- **The BaaS surface is bigger and more capable than v1 suggested.** Users get
  PostgREST on both `public` AND `ai` schemas (the AI surface's own tables —
  sources, knowledge_bases, indexed_sources, chunks, agents, runs, sessions,
  workflows, etc. — are all queryable via `/rest/v1/*` with RLS). The docs need
  to teach this; the convenience `/api/*` layer is one of several legitimate
  entry points, not the only one.
- **Coverage of the typed `/api/*` layer is solid.** 122 of 125 backend routes
  documented (~97.6%), zero ghosts, zero drift after PR #6. Three small gaps,
  one of which is brand-new and was missed in v1.
- **Several existing pages have bugs that throw on copy-paste today.** Two new
  bugs found that v1 missed: a broken graph-save snippet in
  `api-reference/workflows.mdx` (same `"type": "input"` pattern as
  workflows-programmatic), and wrong response shape claim for `/arm`.
- **An entire `api-reference/*.mdx` accuracy sweep was scoped out of v1.** v2
  surfaces it as Part 1.5 with confirmed bugs.
- **Several BaaS infrastructure surfaces aren't documented at all** beyond what
  v1 caught: billing/credits (free-tier 402, 503 path, plan tiers), rate limits
  (workflows `/execute` is 20 req/min returning 429), CORS posture (Kong sets
  `origins: ["*"]` with `credentials: true`), webhook security (bare bearer
  token, no HMAC, no replay protection), backups/PITR, observability
  endpoints.
- **The P0 wedge is now 20 pages / ~6500 lines** after expansion for the
  `ai`-schema-via-PostgREST story, billing, rate limits, and OAuth (which v1
  had as an orphan). At this size the wedge ships as a 5-PR sequence
  (D0-D5), not a single PR.
- **Three v1 claims were materially wrong.** v1 said to delete the `split`
  workflow block type (it exists); v1's "real block types" list was incomplete
  (10 canonical, not 8); v1 claimed a `/graphql/v1` Docker-vs-K8s drift footgun
  that doesn't exist in either config. All corrected here.

---

## Methodology

The audit used four parallel research passes + two follow-ups (v1), then three
parallel verification passes (this v2 revision).

Source-of-truth paths:

- **Docs:** `/home/zipeng/Agentic/Codebase/powabase-docs/`
- **Platform monorepo:** `/home/zipeng/Agentic/Codebase/agentic-monorepo/`
  - Per-project public API: `agentic-platform/packages/agentic-project-service/src/agentic_project_service/routes/*.py` — this is what Kong routes `/api/*` to.
  - Production Kong config: `agentic-platform/packages/agentic-control-plane/src/agentic_control_plane/services/kong_config.py`
  - Per-project stack manifests: `agentic-platform/infra/helm/project-stack/` (K8s, canonical)
  - Per-project Docker template: `agentic-platform/templates/supabase-project/`
  - Studio frontend (what users actually click): `agentic-platform/frontend/apps/studio/`
  - Block / tool / strategy registries: `agentic/src/agentic/`

---

## Part 1 — Critical bugs in `concepts/` and `guides/` (FIX IMMEDIATELY)

These are user-facing bugs in concept and guide pages. **PR A should ship these.**

### Broken snippets — throws on copy-paste

| File | Lines | What's wrong | Fix |
|---|---|---|---|
| `guides/workflows-programmatic.mdx` | 69-80 | PUT /graph uses block types `input` / `llm` / `output` that the backend `BlockRegistry` rejects with 400 "Unknown block type" | Use real types from the 10-type registry (e.g., `starter`, `agent`, `code`, `response`) |
| `guides/upload-document.mdx` | 134-150 | Iterates `pages[i]['page']` / `['text']` but `/page-texts` returns `{"page_texts": [string,...], "count": N}` — array of bare strings, no nested objects | Iterate the string array, or call `?page=N` for `{"text", "page", "count"}` |
| `guides/streaming-guide.mdx` | 111, 124, 151, 164 | Uses `event['step_number']` in 4 places; backend field is `step` | Rename in all 4 places (Python + TS) |

### Wrong response shapes — fake field names

| File | Lines | What's wrong |
|---|---|---|
| `guides/quickstart.mdx` | 134-142 | Upload response shows `filename`, `content_type`, `created_at` — real keys are `name`, `file_type`, `storage_path`, `task_id` |
| `guides/upload-document.mdx` | 61-69 | Same wrong upload response shape |
| `guides/auth-connection.mdx` | 125-136 | `GET /api/agents` example shows a bare array; real shape is `{"agents": [...], "total": N, "limit": L, "offset": O}` (first verification call in the auth guide — users hit it immediately) |
| `guides/create-knowledge-base.mdx` | 64-71 | KB-create response missing `indexing_config` and `retrieval_config`, includes fictional `created_at` |
| `concepts/knowledge-bases-indexing.mdx` | 583-586 | Search snippet uses `chunk['similarity']` and `chunk['content']`; real fields are `score` and `text` |
| `guides/advanced-agent-config.mdx` | 83-91 | MCP response example missing `enabled`, `headers`, `config`, `agent_id`, `updated_at` |

### Wrong field names in request bodies

| File | Lines | What's wrong |
|---|---|---|
| `guides/workflows-programmatic.mdx` | 131, 141, 152 | `/execute` body uses `input`; canonical is `variables` (commit `9794bdf` migrated other places — these were missed) |
| `guides/workflows-copilot.mdx` | 199, 209, 220 | Same `input` → `variables` issue |
| `guides/quickstart.mdx` | 234-241 | Agent-create posts `temperature` at top level — silently dropped; backend wants it nested in `settings` |
| `guides/build-agent.mdx` | 34, 50, 64 | Same `temperature` placement issue |

### Self-contradictions and stale counts

| File | Lines | What's wrong |
|---|---|---|
| `concepts/agents-tools.mdx` | 3 (frontmatter) | Description says "nine builtin tools"; body says eight; truth is **eight**. Frontmatter feeds page descriptions and search snippets. |
| `concepts/platform-comparison.mdx` | 27, 94, 113 | "6 builtin tools" three times; should be **8**. Prospects read this page first. |
| `concepts/platform-comparison.mdx` | 111 | "4 indexing strategies"; should be **5**. Same page already says 5 elsewhere. |
| `concepts/platform-overview.mdx` | 55 | Builtin tool list omits `web_search` and `web_scrape` |
| `concepts/workflows-concept.mdx` | 14-21 | **Block Types table is wrong AND incomplete.** Replace `input, output, llm, agent, condition, code` with the actual registry: **starter, agent, code, condition, general_api, platform_api, response, split, webhook, orchestration** (10 canonical types + back-compat aliases `function` → code and `api_call` → general_api). |

**v1 correction:** v1 told us to delete `split` from `concepts/platform-overview.mdx:75`. That was wrong — `split` IS a real registered block type (`__init__.py:25`). What's actually wrong there is that the line lists 8 types but the registry has 10; `orchestration` is also missing.

### Smaller drift to clean up while you're in there

| File | Lines | What's wrong |
|---|---|---|
| `concepts/architecture.mdx` | 33 | Kong path prefixes are `/auth/v1/`, `/rest/v1/`, `/storage/v1/`, `/realtime/v1/`. Doc says `/auth/*`, `/rest/*`, `/storage/*` — three places need `/v1/` (v1 only caught two). |
| `concepts/architecture.mdx` | 33 | "Control plane acts as a reverse proxy, routing requests to the correct project's infrastructure based on the project URL" — misleading; the control plane is NOT in the data-plane request path. Per-project Kong matches the hostname and routes to the right service. |
| `concepts/sources-extraction.mdx` | 25, 56 | References `/sources/{id}/reextract` and `/cancel` without the `/api/` prefix — inconsistent with the rest of the docs |
| `concepts/knowledge-bases-indexing.mdx` | 38-46 | Implies three user-selectable chunkers (`markdown_header`, `recursive`, `fixed_size`); only `markdown_header` is hardcoded — no `chunker` field exists |
| `concepts/workflows-concept.mdx` | 36 | Arm semantics missing 10-min TTL + deploy distinction. The correct phrasing already exists in `workflows-programmatic.mdx:164` — just port it |
| `guides/advanced-agent-config.mdx` | 36, 53, 72 | MCP `transport: "sse"` everywhere; backend default is `"http"`. Lead with `http`. |
| `guides/orchestration.mdx` | 32-34 | `orchestrator_config.additional_instructions` — backend accepts it as opaque JSON; soft-flag for confirmation that the coordinator actually consumes it |

**Recommended PR: a single "docs: fix broken snippets and stale facts" PR. ~17 files, ~150 line changes.** Files: 10 guides (`workflows-programmatic`, `workflows-copilot`, `quickstart`, `upload-document`, `build-agent`, `streaming-guide`, `auth-connection`, `create-knowledge-base`, `orchestration`, `advanced-agent-config`) + 7 concepts (`platform-overview`, `platform-comparison`, `agents-tools`, `architecture`, `sources-extraction`, `knowledge-bases-indexing`, `workflows-concept`).

---

## Part 1.5 — Reference page accuracy sweep (NEW)

v1 only audited `concepts/` and `guides/`. `api-reference/*.mdx` pages have the same bug pattern. **PR A should also include these.**

### Broken snippets in reference pages

| File | Lines | What's wrong |
|---|---|---|
| `api-reference/workflows.mdx` | 158, 161 | Graph save example uses `"type": "input"` and edge `"input" → "output"` — exact same broken types as the guide. Returns 400 "Unknown block type". |
| `api-reference/workflows.mdx` | 246, 251 | `/arm` doc claims response is `{ webhook_id, secret }`. Backend (`workflows.py:391`) returns `{ "ok": True, "armed_until": <iso8601> }`. `webhook_id` and `webhook_secret` are persisted in the webhook **block config**, not returned here — users must read them from `GET /workflows/{id}` or set them via the graph. |

### Wrong field placements in reference pages

| File | Lines | What's wrong |
|---|---|---|
| `api-reference/agents.mdx` | 55 | `temperature` at top level in `POST /api/agents` body — same bug as quickstart/build-agent. Move into `settings`. |
| `api-reference/agents.mdx` | 377-378, 387-388, 395 | MCP server example uses `"transport": "sse"`; backend default is `"http"`. |

### Missing or wrong response shapes / error tables

| File | Lines | What's wrong |
|---|---|---|
| `api-reference/agents.mdx` | 723 | Error table omits 402 `provider_key_decrypt_failed` (response has extra `code` and `provider` keys) |
| `api-reference/workflows.mdx` | 391-399 | Error table omits 429 from the rate limiter (20/min on `/execute` + `/execute/stream`) |
| `api-reference/knowledge-bases.mdx` | 392-428 (/search) | No response example — users have to guess the shape (the root cause of the `chunk['similarity']` bug in the concept page) |
| `api-reference/sources.mdx` | 185-212 (/page-texts) | No response example — root cause of the upload-document iterate bug |
| `api-reference/webhooks.mdx` | whole page | Doesn't explain that auth is a bare bearer token, with no body HMAC or replay protection beyond the 10-min arm TTL. Doesn't document `?token=` query alternative. |

### Recently shipped — small refinements to PR #6

| File | Lines | Update |
|---|---|---|
| `api-reference/knowledge-bases.mdx` | (the DELETE section from PR #6) | Currently says "Returns 204"; backend returns **200** with `{"message": ..., "deleted_indexed_source_id": ..., "kb_id": ...}` (`knowledge_bases.py:954`). Also: "Cascades to delete the source's chunks" should be expanded to "cascades through 7 child tables: chunks, page_index_nodes, full_documents, doc2json_documents, graph_index_nodes, embeddings, page_index_toc." Also mention: mid-flight indexing tasks (`pending`/`indexing` with a `celery_task_id`) are revoked before the row is deleted. |

### Cross-cutting reference issue

PUT vs PATCH for "update" is inconsistent across resources (`agents=PATCH`, `tools=PUT`, `orchestrations=PUT`, `sources=PATCH`). Each resource documents its own correctly, but the inconsistency isn't explained anywhere. Worth one line on an "API conventions" page (proposed in Part 4).

---

## Part 2 — Typed `/api/*` surface coverage (3 gaps, all in the same package)

Backend at `agentic-platform/packages/agentic-project-service/src/agentic_project_service/routes/`. Per-resource coverage (authoritative counts, post-PR #6):

| Group | Backend | Documented | Undocumented | Drift |
|---|---|---|---|---|
| agents | 24 | 24 | 0 | 0 |
| knowledge-bases (incl. enrichment.py) | 20 | 19 | **1** | 0 |
| orchestrations | 16 | 15 | **1** | 0 |
| sessions | 5 | 5 | 0 | 0 |
| sources | 12 | 12 | 0 | 0 |
| tools | 5 | 5 | 0 | 0 |
| workflows | 13 | 13 | 0 | 0 |
| copilot | 8 | 8 | 0 | 0 |
| context-handlers | 3 | 3 | 0 | 0 |
| ai-provider-keys | 6 | 5 | **1** | 0 |
| settings | 4 | 4 | 0 | 0 |
| database | 7 | 7 | 0 | 0 |
| webhooks | 1 | 1 | 0 | 0 |
| config | 1 | 0 | **1** | 0 |
| **TOTAL** | **125** | **122** | **3** | **0** |

**v1 correction:** v1 said 127 / 124 (97.6%). Actual is 125 / 122 (~97.6%). The percent is similar but the math was wrong — v1 over-counted knowledge-bases (22 vs real 20) and under-counted orchestrations (15 vs real 16), and missed `config.py` entirely.

### Undocumented endpoints

1. **`POST /api/knowledge-bases/{id}/build-bm25`** — `[priority: MED]`
   - Dispatch a one-shot BM25 rebuild; returns 202 + Celery task id
   - Operator/recovery path; users who customize BM25 will reach for it
   - File: `knowledge_bases.py`

2. **`GET /api/ai-provider-keys/platform_supported`** — `[priority: MED]`
   - Returns providers AI-on-us is available for at this pod
   - Naming gotcha: underscore in path (not hyphen) — worth flagging
   - File: `ai_provider_keys.py:83`

3. **`GET /api/config/kb-defaults`** — `[priority: LOW]`
   - Default `indexing_config` and `retrieval_config` for KB-create. Frontend uses it to populate the new-KB form.
   - Useful for power users wiring up custom KB-creation flows.
   - File: `config.py:57`. **v1 missed this entirely.**

Plus: the `orchestrations` row appears 1-short of backend, but on careful comparison the existing docs may already include this — needs a per-method check during PR B drafting. If genuinely undocumented, surface it.

### What's NOT in this count

There's a `/api/health` route, an `/api/webhooks/{id}` endpoint (token-auth, not `@require_auth`), and the `/api/platform/*` proxies on the control-plane that document Auth/Storage admin operations. The 125 count is "per-project public API surface routed by Kong's `/api/sources, /api/knowledge-bases, ...` allowlist." If you also count `/api/health` and `/api/webhooks/*`, the total is 127. That's a definition difference, not a real discrepancy.

**Recommended PR: a single "docs: document missing AI surface endpoints" PR. 3 files touched (`knowledge-bases.mdx`, `ai-provider-keys.mdx`, plus one new `config.mdx` or a section appended to settings), ~100 line additions.**

---

## Part 3 — Platform reality (CONFIRMED, with v1 corrections)

Verified against the K8s production Kong config at
`packages/agentic-control-plane/src/agentic_control_plane/services/kong_config.py`,
the Helm chart at `infra/helm/project-stack/`, and the per-project Docker template.

### Crucial framing the docs need (NEW in v2)

**The BaaS surface is bigger than v1 framed.** Every per-project Powabase project
exposes:

1. **PostgREST `/rest/v1/*` over four schemas: `public`, `storage`, `graphql_public`, AND `ai`.** That last one is the headline — the same tables the agentic `/api/*` layer manages (sources, knowledge_bases, indexed_sources, chunks, agents, agent_sessions, agent_runs, workflows, workflow_executions, etc.) are queryable via PostgREST under RLS.
2. **GoTrue Auth at `/auth/v1/*`** — end-user signup/signin/JWT/OAuth/recovery.
3. **Storage at `/storage/v1/*`** — buckets, objects, signed URLs.
4. **Realtime at `/realtime/v1/`** (WS) + `/realtime/v1/api` (REST) — Broadcast, Presence, postgres_changes.
5. **Agentic `/api/*`** — the typed convenience layer documented today.
6. **Direct PostgreSQL via PgBouncer** — for migrations, ORMs, BI tools.
7. **pg-meta at `/pg/`** — database introspection (Studio uses this).

The current docs frame `/api/*` as "the API" and treat the rest as either undocumented or scoped to a single passing reference. v2 reframes the docs so users see all six entry points as legitimate, with guidance on when to use which.

### Two crucial footguns the docs need to handle

**v1 correction:** v1 listed a third footgun — "the Docker template Kong has a `/graphql/v1` route that production does NOT." Neither config has `/graphql/v1`; the footgun is fictional. Removed.

1. **PgBouncer, not Supavisor**, is the pooler. Connection: `postgresql://<ref>:<password>@db.p.powabase.ai:5432/<ref>` — username AND database both = ref. Only transaction mode. Pool sizing: 20/project, 200 cluster-wide.

2. **GraphQL works via PostgREST RPC, not a dedicated route.** `pg_graphql` is preloaded and `graphql_public` is in the PostgREST schemas list, so `POST /rest/v1/rpc/graphql` works. There is NO `/graphql/v1` Kong route. Worth surfacing because users coming from Supabase will look for `/graphql/v1` and not find it.

### What ships publicly (Kong-routed at `{ref}.p.powabase.ai`)

| Service | Path | Version | Notes |
|---|---|---|---|
| GoTrue (Auth) | `/auth/v1/*` | v2.184.0 | 20 OAuth providers, all default-disabled. SMS/Twilio configured but verify if enabled in production. |
| Storage API | `/storage/v1/*` | v1.33.0 | S3 backend, 50 MB file limit, image transforms via shared imgproxy. Kong skips `key-auth` to allow signed URLs without `apikey`. |
| PostgREST | `/rest/v1/*` | v14.1 | Schemas: `public,storage,graphql_public,ai` |
| Realtime | `/realtime/v1/` (WS) + `/realtime/v1/api` (REST) | v2.65.3 | `preserve_host=true` is critical; without it Realtime returns TenantNotFound 403 on WS upgrade |
| Agentic API | `/api/sources,/api/knowledge-bases,...` (Kong allowlists 11 paths + health + webhooks) | — | already documented |
| pg-meta | `/pg/` | v0.95.1 | **v1 correction:** v1 claimed "service-role-only ACL." Wrong — Kong has no ACL plugin attached; only `cors` and `key-auth`. Both anon and service_role consumers can pass key-auth. Whether the request is ultimately accepted depends on pg-meta's downstream JWT role check, not on Kong. Phrase accordingly in docs. |

### What ships publicly via direct connection (not Kong)

| Service | Connection | Notes |
|---|---|---|
| **PgBouncer** | `postgresql://<ref>:<password>@db.p.powabase.ai:5432/<ref>` | Public LoadBalancer Service. Pool mode `transaction`. max_client_conn=200, default_pool_size=20. |

### What ships but is internal-only / no public route

- **pg_graphql** — extension preloaded; `graphql_public` in PostgREST schemas. Reachable via `POST /rest/v1/rpc/graphql`. NO `/graphql/v1` Kong route in either Docker or K8s.
- **Vault** — extension preloaded but no HTTP route, no Studio UI, no platform code uses it. Reachable only via direct Postgres.
- **pg_net** — preloaded, used internally for DB webhooks via `supabase_functions.http_request()`.
- **Database webhooks** (Postgres → HTTP via pg_net) — schema `supabase_functions`. Reachable only via SQL/Studio. **Distinct from `/api/webhooks`** (agentic workflow webhooks).

### What DOES NOT ship

- **Edge Functions** — no helm deployment, no Kong route. Studio's Functions UI is dead code.
- **pg_cron** — not in memory-locked extensions list, not enabled in any init SQL, no `cron.schedule` usage in platform code. May be available in the postgres image but Powabase doesn't enable or document it.
- **Supavisor** — only exists as upstream-Supabase reference files. PgBouncer is the actual pooler.

### Cross-cutting platform facts the docs should surface (NEW in v2)

These weren't in v1 at all. They affect both architecture/concepts docs and per-endpoint reference pages.

- **Wildcard ALB has a 900s idle timeout** for multimodal SSE streams. Important for the streaming guide.
- **Per-project namespace isolation** — each project gets its own `project-{ref}` namespace with its own Postgres StatefulSet (1Gi memory, 10Gi gp3 PVC). NetworkPolicy restricts ingress to shared-services + control-plane.
- **CORS posture** — production Kong sets `origins: ["*"]` with `credentials: true` on all browser-facing services. Hardcoded; cannot be tightened without re-deploying Kong. Worth a one-line security note.
- **No Kong-level rate limiting in production** despite a comment in `kong_config.py` calling webhooks "rate-limited" (no `rate-limiting` plugin is actually attached). The only real quantitative limit is in-process Flask on the workflows service.
- **Rate limit on workflows** — `/api/workflows/{id}/execute` and `/execute/stream` are limited to 20 requests/minute per user, returning 429. Currently undocumented.
- **Backups & PITR** — Helm ships a `backup-cronjob.yaml` (pg_dump → S3, configurable retention, alarms on absurd-small dumps). Currently no user-facing restore path. Docs should either expose a restore process or explicitly say "internal-only, contact support."
- **Observability endpoints** — project API ships Prometheus `/metrics` and per-request RSS/duration logging. Control plane has `/api/platform/projects/<ref>/observability` (Studio uses it). All undocumented.
- **BYOK key encryption** — BYOK provider keys are Fernet-encrypted using `API_KEY_ENCRYPTION_KEY`. Failure mode surfaces as a `code: "provider_key_decrypt_failed"` field in agent endpoints. Worth one line on the AI provider keys page.
- **Service versions to cite in docs:** gotrue 2.184.0, postgrest 14.1, storage-api 1.33.0, realtime 2.65.3, postgres-meta 0.95.1, postgres 15.8.1.085.

### Confirmed extensions in project DBs

`uuid-ossp`, `pgcrypto`, `vector` (pgvector), `pg_graphql`, `pg_net`, `vault`.

**Not present:** `pg_jsonschema`, `pg_cron`, `pgsodium`.

---

## Part 4 — Missing BaaS coverage

v1's BaaS gap analysis was largely right, but missed entire categories. This v2 reorganizes by surface and adds the missing categories.

### Coverage status by area (reframed)

| Area | Current docs | Needed | Priority |
|---|---|---|---|
| **`ai` schema via PostgREST** | Not mentioned anywhere | Major new doc: how to query the agentic surface's own tables via `/rest/v1/*` under RLS. Recipes for hybrid search over `ai.chunks`, custom dashboards over `ai.agent_runs`, bulk operations against `ai.sources`, etc. | **P0** (new in v2) |
| Auth (GoTrue) — end-user-facing | Only admin proxy documented; zero coverage of `/auth/v1/*` | Reference page, concept page, signup/signin guide, OAuth guide, optional SMS/phone guide | **P0** |
| Storage — end-user-facing | One proxied upload example; zero coverage of `/storage/v1/*` | Reference page, concept page, uploads guide, storage policies page | **P0** |
| Realtime | Absent | Concept, reference (WS protocol — confirm intended audience), subscription guide | **P0** (flagship per team decision) |
| RLS — policy authoring | Mentioned in passing; no how-to | Concept page (auth model + helpers), RLS cookbook (5+ recipes including `ai.*` patterns), RLS testing guide | **P0** |
| BaaS + AI composability | Absent — the differentiating story | Cookbook with 4 recipes (RLS-aware agent context via PostgREST on `ai.*`, build-your-own authenticated chatbot, Storage vs Sources, Realtime + agent runs) | **P0** |
| Connection pooling — PgBouncer specifics | Absent | Pool-mode constraints, what breaks in transaction mode, URL pattern | **P0** |
| Billing / credits / plan tiers (NEW in v2) | Absent | Concept page: free vs paid, what triggers a charge, AI-on-us vs BYOK, 402 / 503 error semantics | **P0** |
| Rate limits (NEW in v2) | Absent | Surface the workflows 20/min limit + 429; note that no other Kong/Flask rate limit exists | **P0** (one short page) |
| PostgREST — advanced | CRUD + 10 operators; missing embedded joins, FTS, JSONB, counting, upserts, partial response, bulk insert | New `/guides/postgrest-advanced` page | **P1** |
| Direct Postgres — depth | One optional step in auth-connection | Direct-postgres patterns guide, migrations, four per-ORM pages | **P1** |
| Webhook security model (NEW in v2) | Absent | Note that webhooks use bare bearer token, no HMAC, no replay window beyond 10-min arm TTL | **P1** |
| Database setup patterns | Studio SQL Editor not documented; pgvector not as user-facing tool | SQL Editor guide, schemas concept, user-managed pgvector, extensions reference, DB webhooks | **P1**/**P2** |
| Glossary / FAQ / pitfalls (NEW in v2) | Absent | Aggregates footguns: temperature placement, `variables` vs `input`, transport `sse` vs `http`, real workflow types, builtin tools bypass RLS, /arm doesn't return secrets, the 7 child-table cascade, etc. | **P1** |
| Migrating from Supabase (NEW in v2) | Absent | What's identical, what's different, what breaks: PgBouncer vs Supavisor, no /graphql/v1, no Edge Functions, no pg_cron, no pg_jsonschema, hosted-only AI surface, free-tier hard cap, different management API | **P1** |
| Observability (NEW in v2) | Absent | Surface `/health`, `/metrics`, the per-project observability endpoint. Even if some are internal-only, document the boundary. | **P2** |
| Backups & DR (NEW in v2) | Absent | Even if "internal-only", a one-page explanation of what's automated and what's user-callable | **P2** |
| Self-host story (NEW in v2) | Implicit (Docker template exists, behavior differs from K8s) | Either supported product (full guide) or explicitly internal-only (single page saying so) | **P2** |
| API access / SDK story (NEW in v2) | Absent | One `concepts/api-access` page documenting raw-HTTP-for-now posture + standard header pattern + forward-looking OpenAPI note. | **P1** |
| API conventions (NEW in v2) | Implicit | One short page: PUT-vs-PATCH inconsistency, header conventions, `apikey` + `Authorization` pattern, common error envelope | **P1** |

### Pages to write — full inventory (revised line estimates)

Estimates revised based on v1 verifier feedback. Some pages were under-estimated; one (`db-webhooks`) was over-estimated.

**Querying `ai.*` via PostgREST (Section 0, NEW in v2):**
- `concepts/ai-schema-postgrest` — Conceptual intro: the `ai.*` schema is queryable via `/rest/v1/*` under RLS, just like `public.*`. Tables exposed: `sources`, `knowledge_bases`, `indexed_sources`, `chunks`, `embeddings`, `agents`, `agent_sessions`, `agent_runs`, `workflows`, `workflow_executions`, `workflow_block_logs`, `context_handlers`, etc. (~200 lines)
- `guides/ai-schema-recipes` — 4 worked examples: (1) custom hybrid search on `ai.chunks`; (2) usage analytics dashboard on `ai.agent_runs`; (3) bulk-tagging sources via `ai.sources` PATCH; (4) cross-KB analytics joining `ai.indexed_sources` and `ai.chunks`. (~300 lines)

**Auth (Section 1):**
- `api-reference/auth` — full `/auth/v1/*` surface. v1 estimated ~700; realistic ~900-1100 because of OAuth methods, factors, SAML, admin endpoints. (~1000)
- `concepts/auth-model` — roles, JWT structure, `auth.uid()`/`auth.jwt()`/`auth.role()`, refresh-token rotation (~250)
- `guides/auth-signup-signin` — email+password + magic link end-to-end (~250)
- `guides/auth-oauth-providers` — Google/GitHub etc. provider config + PKCE flow (~200)
- `concepts/user-metadata` — user_metadata vs app_metadata; security implications (~100)

**Storage (Section 2):**
- `api-reference/storage` — bucket CRUD, object upload/download, signed URLs, multipart, list (~650)
- `concepts/storage-model` — public vs private buckets, MIME allowlists, file size limits, imgproxy (~150)
- `guides/storage-uploads` — browser-direct with anon key, server-side signed URLs, multipart (~250)
- `guides/storage-policies` — RLS on `storage.objects` with 3 copy-paste templates (~150)

**PostgREST advanced (Section 3):**
- Light touch-up to existing `api-reference/postgrest` (cross-link to new guide; 1-paragraph summaries of `Prefer: count`, `Prefer: return`) (~50)
- `guides/postgrest-advanced` — new guide: embedded joins, FTS, JSONB operators, counting, upserts, partial response, bulk insert. 3 worked examples. (~350)

**Realtime (Section 4) — flagship priority:**
- `concepts/realtime` — three channels (Broadcast, Presence, postgres_changes), auth model, `realtime.send()` (~250)
- `api-reference/realtime` — WS protocol, postgres_changes config, broadcast `event`/`payload`, presence track/sync, REST broadcast. (~400)
- `guides/realtime-subscriptions` — 3 patterns: live list, presence cursors, broadcast chat (~300)

**RLS (Section 5):**
- `concepts/rls-model` — roles, JWT-to-session-vars mapping, client-key vs service-key, **how `ai.*` RLS works for cross-tenant safety** (~250 — added `ai.*` notes)
- `guides/rls-policies` — 5+ recipes (owner-only, public-read/auth-write, tenant isolation, role-based, soft-delete, plus **ai.* sample policies** ) (~450)
- `guides/rls-testing` — SQL-level test patterns (~150)

**Direct Postgres (Section 6):**
- `guides/direct-postgres` — pool sizing, prepared statements, transactions, error classes (~250)
- `guides/connection-pooling` — **PgBouncer transaction mode is the ONLY mode**. What breaks (LISTEN/NOTIFY, prepared statements via extended protocol, `SET`, advisory locks). URL pattern with ref-as-user-and-database. Pool sizing. (~200)
- `guides/migrations` — 3 flavors: hand-written SQL, Drizzle, Prisma (~250)
- **Four ORM pages** (revised to ~150-200 each, esp. SQLAlchemy+Alembic which has migration depth):
  - `guides/orm-drizzle` (~150)
  - `guides/orm-prisma` (~150)
  - `guides/orm-sqlalchemy` (~200)
  - `guides/orm-typeorm` (~150)

**Database setup (Section 7):**
- `guides/sql-editor` — Studio SQL Editor (~150)
- `concepts/schemas` — `ai`, `public`, `auth`, `storage`, `extensions`, `supabase_functions` — what each contains, RLS posture (~200)
- `guides/user-pgvector` — user-managed embeddings outside the AI surface (~250). **Caveat:** confirm product wants to encourage this (competes with AI surface for same workload).
- `api-reference/extensions` — preloaded list + what can be `CREATE EXTENSION`-ed (~150)
- `guides/db-webhooks` — `supabase_functions.http_request()` trigger function (~120)

**Billing & rate limits (Section 8, NEW in v2):**
- `concepts/billing-model` — credits, free vs paid plans, what triggers a charge, AI-on-us vs BYOK, 402/503 semantics (~200)
- `concepts/rate-limits` — workflows 20/min, where to expect 429, no other Kong/Flask limits exist (~100)

**Webhook security (Section 9, NEW in v2):**
- Appended to existing `api-reference/webhooks.mdx`: security model section (bare bearer token, no HMAC, no replay) (~80 lines appended, not a new page)

**Composability cookbook (Section 10):**
- `guides/baas-ai-cookbook` — 4 recipes:
  - Recipe 1: **RLS-aware agent context via PostgREST on `ai.*`** (revised: now leverages the v2 ai-schema discovery — much simpler than before, no need to build custom HTTP tool)
  - Recipe 2: Build-your-own authenticated chatbot — explains that the platform does NOT forward end-user JWTs to builtin DB tools, walks through the safe pattern (call the agent run from a trusted backend with service-role; use custom HTTP tools that resolve user identity server-side via opaque session IDs; warn against ever exposing `/api/agents/{id}/run` directly to end users with their own access token)
  - Recipe 3: Storage vs Sources — when to use which
  - Recipe 4: Realtime + agent runs — subscribing to streamed agent output via Realtime broadcast in addition to SSE
  - Total (~800 — revised up from 600; Recipe 2 alone is ~250)

**Cross-cutting (Section 11, NEW in v2):**
- `concepts/glossary` — vocabulary disambiguations (session vs session, run vs execution, webhook vs hook, etc.) (~150)
- `concepts/common-pitfalls` — aggregated footgun list, updated whenever a Part-1-style fix lands (~200)
- `guides/migrating-from-supabase` — what's identical, what differs, what breaks (~300)
- `concepts/api-conventions` — PUT vs PATCH, header pattern, error envelope, response wrapping conventions (~100)

**Operations (Section 12, NEW in v2):**
- `concepts/observability` — `/health`, `/metrics`, project observability endpoint, what's exposed vs internal (~150)
- `concepts/backups-and-dr` — what's automated, what isn't user-callable, what to ask support for (~120)
- `guides/self-host-enterprise` — single page positioning self-host as an enterprise offering: who it's for, what gets deployed (Helm/K8s — pointer to the project-stack chart), the differences from cloud (no shared infra, customer-managed Kong/wildcards, customer-managed backups), and how to engage (sales contact). Don't ship the full deploy runbook publicly — enterprises get that during onboarding. (~150 lines)

**API access (Section 13, NEW in v2 — decided: raw HTTP for now):**
- `concepts/api-access` — one page documenting: Powabase ships no typed SDKs today; raw HTTP via the documented `/api/*`, `/rest/v1/*`, `/auth/v1/*`, `/storage/v1/*`, `/realtime/v1/*` paths is the supported path. Covers the standard `apikey` + `Authorization: Bearer` header pattern, plus a forward-looking note that an OpenAPI spec may ship later. (~120 lines)

### Scope estimate

- **Full coverage:** ~40 new pages (revised up from v1's 27), ~9000-10000 lines of new MDX
- **Plus ~500 lines of touch-ups in existing pages**
- Roughly doubles the existing docs corpus (~9k lines today)

### P0 wedge: 20 pages, ~6500 lines

Expanded from v1's 15 pages / 4750 lines after the team confirmed Realtime as P0,
the v2 reframing surfaced `ai`-schema-via-PostgREST as P0, billing and rate-limits
emerged as P0, and OAuth (orphaned in v1) lands in the wedge.

| Group | Pages | Lines |
|---|---|---|
| `ai` schema via PostgREST (concept + recipes) | 2 | ~500 |
| Auth: reference, concept, signup-signin guide, OAuth guide | 4 | ~1700 |
| Storage: reference, concept, uploads guide, policies | 4 | ~1200 |
| Realtime: concept, reference, subscription guide | 3 | ~950 |
| RLS: model, cookbook, testing | 3 | ~850 |
| BaaS+AI composability cookbook | 1 | ~800 |
| Connection pooling (PgBouncer specifics) | 1 | ~200 |
| Billing & rate-limits concepts | 2 | ~300 |
| **Total** | **20 pages** | **~6500 lines** |

### Decision: single PR or split?

v1's resolved decision #4 said "single PR for the wedge." At v1's 4750-line size
that was already on the edge; v2's ~6500-line size pushes it into "almost
guaranteed merge pain" territory. **Recommend revisiting** — the sub-groupings
map naturally to 4-5 medium PRs that can ship behind a single nav-update PR:

- PR D1: `ai`-schema-via-PostgREST + connection pooling + RLS (foundation; ~1500 lines)
- PR D2: Auth + OAuth (~1700 lines)
- PR D3: Storage (~1200 lines)
- PR D4: Realtime (~950 lines)
- PR D5: Composability cookbook + billing + rate-limits (~1100 lines)
- PR D0 (first): nav structure / new BaaS tab in `docs.json`

That's still effectively one wedge from the user-facing perspective but five
reviewable units.

---

## Part 5 — Recommended sidebar structure

**Add a second top-level tab in `docs.json`** alongside the existing `Documentation`
tab: a `BaaS` tab. (Confirmed team decision from v1.)

Proposed BaaS-tab sidebar groups:

```
Getting Started:
  - Connect modal (link to /guides/auth-connection — cross-tab)
  - Auth quickstart → /guides/auth-signup-signin
  - First authenticated query → /guides/postgrest-advanced (or a small new page)
  - "Database Access" overview → /concepts/database-access (cross-tab)

Auth:
  - Concept: auth model & JWT
  - Reference: /auth/v1/*
  - Signup, signin, magic link
  - OAuth providers
  - User metadata

Database:
  - Concept: schemas & roles
  - Querying the ai schema via PostgREST     ← NEW
  - ai-schema recipes guide                  ← NEW
  - RLS model
  - RLS cookbook
  - RLS testing
  - Studio SQL Editor
  - Migrations
  - ORMs: Drizzle / Prisma / SQLAlchemy / TypeORM
  - Connection pooling (PgBouncer)
  - Direct Postgres patterns
  - Extensions
  - User-managed pgvector
  - Database webhooks
  - API conventions                          ← NEW

PostgREST:
  - Reference (existing, expanded)
  - Advanced query guide

Storage:
  - Concept
  - Reference: /storage/v1/*
  - Upload guide
  - Storage policies

Realtime:
  - Concept
  - Reference (WS protocol)
  - Subscription guide

Operations:                                  ← NEW group
  - Billing & credits
  - Rate limits
  - Observability
  - Backups & disaster recovery
  - Self-host (or "not supported" page)

Reference:                                   ← NEW group
  - Glossary
  - Common pitfalls
  - Migrating from Supabase
  - API access (raw HTTP, no SDKs today)

AI + BaaS Cookbook:
  - 4-recipe composability page
```

The existing `/api-reference/auth-storage` (admin proxy) stays in the AI-surface tab
— it's a control-plane API and belongs with the rest of `/api/platform/*`.

---

## Part 6 — Recommended PR plan

### PR A: "docs: fix broken snippets and stale facts in existing pages"
**~19 files** (revised from v1's ~14): 10 guides + 7 concepts (Part 1) + 2 reference pages (`api-reference/workflows.mdx` and `api-reference/agents.mdx` per Part 1.5). **Ship first** — current Quickstart throws a `KeyError` on step 2.

### PR B: "docs: document 3 missing AI surface endpoints"
**~3 files** (revised from v1's ~2): `knowledge-bases.mdx` + `ai-provider-keys.mdx` + new `config.mdx` (or append to settings). ~100 line additions.

### PR C: "docs: architecture page corrections + add platform-reality notes"
~1 file (`concepts/architecture.mdx`) + small touch-ups. ~50 line changes. Could fold into PR A.

### PR #6 refinements: "docs: tighten the KB DELETE endpoint"
Update PR #6's section: 200 not 204; 7-table cascade; Celery revoke for mid-flight. ~20 line changes. Standalone PR or fold into PR A.

### PR D series: BaaS P0 wedge (5 sequential PRs, ~6500 lines total)
- PR D0: docs.json BaaS tab + empty placeholder pages (so cross-links resolve)
- PR D1: `ai`-schema-via-PostgREST + connection pooling + RLS (~1500 lines)
- PR D2: Auth (~1700 lines)
- PR D3: Storage (~1200 lines)
- PR D4: Realtime (~950 lines)
- PR D5: Composability cookbook + billing + rate-limits (~1100 lines)

### Post-wedge PRs (P1/P2)
- Direct Postgres patterns + 4 ORM pages + migrations
- PostgREST advanced guide
- Database setup: SQL Editor, schemas concept, user-managed pgvector, extensions, DB webhooks
- Cross-cutting: glossary, common pitfalls, migrating-from-Supabase, API conventions
- Operations: billing (already in wedge), observability, backups, self-host-enterprise page
- API access page (raw HTTP, no SDKs today; forward-looking OpenAPI note)
- User metadata vs app metadata short page
- Webhook security model touch-up

---

## Resolved decisions

| # | Question | Resolution |
|---|---|---|
| 1 | Realtime priority | **P0 — flagship feature.** Now in the P0 wedge. |
| 2 | JWT forwarding to agent tools | **Not supported by the platform today.** The composability cookbook teaches "build it yourself with custom HTTP tools" and includes a security warning. |
| 3 | Sidebar structure | **New top-level `BaaS` tab in `docs.json`** alongside `Documentation`. |
| 4 | PR cadence for BaaS rollout | v1 said single PR; **v2 recommends revisiting** — at ~6500 lines, the 5-PR sequence (D0-D5) is more reviewable. |
| 5 | ORM coverage scope | **All four ORMs**: Drizzle, Prisma, SQLAlchemy + Alembic, TypeORM. |
| 6 | `/guides/postgrest-advanced` | **New guide page**. |
| 7 | Connect modal — separate PgBouncer URL? | **The single URL the modal shows IS already the pooler URL.** Connection-pooling guide explains constraints. |
| 8 (NEW) | Is `ai.*` via PostgREST a feature? | **Yes — document it as a feature.** Major addition to the v2 P0 wedge. |
| 9 (NEW) | SDK story | **Raw HTTP for now.** No SDKs ship today. One `concepts/api-access` page documents this with a forward-looking note that an OpenAPI spec may follow later. |
| 10 (NEW) | Self-host story | **Enterprise offering.** Single `guides/self-host-enterprise` page positions it for enterprise customers (Helm-based deploy, sales contact for the full runbook). Not a publicly self-serve product. |
| 11 (NEW) | `user-pgvector` guide | **Soft-flag for product confirmation.** Encouraging this competes with the agentic AI surface for the same workload. Worth a product-team check before drafting. |

---

## What v2 corrected from v1

For traceability. v1 wasn't wrong about most things, but had several material errors.

| v1 claim | v2 correction |
|---|---|
| "127 backend routes, 124 documented, 97.6%" | Actual: 125 / 122, still ~97.6%. v1 over-counted KB (22 vs 20) and under-counted orchestrations (15 vs 16); missed `config.py` entirely. |
| "Delete `split` from `concepts/platform-overview.mdx:75`" | **Wrong — `split` IS a registered block type.** What's actually wrong: the list is incomplete (10 canonical types, not the 7-8 v1 implied). |
| Workflow block types: "starter, webhook, agent, code, condition, platform_api, general_api, response" | **Incomplete.** Real registry: `starter, agent, code, condition, general_api, platform_api, response, split, webhook, orchestration` (10 canonical) + back-compat aliases `function` → code, `api_call` → general_api. |
| Footgun: "Docker has `/graphql/v1` route that production does NOT" | **Fictional.** Neither Docker nor K8s config has `/graphql/v1`. Removed. |
| "pg-meta `/pg/` route → service-role-only ACL" | **Wrong layer.** Kong has no ACL plugin; access is by `key-auth` only. Whether service-role is enforced is up to pg-meta downstream, not Kong. |
| "P0 wedge: 15 pages / 4750 lines" | After reframing + adding `ai`-schema work + billing + rate-limits: **20 pages / ~6500 lines.** |
| TL;DR said wedge is "~10 pages / ~3000 lines" while Part 4 said 15/4750 | v2 keeps all section numbers aligned (need final pass to confirm). |
| OAuth guide orphaned (in inventory, not in any PR) | OAuth now in PR D2 (Auth wedge). |
| API reference accuracy was scoped OUT of Part 1 | **Part 1.5 added.** Confirmed bugs in `workflows.mdx` (block types, `/arm` response) and `agents.mdx` (temperature, MCP transport, missing 402 error). |
| Entire categories absent: billing, rate limits, CORS, webhook security, backups, observability, glossary, migration-from-Supabase, API access (SDK story), API conventions | All added in Part 4 with priorities. |
| Several pages had line estimates clearly too low (Auth ref 700, Cookbook 600, ORMs 100) | Revised: Auth ref 1000, Cookbook 800, ORMs 150-200. |
| KB DELETE endpoint claimed documented + present (PR #6) | Was wrong at time of v1 (endpoint didn't exist). **Now true** as of monorepo commit `0fab22699` (PR #454). PR #6 docs need small refinements (200 not 204, 7-table cascade, Celery revoke). |

---

## Appendix — Files inspected

- Docs: `/home/zipeng/Agentic/Codebase/powabase-docs/{concepts,guides,api-reference}/*.mdx` + `README.md` + `AGENTS.md`
- AI-surface backend (per-project service): `/home/zipeng/Agentic/Codebase/agentic-monorepo/agentic-platform/packages/agentic-project-service/src/agentic_project_service/routes/*.py`
- Production Kong config: `agentic-platform/packages/agentic-control-plane/src/agentic_control_plane/services/kong_config.py`
- Block / tool / strategy registries: `agentic/src/agentic/workflow/blocks/__init__.py`, `agentic-platform/packages/agentic-project-service/src/agentic_project_service/tools/builtin.py`, `agentic-platform/packages/agentic-project-service/src/agentic_project_service/strategies/registry.py`
- Per-project Helm chart: `agentic-platform/infra/helm/project-stack/`
- Per-project Docker template: `agentic-platform/templates/supabase-project/`
- Studio frontend: `agentic-platform/frontend/apps/studio/`
- AI schema definition: `agentic-platform/templates/supabase-project/volumes/db/ai_schema.sql`
