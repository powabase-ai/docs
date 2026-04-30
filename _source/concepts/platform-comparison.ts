import type { ConceptPage } from "../types";

export const platformComparisonConcept: ConceptPage = {
  id: "platform-comparison",
  title: "Platform Comparison",
  description: "How Powabase compares to popular AI frameworks, RAG services, workflow tools, and backend platforms. Understand where each tool excels and why Powabase's unified approach is different.",
  content: [
    {
      type: "heading", level: 2, text: "The Problem with Assembling Your Own Stack", id: "the-problem",
    },
    {
      type: "prose",
      text: "Building a production AI application typically requires stitching together 5–7 separate tools: a vector database for RAG, an agent framework for tool calling, a workflow engine for automation, an LLM gateway for model routing, an auth system for users, a file storage service for documents, and a database for application state. Each tool has its own API, deployment model, and failure modes. Powabase replaces this entire assembly with a single, unified REST API — one endpoint, one auth model, one database, one deployment.",
    },

    {
      type: "heading", level: 2, text: "Comparison Overview", id: "comparison-overview",
    },
    {
      type: "diagram",
      svgId: "platform-comparison",
      caption: "Powabase covers the full AI application stack in one service",
      alt: "Comparison chart showing feature coverage: Powabase covers RAG, Agents, Workflows, Database, Auth, and Storage. Other platforms cover only subsets.",
    },

    // ─── VS SUPABASE ───────────────────────────────────────────────

    {
      type: "heading", level: 2, text: "vs Supabase", id: "vs-supabase",
    },
    {
      type: "prose",
      text: "Supabase is an excellent general-purpose backend-as-a-service (Postgres, auth, storage, real-time) that Powabase actually builds on — each project's infrastructure uses Supabase components. The difference is purpose: Supabase provides the database and infrastructure primitives common to most SaaS apps, while Powabase provides a good number of prebuilt agentic abstractions on top to accelerate development of AI-native applications.",
    },
    {
      type: "table",
      headers: ["Capability", "Powabase", "Supabase"],
      rows: [
        ["Database", "Postgres + pgvector per project (included)", "Postgres + pgvector (included)"],
        ["Auth & Storage", "GoTrue + Storage API per project (included)", "GoTrue + Storage API (included)"],
        ["Document ingestion", "Upload API → automatic extraction (PDF, DOCX, images w/ OCR)", "No — build your own extraction pipeline"],
        ["RAG pipeline", "4 indexing strategies, 4 retrieval methods, reranking, chunking", "pgvector similarity search only — chunking, embedding, and retrieval pipeline are DIY"],
        ["Agent framework", "ReAct loop, 6 builtin tools, custom tools, MCP, hooks, approval flow", "No agent framework — integrate LangChain or similar"],
        ["Multi-agent orchestration", "Supervisor, Sequential, Parallel strategies", "None"],
        ["Workflow automation", "DAG-based workflows with webhooks, schedules, AI Copilot builder", "Edge Functions (serverless compute, no workflow engine)"],
        ["Streaming", "SSE for agents, orchestrations, and workflows with event lifecycle", "Real-time subscriptions (row-level changes, not AI events)"],
      ],
    },
    {
      type: "prose",
      text: "Choose Supabase when you need a general-purpose backend without AI features. Choose Powabase when your application's core value is AI-powered — you get everything Supabase offers (Postgres, auth, storage, PostgREST) plus a complete AI abstraction layer.",
    },

    // ─── VS LANGCHAIN / LANGGRAPH ──────────────────────────────────

    {
      type: "heading", level: 2, text: "vs LangChain / LangGraph", id: "vs-langchain",
    },
    {
      type: "prose",
      text: "LangChain is the most popular AI framework, and LangGraph extends it with graph-based agent orchestration and durable state. They provide powerful abstractions for building AI applications — but they are frameworks, not infrastructure. You write code using their libraries, then deploy and operate everything yourself.",
    },
    {
      type: "table",
      headers: ["Capability", "Powabase", "LangChain / LangGraph"],
      rows: [
        ["Deployment model", "Managed API — no infrastructure to operate", "Framework — you deploy, scale, and monitor your own services"],
        ["Database", "Postgres + pgvector included per project", "None — bring your own (Pinecone, Weaviate, pgvector, etc.)"],
        ["Auth", "GoTrue included per project", "None — build your own auth layer"],
        ["Document ingestion", "Upload API with automatic extraction", "Document loaders (community-maintained, varying quality)"],
        ["RAG", "4 indexing strategies, 4 retrieval methods, managed pipeline", "Components for assembly — you build and maintain the pipeline"],
        ["Agent framework", "Managed ReAct loop with streaming SSE, tools, hooks, approval", "LangGraph agents with durable state, checkpointing, time-travel debugging"],
        ["Multi-agent", "3 orchestration strategies via API", "Graph-based agent coordination (flexible but complex)"],
        ["Observability", "Run history, events, and usage stored per session", "LangSmith (paid, starts at $39/user/month)"],
        ["Workflow automation", "Visual + API workflow builder with triggers and scheduling", "LangGraph workflows (code-defined, no visual builder in OSS)"],
      ],
    },
    {
      type: "prose",
      text: "Choose LangChain/LangGraph when you need maximum flexibility, custom execution models, or durable agent state with time-travel debugging. Choose Powabase when you want a production-ready API without managing infrastructure — especially if you also need auth, storage, and a database alongside your AI features.",
    },

    // ─── VS AGNO ───────────────────────────────────────────────────

    {
      type: "heading", level: 2, text: "vs Agno", id: "vs-agno",
    },
    {
      type: "prose",
      text: "Agno (formerly Phidata) is a lightweight Python agent framework with built-in agentic RAG and multi-agent teams. It emphasizes simplicity and speed — agents are pure Python objects, not graphs or chains. AgentOS provides a monitoring and management control plane.",
    },
    {
      type: "table",
      headers: ["Capability", "Powabase", "Agno"],
      rows: [
        ["Deployment model", "Managed API with per-project isolation", "Framework — you deploy agents in your own infrastructure"],
        ["Database & Auth", "Postgres + pgvector + GoTrue included", "None — bring your own database and auth"],
        ["RAG pipeline", "4 indexing strategies, 4 retrieval methods, managed document ingestion", "Agentic RAG with hybrid search and reranking — but you manage the vector DB"],
        ["Agent framework", "Managed ReAct with hooks, approval flow, session persistence", "Lightweight agents with tool calling and memory"],
        ["Multi-agent", "3 strategies (Supervisor, Sequential, Parallel) via API", "Teams with role-based collaboration"],
        ["Workflow automation", "DAG workflows with webhooks, schedules, AI Copilot", "Agno Workflows (code-defined sequential/parallel)"],
        ["MCP support", "Runtime tool discovery via MCP servers", "MCP server connections supported"],
        ["Management", "Built-in dashboard, settings, per-project config", "AgentOS control plane (monitoring, playground)"],
      ],
    },
    {
      type: "prose",
      text: "Choose Agno when you want a lightweight Python framework and are comfortable managing your own infrastructure. Choose Powabase when you want a fully managed backend with database, auth, storage, and AI — all accessible via REST API from any language.",
    },

    // ─── VS VECTARA ────────────────────────────────────────────────

    {
      type: "heading", level: 2, text: "vs Vectara", id: "vs-vectara",
    },
    {
      type: "prose",
      text: "Vectara is a fully managed RAG-as-a-Service platform with excellent document processing, hybrid search, and built-in hallucination detection. It's the strongest pure-RAG competitor — but it's RAG-only.",
    },
    {
      type: "table",
      headers: ["Capability", "Powabase", "Vectara"],
      rows: [
        ["RAG pipeline", "4 indexing strategies (ChunkEmbed, PageIndex, GraphIndex, Doc2JSON), 4 retrieval methods, reranking", "ML-based chunking, hybrid search (neural + lexical), Boomerang reranker, hallucination detection"],
        ["Document ingestion", "Upload API, OCR, multi-format extraction", "100+ format ingestion, zero-config"],
        ["Agent framework", "Full ReAct loop with tools, hooks, MCP, streaming", "Limited — vectara-agentic library (thin wrapper on LlamaIndex)"],
        ["Multi-agent orchestration", "3 strategies via API", "None"],
        ["Workflow automation", "DAG workflows with triggers", "None"],
        ["Database for app data", "Postgres + PostgREST for custom tables", "None — document corpus only"],
        ["Auth for end users", "GoTrue with RLS", "API authentication only (not end-user auth)"],
        ["Self-hosting", "Yes (Docker or Kubernetes)", "No — managed cloud only"],
        ["Multi-language support", "API-driven (any language)", "100+ languages for search out of the box"],
      ],
    },
    {
      type: "prose",
      text: "Choose Vectara when RAG is your only need and you want zero-config document processing with best-in-class hallucination detection. Choose Powabase when you need RAG plus agents, orchestration, workflows, a database, and auth — a complete AI application backend.",
    },

    // ─── VS DIFY ───────────────────────────────────────────────────

    {
      type: "heading", level: 2, text: "vs Dify", id: "vs-dify",
    },
    {
      type: "prose",
      text: "Dify is a popular open-source LLM application builder with a visual workflow canvas, built-in RAG, and multiple app types (chatbot, agent, workflow). It's a strong platform for prototyping and building AI apps, especially with its visual interface.",
    },
    {
      type: "table",
      headers: ["Capability", "Powabase", "Dify"],
      rows: [
        ["RAG depth", "4 indexing strategies including tree-based (PageIndex) and structured extraction (Doc2JSON)", "Standard chunking + embedding with configurable strategies"],
        ["Agent framework", "ReAct with hooks, approval flow, MCP, 6 builtin tools", "ReAct agents with tool calling and conversation variables"],
        ["Multi-agent", "3 orchestration strategies (Supervisor, Sequential, Parallel)", "Workflow chaining of LLM/agent nodes (no native multi-agent collaboration)"],
        ["Workflow engine", "API-first DAGs with webhooks, cron/interval schedules", "Visual canvas with branching, loops, error handling"],
        ["Database for app data", "Postgres + PostgREST (your own tables with RLS)", "Internal Postgres only (for Dify state, not user data)"],
        ["Auth for end users", "GoTrue with email/OAuth/magic links", "Admin auth only (no end-user auth, enterprise SSO is paid)"],
        ["API-first design", "Every feature accessible via REST API", "Visual-first design — API is secondary"],
        ["Per-project isolation", "Fully isolated infrastructure per project", "Shared infrastructure, workspace-level isolation"],
      ],
    },
    {
      type: "prose",
      text: "Choose Dify when you want a visual builder for prototyping AI apps quickly, especially if your team prefers drag-and-drop over code. Choose Powabase when you need an API-first backend that your application code calls directly, with deep RAG capabilities, per-project isolation, and included database/auth infrastructure.",
    },

    // ─── VS N8N ────────────────────────────────────────────────────

    {
      type: "heading", level: 2, text: "vs n8n", id: "vs-n8n",
    },
    {
      type: "prose",
      text: "n8n is a powerful general-purpose workflow automation platform with 400+ integration nodes. Its AI capabilities (AI Agent node, LLM nodes, memory nodes) are add-ons to a workflow engine, not purpose-built AI primitives.",
    },
    {
      type: "table",
      headers: ["Capability", "Powabase", "n8n"],
      rows: [
        ["Primary focus", "AI application backend (RAG, agents, orchestration)", "General-purpose workflow automation with AI add-ons"],
        ["RAG pipeline", "Managed end-to-end: ingest, index (4 strategies), retrieve (4 methods), rerank", "None built-in — connect to external vector DBs and embedding APIs via nodes"],
        ["Agent depth", "ReAct with tools, hooks, approval, session memory, streaming", "AI Agent node with tool calling and memory (no approval flow, limited streaming)"],
        ["Integrations", "6 builtin tools, custom HTTP tools, MCP servers", "400+ pre-built integration nodes (Slack, Salesforce, databases, etc.)"],
        ["AI streaming", "SSE with full event lifecycle (tool calls, approval, steps)", "Not designed for streaming AI responses"],
        ["Workflow triggers", "API, webhook, cron/interval schedules", "Manual, webhook, cron, and app-specific triggers"],
      ],
    },
    {
      type: "prose",
      text: "Choose n8n when you need to automate business processes across many SaaS tools and want to add some AI capabilities. Choose Powabase when AI is your application's core function and you need deep RAG, agent, and orchestration capabilities.",
    },

    // ─── VS CREWAI ─────────────────────────────────────────────────

    {
      type: "heading", level: 2, text: "vs CrewAI", id: "vs-crewai",
    },
    {
      type: "prose",
      text: "CrewAI is a Python framework focused on multi-agent orchestration with role-based teams. It excels at modeling agent collaboration patterns — hierarchical delegation, sequential pipelines, and consensual decision-making.",
    },
    {
      type: "table",
      headers: ["Capability", "Powabase", "CrewAI"],
      rows: [
        ["Deployment model", "Managed API", "Framework — deploy in your infrastructure"],
        ["Multi-agent", "3 strategies via API (Supervisor, Sequential, Parallel)", "3 process types (sequential, hierarchical, consensual) — code-defined"],
        ["RAG", "4 indexing strategies, 4 retrieval methods, managed pipeline", "Basic RAG with ChromaDB (no hybrid search, no reranking)"],
        ["Database & Auth", "Postgres + GoTrue included", "None included"],
        ["Workflow automation", "DAG workflows with visual builder and AI Copilot", "CrewAI Flows (code-defined, no visual builder)"],
        ["Human-in-the-loop", "Approval hooks with SSE events and approve endpoint", "None built-in"],
        ["Language support", "REST API — any language", "Python only"],
      ],
    },
    {
      type: "prose",
      text: "Choose CrewAI when you want fine-grained Python control over multi-agent collaboration patterns and are comfortable managing your own infrastructure. Choose Powabase when you want managed multi-agent orchestration with a complete backend (database, auth, RAG) accessible from any language.",
    },

    // ─── SUMMARY ───────────────────────────────────────────────────

    {
      type: "heading", level: 2, text: "What Makes Powabase Different", id: "differentiators",
    },
    {
      type: "table",
      headers: ["Differentiator", "What It Means"],
      rows: [
        ["Unified API", "RAG, agents, orchestration, workflows, database, auth, and storage — all from one REST API with one auth model"],
        ["Deep RAG (not just vector search)", "4 indexing strategies (including LLM-powered tree indexing and structured JSON extraction), 4 retrieval methods, cross-encoder reranking"],
        ["Per-project isolation", "Each project gets its own Postgres, API gateway, auth service, storage, and AI worker — no shared state between projects"],
        ["API-first, language-agnostic", "Every feature works via REST. Build in Python, TypeScript, Go, Rust, or any language that speaks HTTP"],
        ["Human-in-the-loop as a primitive", "Approval hooks pause agent execution via SSE and wait for a decision via API — built into the agent runtime, not bolted on"],
        ["Three orchestration strategies", "Supervisor (autonomous delegation), Sequential (pipeline), Parallel (fan-out + merge) — choose the right pattern for your use case"],
        ["AI Copilot for workflows", "Describe what you want in natural language and the copilot generates the workflow graph"],
        ["Managed infrastructure", "No vector DB to provision, no agent server to deploy, no auth system to build — it's all included and running"],
      ],
    },

    {
      type: "heading", level: 2, text: "Next Steps", id: "next-steps",
    },
    {
      type: "card-grid",
      cards: [
        {
          title: "Platform Overview",
          description: "Understand the three core modules and how they work together.",
          icon: "BookOpen",
          target: { type: "concept", conceptId: "platform-overview" },
        },
        {
          title: "Quickstart",
          description: "Build an end-to-end RAG agent in 5 minutes.",
          icon: "Rocket",
          target: { type: "guide", guideId: "quickstart" },
        },
        {
          title: "Architecture",
          description: "Per-project isolation, database schemas, and request routing.",
          icon: "Server",
          target: { type: "concept", conceptId: "architecture" },
        },
      ],
    },
  ],
};
