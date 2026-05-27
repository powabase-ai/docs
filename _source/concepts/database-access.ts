import type { ConceptPage } from "../types";

export const databaseAccessConcept: ConceptPage = {
  id: "database-access",
  title: "Database Access",
  description: "Every project has a full Postgres database accessible three ways: the Project Service API for AI-managed data, PostgREST for application tables, and a direct Postgres connection for migrations and admin tooling. All three credentials come from the Studio's Connect modal.",
  content: [
    {
      type: "heading", level: 2, text: "Three Ways In", id: "three-ways",
    },
    {
      type: "prose",
      text: "The Project Service API (/api/*) manages the ai schema — sources, knowledge bases, agents, and all other platform-managed data. You interact with this data through structured endpoints. PostgREST (/rest/v1/*) gives you direct RESTful access to the public schema where your application tables live. And the Database URL is a standard Postgres connection string — drop it into psql, pg, psycopg2, JDBC, SQLAlchemy, or any tool that speaks the Postgres wire protocol for migrations, dashboards, or one-off queries.",
    },
    {
      type: "prose",
      text: "All three need credentials, and all three credentials live in the same place: open the Connect modal in the Studio by clicking the Connect button in the project header (or append ?showConnect=true to any project URL). The \"API Keys\" tab gives you Project URL, Anon (Publishable) Key, Service Role (Secret) Key, JWT Secret, and Database URL; the \"Connection Strings\" tab ships ready-to-paste Postgres snippets in nine formats (URI, PSQL, Node.js, Python, Golang, JDBC, .NET, PHP, SQLAlchemy).",
    },
    {
      type: "heading", level: 2, text: "AI Schema (Managed)", id: "ai-schema",
    },
    {
      type: "prose",
      text: "The ai schema is fully managed by the platform. It contains tables for sources, page_texts, knowledge_bases, chunks (with pgvector embeddings), agents, tool_assignments, sessions, messages, runs, orchestrations, workflows, and more. You should never modify these tables directly — use the Project Service API instead.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Do not modify the ai schema directly",
      text: "The ai schema is managed by the platform and may change between versions. Direct modifications can break platform functionality. Always use the Project Service API endpoints.",
    },
    {
      type: "heading", level: 2, text: "Public Schema (Your Tables)", id: "public-schema",
    },
    {
      type: "prose",
      text: "The public schema is yours. Create tables, define relationships, and add indexes as needed. PostgREST automatically exposes all public schema tables as REST endpoints. You can read, insert, update, and delete rows using standard HTTP methods with powerful filtering operators.",
    },
    {
      type: "heading", level: 2, text: "Row Level Security", id: "rls",
    },
    {
      type: "prose",
      text: "PostgREST respects Row Level Security (RLS) policies on your tables. The Service Role (Secret) Key bypasses RLS entirely — use it only server-side. The Anon (Publishable) Key respects RLS policies, so users only see rows they're authorized to access. This is the recommended pattern for client-side applications.",
    },
    {
      type: "heading", level: 2, text: "Direct Postgres Connection", id: "direct-postgres",
    },
    {
      type: "prose",
      text: "When you need raw SQL — running migrations, hooking up a BI tool, importing a CSV, or wiring an ORM — connect directly to Postgres using the Database URL from the Connect modal. The URL embeds host, port, database, user, and password; treat it like a credential and keep it server-side. The \"Connection Strings\" tab generates the equivalent snippet for psql, Node.js (pg), Python (psycopg2), Go (database/sql), JDBC, .NET, PHP, and SQLAlchemy so you don't have to hand-assemble DSNs.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Database URL is a secret",
      text: "The Database URL contains the database password in cleartext. Never commit it to source control or ship it to a client. Use it only from trusted backends, migration tools, or local dev — and rotate the database password (Studio -> Settings -> Database) if it leaks.",
    },
    {
      type: "table",
      headers: ["Use case", "Best surface", "Key from Connect modal"],
      rows: [
        ["AI workflows (sources, KBs, agents, ...)", "/api/* (Project Service API)", "Service Role (Secret) Key"],
        ["Server-side CRUD on your tables", "/rest/v1/* (PostgREST)", "Service Role (Secret) Key"],
        ["Client-side CRUD under RLS", "/rest/v1/* (PostgREST)", "Anon (Publishable) Key"],
        ["Migrations, BI tools, ORMs, psql", "Postgres wire protocol", "Database URL"],
        ["Verifying user-signed JWTs server-side", "Your own service", "JWT Secret"],
      ],
    },
    {
      type: "heading", level: 2, text: "PostgREST Operators", id: "operators",
    },
    {
      type: "table",
      headers: ["Operator", "Example", "Description"],
      rows: [
        ["eq", "?status=eq.active", "Equal to"],
        ["neq", "?status=neq.deleted", "Not equal to"],
        ["gt", "?age=gt.18", "Greater than"],
        ["gte", "?age=gte.18", "Greater than or equal"],
        ["lt", "?price=lt.100", "Less than"],
        ["lte", "?price=lte.100", "Less than or equal"],
        ["like", "?name=like.*Smith*", "Pattern match (case-sensitive)"],
        ["ilike", "?name=ilike.*smith*", "Pattern match (case-insensitive)"],
        ["is", "?deleted_at=is.null", "IS check (null, true, false)"],
        ["in", "?id=in.(1,2,3)", "In a list of values"],
      ],
    },
    {
      type: "heading", level: 2, text: "Next Steps", id: "next-steps",
    },
    {
      type: "card-grid",
      cards: [
        {
          title: "Database (PostgREST) Reference",
          description: "Auto-generated CRUD docs for your public tables.",
          icon: "Table2",
          target: { type: "reference", sectionId: "postgrest" },
        },
        {
          title: "Auth & Storage Reference",
          description: "Manage users and files via GoTrue and Storage APIs.",
          icon: "Key",
          target: { type: "reference", sectionId: "auth-storage" },
        },
        {
          title: "Architecture",
          description: "Understand the database schema layout.",
          icon: "Server",
          target: { type: "concept", conceptId: "architecture" },
        },
      ],
    },
  ],
};
