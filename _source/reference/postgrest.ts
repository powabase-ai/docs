// _source/reference/postgrest.ts
//
// PostgREST is the auto-generated REST API over your project's `public`
// schema. Each Powabase project exposes it at /rest/v1/* on the project
// base URL. Use it to read, insert, update, and delete rows in your own
// application tables — the AI schema is managed separately via the
// Project Service API.

import type { ReferenceSection } from "../types";

export const postgrestReference: ReferenceSection = {
  id: "postgrest",
  title: "Database (PostgREST)",
  description:
    "Direct REST access to your project's public schema. PostgREST exposes every table and view in the public schema as a REST endpoint with rich filtering, ordering, pagination, and embedded relations.",
  introduction:
    "Each project has its own Postgres database. The `ai` schema is managed by Powabase (sources, knowledge bases, agents, sessions, and so on). The `public` schema is yours — create tables, define relationships, add indexes, and PostgREST will expose them automatically at /rest/v1/{table}. PostgREST honours Row Level Security: the Anon (Publishable) Key respects RLS policies, the Service Role (Secret) Key bypasses them — use the service role server-side only. Both keys, plus the Project URL, are in the Studio's Connect modal — click the Connect button in your project header (or append ?showConnect=true to any project URL).",
  commonPatterns:
    "Read with GET /rest/v1/{table} and a select= query parameter. Insert with POST and a JSON body. Update with PATCH and a filter. Delete with DELETE and a filter. Embed related tables with select=*,other(*). Filter operators (eq, gt, lt, like, in, is, ...) follow PostgREST conventions. Always include both apikey and Authorization: Bearer headers, both set to the same key — sending only one returns 401.",
  groups: [
    {
      title: "Reading rows",
      endpoints: [
        {
          method: "GET",
          path: "/rest/v1/{table}",
          description:
            "List rows from a table or view. Use select= to project columns, filter operators (eq, gt, like, in, ...) to filter, order= to sort, limit and offset for pagination. Combine select with embedded relations to fetch joined data in a single request.",
          parameters: [
            { name: "table", in: "path", type: "string", required: true, description: "Table or view name in the public schema" },
            { name: "select", in: "query", type: "string", required: false, description: "Comma-separated columns. Use *,relation(*) to embed related rows. Default: *" },
            { name: "order", in: "query", type: "string", required: false, description: "Order by column, e.g. created_at.desc" },
            { name: "limit", in: "query", type: "integer", required: false, description: "Max rows to return" },
            { name: "offset", in: "query", type: "integer", required: false, description: "Skip the first N rows" },
          ],
          snippets: {
            python: `response = requests.get(f"{BASE_URL}/rest/v1/users?select=id,email&limit=20", headers=headers)`,
            typescript: `const res = await fetch(\`\${BASE_URL}/rest/v1/users?select=id,email&limit=20\`, { headers });`,
            curl: `curl '{BASE_URL}/rest/v1/users?select=id,email&limit=20' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"`,
          },
        },
        {
          method: "GET",
          path: "/rest/v1/{table}?id=eq.{id}",
          description:
            "Read a single row by primary key (or any unique column) using the eq filter. Add Accept: application/vnd.pgrst.object+json to receive a single object instead of an array.",
          parameters: [
            { name: "table", in: "path", type: "string", required: true, description: "Table or view name" },
          ],
          snippets: {
            python: `response = requests.get(f"{BASE_URL}/rest/v1/users?id=eq.{user_id}", headers={**headers, "Accept": "application/vnd.pgrst.object+json"})`,
            typescript: `const res = await fetch(\`\${BASE_URL}/rest/v1/users?id=eq.\${userId}\`, { headers: { ...headers, Accept: "application/vnd.pgrst.object+json" } });`,
            curl: `curl '{BASE_URL}/rest/v1/users?id=eq.{user_id}' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}" -H "Accept: application/vnd.pgrst.object+json"`,
          },
        },
      ],
    },
    {
      title: "Writing rows",
      endpoints: [
        {
          method: "POST",
          path: "/rest/v1/{table}",
          description:
            "Insert one or many rows. Pass a single JSON object or an array. Add Prefer: return=representation to receive the inserted rows back. Use Prefer: resolution=merge-duplicates with on_conflict= for upsert semantics.",
          parameters: [
            { name: "table", in: "path", type: "string", required: true, description: "Target table" },
          ],
          requestBody: `{ "email": "ana@acme.io", "role": "admin" }`,
          snippets: {
            python: `response = requests.post(f"{BASE_URL}/rest/v1/users", headers={**headers, "Prefer": "return=representation"}, json={"email": "ana@acme.io", "role": "admin"})`,
            typescript: `const res = await fetch(\`\${BASE_URL}/rest/v1/users\`, { method: "POST", headers: { ...headers, Prefer: "return=representation" }, body: JSON.stringify({ email: "ana@acme.io", role: "admin" }) });`,
            curl: `curl -X POST '{BASE_URL}/rest/v1/users' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}" -H "Content-Type: application/json" -H "Prefer: return=representation" -d '{"email": "ana@acme.io", "role": "admin"}'`,
          },
        },
        {
          method: "PATCH",
          path: "/rest/v1/{table}",
          description:
            "Update rows that match the filter in the query string. Always include a filter — without one, PATCH updates every row in the table.",
          parameters: [
            { name: "table", in: "path", type: "string", required: true, description: "Target table" },
          ],
          requestBody: `{ "role": "viewer" }`,
          snippets: {
            python: `response = requests.patch(f"{BASE_URL}/rest/v1/users?id=eq.{user_id}", headers=headers, json={"role": "viewer"})`,
            typescript: `await fetch(\`\${BASE_URL}/rest/v1/users?id=eq.\${userId}\`, { method: "PATCH", headers, body: JSON.stringify({ role: "viewer" }) });`,
            curl: `curl -X PATCH '{BASE_URL}/rest/v1/users?id=eq.{user_id}' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}" -H "Content-Type: application/json" -d '{"role": "viewer"}'`,
          },
        },
        {
          method: "DELETE",
          path: "/rest/v1/{table}",
          description:
            "Delete rows that match the filter in the query string. Always include a filter — without one, DELETE removes every row.",
          parameters: [
            { name: "table", in: "path", type: "string", required: true, description: "Target table" },
          ],
          snippets: {
            python: `response = requests.delete(f"{BASE_URL}/rest/v1/users?id=eq.{user_id}", headers=headers)`,
            typescript: `await fetch(\`\${BASE_URL}/rest/v1/users?id=eq.\${userId}\`, { method: "DELETE", headers });`,
            curl: `curl -X DELETE '{BASE_URL}/rest/v1/users?id=eq.{user_id}' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"`,
          },
        },
      ],
    },
    {
      title: "Stored procedures",
      endpoints: [
        {
          method: "POST",
          path: "/rest/v1/rpc/{function_name}",
          description:
            "Call a Postgres function (stored procedure) defined in the public schema. Pass arguments as a JSON body. Functions returning a table are listable like a regular endpoint.",
          parameters: [
            { name: "function_name", in: "path", type: "string", required: true, description: "Postgres function name" },
          ],
          requestBody: `{ "arg1": "value", "arg2": 42 }`,
          snippets: {
            python: `response = requests.post(f"{BASE_URL}/rest/v1/rpc/get_user_stats", headers=headers, json={"user_id": "..."})`,
            typescript: `const res = await fetch(\`\${BASE_URL}/rest/v1/rpc/get_user_stats\`, { method: "POST", headers, body: JSON.stringify({ user_id: "..." }) });`,
            curl: `curl -X POST '{BASE_URL}/rest/v1/rpc/get_user_stats' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}" -H "Content-Type: application/json" -d '{"user_id": "..."}'`,
          },
        },
      ],
    },
  ],
  errorResponses: [
    { status: 401, code: "unauthorized", description: "Missing or invalid apikey/Authorization headers" },
    { status: 403, code: "rls_denied", description: "Row Level Security policy denied the operation for this user" },
    { status: 404, code: "not_found", description: "Table or view does not exist in the public schema" },
    { status: 409, code: "conflict", description: "Insert violated a unique constraint or foreign key" },
    { status: 422, code: "invalid_request", description: "Malformed filter syntax or invalid column reference" },
  ],
};
