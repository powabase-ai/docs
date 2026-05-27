// _source/guides/auth-connection.ts
import type { Guide } from "../types";

export const authConnectionGuide: Guide = {
  id: "auth-connection",
  title: "Auth & Connection",
  description:
    "Find your project's credentials in the Connect modal, pick the right key for each surface, and make your first authenticated request.",
  introduction:
    "Every Powabase project surfaces all of its connection details in one place: the **Connect modal** in the Studio. It gives you the Project URL, both API keys (Anon and Service Role), the JWT Secret, the Database URL, and ready-to-paste Postgres connection strings in nine driver formats. Open it once, copy what you need, and you're ready to call any part of the platform.",
  preface: `## Open the Connect modal

In the Studio at [app.powabase.ai](https://app.powabase.ai), click the **Connect** button in the top-right of your project header.

<Frame caption="The Connect button lives in the project header.">
  <img src="/images/connect-button.png" alt="Powabase Studio header with the Connect button highlighted in the top-right corner" />
</Frame>

The dialog has two tabs. **API Keys** lists everything you need to authenticate HTTP and Postgres clients. **Connection Strings** ships pre-filled snippets for psql, Node.js (pg), Python (psycopg2), Go (database/sql), JDBC, .NET, PHP, and SQLAlchemy. Copy buttons sit next to every value, and secret fields hide by default — click the eye icon to reveal.

<Frame caption="The API Keys tab — every credential your project exposes lives here.">
  <img src="/images/connect-modal.png" alt="Connect to your project modal, API Keys tab. Shows Project URL, Anon (Publishable) Key, and three masked fields: Service Role (Secret) Key, JWT Secret, and Database URL." />
</Frame>

<Tip>
You can also open the modal by appending \`?showConnect=true\` to any project URL — handy for deep-linking from internal docs.
</Tip>

## What's in the modal, and where to use each value

| Field | Use it for | Safe to ship to clients? |
| --- | --- | --- |
| **Project URL** | The \`BASE_URL\` for every HTTP call — \`/api/*\`, \`/rest/v1/*\`, \`/auth/*\`, \`/storage/*\` | Yes |
| **Anon (Publishable) Key** | Client-side calls to PostgREST and Storage that respect Row Level Security | Yes |
| **Service Role (Secret) Key** | Server-side calls to \`/api/*\` (AI surface) and any RLS-bypassing PostgREST access | **No — server only** |
| **JWT Secret** | Verifying user-signed JWTs on your own backend | **No — server only** |
| **Database URL** | Direct Postgres access (psql, migrations, ORMs, BI tools) | **No — server only** |

The rest of this guide uses the **Service Role (Secret) Key** as \`API_KEY\` — it authenticates every endpoint under \`/api/*\`, which is what most of the platform docs assume.

<Warning>
Never expose the Service Role key, JWT Secret, or Database URL to a browser, mobile app, or any environment outside your control. The Anon key is the only field in the modal safe to bundle into a client.
</Warning>

## Use it from code`,
  steps: [
    {
      title: "Set your Base URL and headers",
      description:
        "Every request to /api/* and /rest/v1/* needs **both** an `apikey` header and an `Authorization: Bearer` header, set to the same key. Use the Service Role (Secret) Key for /api/* and server-side PostgREST.",
      endpoint: "Headers: apikey + Authorization",
      snippets: {
        python: `import requests

BASE_URL = "{BASE_URL}"   # Connect modal -> Project URL
API_KEY = "{API_KEY}"     # Connect modal -> Service Role (Secret) Key

headers = {
    "apikey": API_KEY,
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
}`,
        typescript: `const BASE_URL = "{BASE_URL}";  // Connect modal -> Project URL
const API_KEY = "{API_KEY}";    // Connect modal -> Service Role (Secret) Key

const headers = {
  apikey: API_KEY,
  Authorization: \`Bearer \${API_KEY}\`,
  "Content-Type": "application/json",
};`,
        curl: `# BASE_URL -> Project URL from the Connect modal
# API_KEY  -> Service Role (Secret) Key from the Connect modal
-H "apikey: {API_KEY}" \\
-H "Authorization: Bearer {API_KEY}" \\
-H "Content-Type: application/json"`,
      },
      notes:
        "Sending only one of the two headers is the most common cause of 401 errors — PostgREST and Kong both reject the request.",
    },
    {
      title: "Verify your setup",
      description:
        "Hit a cheap, idempotent endpoint to confirm the credentials work end-to-end. An empty array and a populated array both count as success.",
      endpoint: "GET /api/agents",
      snippets: {
        python: `response = requests.get(
    f"{BASE_URL}/api/agents",
    headers=headers,
)
print(response.json())`,
        typescript: `const response = await fetch(\`\${BASE_URL}/api/agents\`, { headers });
const agents = await response.json();
console.log(agents);`,
        curl: `curl '{BASE_URL}/api/agents' \\
  -H "apikey: {API_KEY}" \\
  -H "Authorization: Bearer {API_KEY}"`,
      },
      responseExample: `[\n  {\n    "id": "uuid-here",\n    "name": "My Agent",\n    "model": "gpt-4o",\n    "created_at": "2026-01-01T00:00:00Z"\n  }\n]`,
    },
    {
      title: "Connect directly to Postgres (optional)",
      description:
        "For migrations, dashboards, ORMs, or any tool that speaks the Postgres wire protocol, grab the **Database URL** from the API Keys tab — or open the **Connection Strings** tab and copy a pre-built snippet in your language. Use this from servers and trusted environments only.",
      endpoint: "Postgres wire protocol",
      snippets: {
        python: `# Python (psycopg2) — from Connection Strings -> Python
import psycopg2

conn = psycopg2.connect("{POSTGRES_URL}")  # Database URL from the Connect modal
with conn.cursor() as cur:
    cur.execute("select count(*) from public.users")
    print(cur.fetchone())`,
        typescript: `// Node.js (pg) — from Connection Strings -> Node.js
import { Client } from "pg";

const client = new Client({ connectionString: "{POSTGRES_URL}" });  // Database URL
await client.connect();
const { rows } = await client.query("select count(*) from public.users");
console.log(rows);`,
        curl: `# psql — from Connection Strings -> PSQL
psql "{POSTGRES_URL}"`,
      },
      notes:
        "The Database URL embeds the database password in cleartext. Treat it like the Service Role key: never commit it, never expose it client-side, and rotate the database password (Studio → Settings → Database) if it leaks.",
    },
  ],
  whatNext: [
    {
      title: "Quickstart",
      description: "Build an end-to-end RAG agent in 5 minutes.",
      icon: "Rocket",
      target: { type: "guide", guideId: "quickstart" },
    },
    {
      title: "Database Access",
      description: "AI schema vs public schema, plus PostgREST and direct Postgres usage.",
      icon: "Table2",
      target: { type: "concept", conceptId: "database-access" },
    },
    {
      title: "Architecture",
      description: "How Kong routes /api/*, /rest/v1/*, /auth/*, and /storage/* to your project's stack.",
      icon: "Server",
      target: { type: "concept", conceptId: "architecture" },
    },
  ],
};
