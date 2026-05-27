import type { ConceptPage } from "../types";

export const architectureConcept: ConceptPage = {
  id: "architecture",
  title: "Architecture",
  description: "Understand the control plane / data plane split, per-project isolation, authentication model, and database schemas.",
  content: [
    {
      type: "heading", level: 2, text: "Control Plane vs Data Plane", id: "control-data-plane",
    },
    {
      type: "prose",
      text: "The platform uses a two-tier architecture. A single shared Control Plane manages organizations, projects, users, and authentication. It provisions a fully isolated Data Plane for each project — including its own Postgres database, API gateway, auth service, storage, and AI service.",
    },
    {
      type: "diagram",
      svgId: "architecture-overview",
      caption: "Request flow from browser through control plane to per-project stack",
      alt: "Architecture diagram: Browser → Next.js Frontend → Control Plane API → Per-Project Stack (Kong API Gateway, GoTrue Auth, PostgREST, Project Service, Postgres with pgvector). The control plane manages routing and authentication while each project gets a fully isolated stack.",
    },
    {
      type: "heading", level: 2, text: "Per-Project Isolation", id: "isolation",
    },
    {
      type: "prose",
      text: "Each project gets its own complete infrastructure stack. This means one project's data, users, and configuration are completely separate from another's. Projects can't see each other's databases, storage buckets, or API keys. This isolation is enforced at the infrastructure level — each project runs its own Postgres instance, its own auth service, and its own AI service worker.",
    },
    {
      type: "heading", level: 2, text: "API Authentication", id: "auth",
    },
    {
      type: "prose",
      text: "Every API request requires two headers: an apikey header and a Bearer token in the Authorization header, both set to the same key. Powabase ships two keys per project, both surfaced in the Studio's Connect modal: the Service Role (Secret) Key gives full access and bypasses Row Level Security — use it for server-side calls only — and the Anon (Publishable) Key respects RLS policies and is safe to embed in browsers and mobile clients.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Never expose the Service Role key",
      text: "The Service Role (Secret) Key bypasses all Row Level Security policies. Only use it in server-side code. For client-side applications, use the Anon (Publishable) Key with appropriate RLS policies. The Connect modal also exposes JWT Secret and Database URL — both must stay server-side.",
    },
    {
      type: "prose",
      text: "Both keys live in the Connect modal in the Studio. Click the Connect button in your project header (or append ?showConnect=true to any project URL) to copy the Project URL, Anon (Publishable) Key, Service Role (Secret) Key, JWT Secret, Database URL, and pre-built Postgres connection strings.",
    },
    {
      type: "heading", level: 2, text: "Request Routing", id: "routing",
    },
    {
      type: "prose",
      text: "When you make an API call, the request first hits the project's Kong API gateway. Kong routes /api/* paths to the Project Service (AI features), /auth/* to GoTrue (authentication), /rest/* to PostgREST (direct database access), and /storage/* to the Storage API. The control plane acts as a reverse proxy, routing requests to the correct project's infrastructure based on the project URL.",
    },
    {
      type: "heading", level: 2, text: "Database Schemas", id: "schemas",
    },
    {
      type: "prose",
      text: "Each project database has four schemas. The ai schema is managed by the platform and stores all AI-related data. The public schema is yours to use for application data. The auth and storage schemas are managed by GoTrue and the Storage API respectively.",
    },
    {
      type: "table",
      headers: ["Schema", "Owner", "Purpose"],
      rows: [
        ["ai", "Platform", "Sources, knowledge bases, chunks, embeddings, agents, sessions, runs, workflows"],
        ["public", "You", "Your application tables, accessible via PostgREST"],
        ["auth", "GoTrue", "User accounts, sessions, tokens"],
        ["storage", "Storage API", "File metadata, bucket configuration"],
      ],
    },
    {
      type: "heading", level: 2, text: "Next Steps", id: "next-steps",
    },
    {
      type: "card-grid",
      cards: [
        {
          title: "Auth & Connection",
          description: "Open the Connect modal, pick the right key, and make your first request.",
          icon: "Plug",
          target: { type: "guide", guideId: "auth-connection" },
        },
        {
          title: "Sources & Extraction",
          description: "Learn how document ingestion works.",
          icon: "FileText",
          target: { type: "concept", conceptId: "sources-extraction" },
        },
        {
          title: "Database Access",
          description: "Query your project database via PostgREST.",
          icon: "Table2",
          target: { type: "concept", conceptId: "database-access" },
        },
      ],
    },
  ],
};
