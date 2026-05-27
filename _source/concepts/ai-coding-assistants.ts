import type { ConceptPage } from "../types";

export const aiCodingAssistantsConcept: ConceptPage = {
  id: "ai-coding-assistants",
  title: "Using the Platform with AI Coding Assistants",
  description: "Powabase's REST API is designed to be consumed by AI coding assistants like Claude Code, GitHub Copilot, Cursor, and others. This page describes how to integrate effectively and previews our upcoming skill framework.",
  content: [
    {
      type: "heading", level: 2, text: "Why AI Coding Assistants?", id: "why",
    },
    {
      type: "prose",
      text: "The platform's REST API is the primary interface for building AI applications. AI coding assistants can help you write integration code faster by understanding the API structure, generating correct requests, and debugging responses. Because every endpoint follows consistent patterns (authentication, error format, streaming protocol), an AI assistant with the right context can produce production-quality integration code with minimal guidance.",
    },

    {
      type: "heading", level: 2, text: "Getting Started with Claude Code", id: "claude-code",
    },
    {
      type: "prose",
      text: "Claude Code works particularly well with the Powabase API because it can read this documentation, understand the type system, and generate correct API calls in Python, TypeScript, or cURL. To get the best results, provide Claude Code with your project's base URL and API key, and reference the specific API section you're working with.",
    },
    {
      type: "callout",
      variant: "tip",
      title: "Share your project context",
      text: "Grab your Project URL and Service Role (Secret) Key from the Studio's Connect modal (click the Connect button in your project header), then tell your coding assistant: \"I'm building with the Powabase API. My base URL is {BASE_URL} and I'm using the Service Role key for authentication. I need to [create a knowledge base / build an agent / set up a workflow].\" That's enough context for the assistant to generate correct code.",
    },

    {
      type: "heading", level: 2, text: "Common Patterns", id: "patterns",
    },
    {
      type: "prose",
      text: "These are the most common tasks AI coding assistants help with when integrating the Powabase:",
    },
    {
      type: "table",
      headers: ["Task", "What to Ask For", "Key API Endpoints"],
      rows: [
        ["RAG pipeline setup", "Upload documents, create KB, index, and search", "/api/sources/upload, /api/knowledge-bases, /api/knowledge-bases/{id}/search"],
        ["Agent creation", "Create agent with tools and KB, test with streaming", "/api/agents, /api/agents/{id}/tools, /api/agents/{id}/run/stream"],
        ["SSE stream parsing", "Parse Server-Sent Events in your language", "/api/agents/{id}/run/stream (data: {JSON} format)"],
        ["Multi-agent setup", "Create orchestration with entity agents", "/api/orchestrations, /api/orchestrations/{id}/entities"],
        ["Workflow automation", "Build workflow graph with blocks and edges", "/api/workflows, /api/workflows/{id}/graph"],
        ["Webhook integration", "Deploy workflow and set up external trigger", "/api/workflows/{id}/deploy, /api/workflows/{id}/arm"],
      ],
    },

    {
      type: "heading", level: 2, text: "Upcoming: Skill Framework", id: "skill-framework",
    },
    {
      type: "prose",
      text: "We are developing a skill.md framework that will give AI coding assistants deep, structured knowledge of the Powabase API. Instead of relying on general documentation, the skill file will provide the assistant with decision trees, common patterns, error handling strategies, and code templates — enabling it to build complete integrations autonomously.",
    },
    {
      type: "prose",
      text: "The skill framework will include: API reference in a format optimized for LLM consumption, decision logic for choosing indexing strategies and retrieval methods, end-to-end integration templates for common use cases (RAG chatbot, document processing pipeline, multi-agent support team), streaming event parsers for all three languages, and error recovery patterns.",
    },
    {
      type: "callout",
      variant: "info",
      title: "Coming soon",
      text: "The skill.md framework is under active development. When released, you'll be able to add it to your project's CLAUDE.md or .cursorrules file to give your AI assistant full platform knowledge.",
    },

    {
      type: "heading", level: 2, text: "Tips for All AI Assistants", id: "tips",
    },
    {
      type: "prose",
      text: "Regardless of which AI coding assistant you use, these practices will improve your results:",
    },
    {
      type: "table",
      headers: ["Tip", "Why"],
      rows: [
        ["Provide your base URL and API key format", "The assistant can generate ready-to-run code instead of placeholder-filled templates"],
        ["Reference specific API sections", "\"Use the Knowledge Bases API to...\" is more effective than \"set up search\""],
        ["Ask for streaming code in your specific language", "SSE parsing differs significantly between Python (requests), TypeScript (fetch), and Go"],
        ["Request error handling", "The API returns consistent error objects — ask the assistant to handle them"],
        ["Start with the Quickstart pattern", "Upload → Index → Agent → Stream is the canonical flow"],
      ],
    },

    {
      type: "heading", level: 2, text: "Next Steps", id: "next-steps",
    },
    {
      type: "card-grid",
      cards: [
        {
          title: "Quickstart",
          description: "The canonical RAG agent flow to give your AI assistant as context.",
          icon: "Rocket",
          target: { type: "guide", guideId: "quickstart" },
        },
        {
          title: "Streaming & SSE",
          description: "Understand the streaming protocol for code generation.",
          icon: "Radio",
          target: { type: "concept", conceptId: "streaming-patterns" },
        },
        {
          title: "Platform Overview",
          description: "High-level architecture context for your AI assistant.",
          icon: "Server",
          target: { type: "concept", conceptId: "platform-overview" },
        },
      ],
    },
  ],
};
