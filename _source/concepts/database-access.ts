import type { ConceptPage } from "../types";

export const databaseAccessConcept: ConceptPage = {
  id: "database-access",
  title: "Database Access",
  description: "Every project has a full Postgres database accessible via two APIs: the Project Service API for AI-managed data, and PostgREST for direct access to your application tables.",
  content: [
    {
      type: "heading", level: 2, text: "Two APIs, Two Purposes", id: "two-apis",
    },
    {
      type: "prose",
      text: "The Project Service API (/api/*) manages the ai schema — sources, knowledge bases, agents, and all other platform-managed data. You interact with this data through structured endpoints. PostgREST (/rest/v1/*) gives you direct RESTful access to the public schema where your application tables live. Think of the Project Service as the managed AI layer and PostgREST as your application database API.",
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
      text: "PostgREST respects Row Level Security (RLS) policies on your tables. The service_role key bypasses RLS entirely — use it only server-side. The anon key respects RLS policies, so users only see rows they're authorized to access. This is the recommended pattern for client-side applications.",
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
