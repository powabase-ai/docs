import type { ConceptPage } from "../types";

export const platformOverviewConcept: ConceptPage = {
  id: "platform-overview",
  title: "Platform Overview",
  description: "Powabase is a multi-tenant AI Backend-as-a-Service that provides a unified REST API for building production AI applications. It combines three core modules — Context Engineering, Agent Orchestration, and Workflow Automation — that work independently or together.",
  content: [
    {
      type: "heading", level: 2, text: "What is Powabase?", id: "what-is",
    },
    {
      type: "prose",
      text: "Powabase is the infrastructure layer for AI-powered applications. Most teams building with LLMs end up assembling the same stack: a vector database for RAG, an agent framework for tool use, a workflow engine for automation, an auth layer, a file storage service, and a database — then writing the glue code to connect them. Powabase replaces that entire stack with a single API.",
    },
    {
      type: "prose",
      text: "Unlike frameworks like LangChain or Agno that give you libraries to run in your own infrastructure, Powabase is a fully managed backend — you don't deploy or operate anything. Unlike workflow-only tools like n8n or Dify, the platform provides deep AI primitives (multiple indexing strategies, four retrieval algorithms, ReAct agents with tool execution, multi-agent orchestration) alongside automation. And unlike Supabase, which provides a general-purpose backend, Powabase is purpose-built for AI workloads with first-class support for embeddings, vector search, LLM sessions, and streaming.",
    },
    {
      type: "prose",
      text: "Each project gets a fully isolated stack: its own Postgres database with pgvector, API gateway, auth service, file storage, and AI service worker. There is no shared state between projects — isolation is enforced at the infrastructure level.",
    },

    // ─── THREE CORE MODULES ────────────────────────────────────────

    {
      type: "heading", level: 2, text: "Three Core Modules", id: "core-modules",
    },
    {
      type: "prose",
      text: "The platform is organized around three modules that can be used independently or composed together. A simple project might use only Context Engineering for document search. A chatbot uses Context Engineering + Agent Orchestration. A fully automated pipeline uses all three — ingesting documents, reasoning over them with agents, and triggering downstream workflows.",
    },

    // --- Module 1: Context Engineering ---
    {
      type: "heading", level: 3, text: "1. Context Engineering Suite (RAG-as-a-Service)", id: "context-engineering",
    },
    {
      type: "prose",
      text: "The Context Engineering suite handles the entire RAG pipeline: document ingestion, content extraction, indexing, and retrieval. Upload any document — PDFs, Word files, images, spreadsheets — and the platform extracts text (with OCR for scanned pages), then indexes it using the strategy you choose. This isn't a one-size-fits-all chunking pipeline. The platform offers multiple indexing strategies and four retrieval algorithms, each designed for different document types and query patterns.",
    },
    {
      type: "table",
      headers: ["Indexing Strategy", "What It Does", "Best For"],
      rows: [
        ["ChunkEmbed", "Splits text into overlapping chunks and generates vector embeddings", "General RAG — most documents, fastest and cheapest"],
        ["PageIndex", "Builds a hierarchical document tree with LLM-generated summaries", "Long structured PDFs (legal, compliance, specs)"],
        ["GraphIndex", "Extends PageIndex with entity extraction and cross-reference enrichment", "Dense cross-referenced documents (regulations, codebases)"],
        ["Doc2JSON", "Extracts structured fields from documents using a user-defined schema", "Invoices, forms, resumes — structured data extraction"],
      ],
    },
    {
      type: "table",
      headers: ["Retrieval Method", "How It Works", "Best For"],
      rows: [
        ["Vector Search", "Cosine similarity over embeddings", "Fast semantic matching"],
        ["Full-Text Search", "BM25 keyword scoring", "Exact phrases, error codes, IDs"],
        ["Hybrid Search", "Vector + BM25 fused via Reciprocal Rank Fusion", "Production RAG (recommended default)"],
        ["Tree Search", "LLM reasons over document structure to select sections", "PageIndex KBs — complex structural queries"],
      ],
    },
    {
      type: "prose",
      text: "The suite also supports cross-encoder reranking (Cohere, Jina, Voyage, and more) for precision-critical applications, three chunking strategies (recursive, fixed-size, markdown-header), configurable embedding models, and project-level defaults for all parameters. This depth of control is what separates RAG-as-a-Service from a basic vector store.",
    },
    {
      type: "card-grid",
      cards: [
        {
          title: "Knowledge Bases & Indexing",
          description: "Deep dive into every indexing strategy, retrieval algorithm, and configuration option.",
          icon: "Database",
          target: { type: "concept", conceptId: "knowledge-bases-indexing" },
        },
        {
          title: "Sources & Extraction",
          description: "How document ingestion and text extraction works.",
          icon: "FileText",
          target: { type: "concept", conceptId: "sources-extraction" },
        },
      ],
    },

    // --- Module 2: Agent Orchestration ---
    {
      type: "heading", level: 3, text: "2. Agent Orchestration", id: "agent-orchestration",
    },
    {
      type: "prose",
      text: "Agents are LLM-powered conversational entities that use a ReAct (Reason + Act) loop to handle complex tasks. Each agent has a system prompt, a set of tools, optional knowledge bases, and session-based memory. When a user sends a message, the agent reasons about what to do, calls tools as needed, observes the results, and iterates until it can respond — all streamed in real-time via Server-Sent Events.",
    },
    {
      type: "prose",
      text: "Tools come in three forms: builtin tools (database query, database write, HTTP requests, code execution, storage read/write), custom tools (your own endpoints that the platform calls with tool arguments), and MCP servers (external tool providers that the agent discovers at runtime via the Model Context Protocol). For high-stakes operations, the approval flow pauses execution before a tool call and waits for human approval via the API — enabling human-in-the-loop patterns for production deployments.",
    },
    {
      type: "prose",
      text: "Multi-agent orchestrations take this further: a coordinator agent analyzes incoming messages and delegates subtasks to specialized entity agents based on their role descriptions. Each entity runs independently with its own tools and knowledge bases, and the coordinator synthesizes their results. This enables domain-specialized teams — a billing agent, a technical support agent, and a sales agent all coordinated by a single orchestration endpoint.",
    },
    {
      type: "card-grid",
      cards: [
        {
          title: "Agents & Tools",
          description: "The ReAct loop, tool types, sessions, MCP, hooks, and approval flows.",
          icon: "Bot",
          target: { type: "concept", conceptId: "agents-tools" },
        },
        {
          title: "Multi-Agent Orchestration",
          description: "The coordinator pattern for multi-agent collaboration.",
          icon: "Network",
          target: { type: "concept", conceptId: "orchestrations-concept" },
        },
      ],
    },

    // --- Module 3: Workflow Automation ---
    {
      type: "heading", level: 3, text: "3. Workflow Automation", id: "workflow-automation",
    },
    {
      type: "prose",
      text: "Workflows are DAG-based automation pipelines for semi-deterministic tasks. Unlike agents (which decide what to do), workflows follow a fixed graph of blocks and edges — but individual blocks can contain LLM calls, agent runs, or code execution, so the output is still dynamic. Workflows are ideal when you know the steps but the content within each step requires AI reasoning: classify an email, extract fields, route to the right team, send a notification.",
    },
    {
      type: "prose",
      text: "Each workflow is built from composable blocks: starter (manual/API trigger with typed inputs), webhook (HTTP trigger from external systems), agent (run an existing agent with a message), code (execute Python or JavaScript), condition (branch the flow based on expressions), split (parallel fan-out execution), platform_api (call platform resources like knowledge base search or agent runs), general_api (call external HTTP APIs), and response (return results). Blocks reference upstream outputs using template syntax, creating a data pipeline through the graph.",
    },
    {
      type: "prose",
      text: "Workflows support three trigger mechanisms: manual execution via the API, webhook triggers from external systems (Stripe events, GitHub hooks, form submissions), and scheduled execution via interval timers or cron expressions. Once deployed, a workflow becomes a persistent automation that runs unattended. The AI Copilot can also generate workflow graphs from natural language descriptions, accelerating development.",
    },
    {
      type: "card-grid",
      cards: [
        {
          title: "Workflows",
          description: "Block types, graph execution, deployment, and webhooks.",
          icon: "Workflow",
          target: { type: "concept", conceptId: "workflows-concept" },
        },
        {
          title: "Streaming & SSE",
          description: "Real-time events for agents, orchestrations, and workflows.",
          icon: "Radio",
          target: { type: "concept", conceptId: "streaming-patterns" },
        },
      ],
    },

    // ─── HOW THE MODULES WORK TOGETHER ─────────────────────────────

    {
      type: "heading", level: 2, text: "How the Modules Work Together", id: "modules-together",
    },
    {
      type: "prose",
      text: "The three modules are designed to compose. A knowledge base created in the Context Engineering suite can be attached to an agent in the Agent Orchestration module — the agent automatically gets a search tool that queries the KB during conversations. An agent can be used as a block in a workflow, bringing LLM reasoning into a deterministic pipeline. A workflow can call the Platform API block to search knowledge bases, run agents, or query the database programmatically. And webhooks connect workflows to external systems, closing the loop between your AI backend and the rest of your infrastructure.",
    },
    {
      type: "callout",
      variant: "tip",
      title: "Example: End-to-end document processing",
      text: "A webhook-triggered workflow receives a customer question → a platform_api block searches a knowledge base for relevant context → an agent block reasons over the context and drafts a response → a condition block checks confidence → a general_api block posts the answer to Slack or escalates to a human. Each step is a block in the workflow graph, combining all three modules.",
    },
    {
      type: "prose",
      text: "Of course, not all use cases require all modules. The platform is designed to be versatile. You use only the parts you need in order to build your app.",
    },

    // ─── PER-PROJECT INFRASTRUCTURE ────────────────────────────────

    {
      type: "heading", level: 2, text: "Per-Project Infrastructure", id: "infrastructure",
    },
    {
      type: "prose",
      text: "Every project gets a fully isolated infrastructure stack: Postgres with pgvector (your database — both the AI schema and your own tables), Kong API gateway (routing and auth), GoTrue (user authentication), Storage API (file management), and a dedicated AI service worker (document extraction, indexing, agent execution). You get direct PostgREST access to your public schema for building application features alongside AI capabilities, and a full auth system for managing end users.",
    },
    {
      type: "card-grid",
      cards: [
        {
          title: "Architecture",
          description: "Control plane, data plane, per-project isolation, and database schemas.",
          icon: "Server",
          target: { type: "concept", conceptId: "architecture" },
        },
        {
          title: "Database Access",
          description: "Direct PostgREST access to your project database.",
          icon: "Table2",
          target: { type: "concept", conceptId: "database-access" },
        },
      ],
    },

    // ─── GETTING STARTED ───────────────────────────────────────────

    {
      type: "heading", level: 2, text: "Getting Started", id: "getting-started",
    },
    {
      type: "prose",
      text: "The fastest way to see the platform in action is the Quickstart guide, which builds a RAG agent end-to-end in about 5 minutes. If you prefer to understand the architecture first, start with the Architecture page. If you want to explore a specific module, jump directly to its concept page above.",
    },
    {
      type: "card-grid",
      cards: [
        {
          title: "Quickstart",
          description: "Build an end-to-end RAG agent in 5 minutes.",
          icon: "Rocket",
          target: { type: "guide", guideId: "quickstart" },
        },
        {
          title: "Auth & Connection",
          description: "Open the Connect modal, pick the right key, and make your first request.",
          icon: "Plug",
          target: { type: "guide", guideId: "auth-connection" },
        },
        {
          title: "Architecture",
          description: "Understand the control plane, data plane, and per-project isolation.",
          icon: "Server",
          target: { type: "concept", conceptId: "architecture" },
        },
      ],
    },
  ],
};
