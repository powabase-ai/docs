import type { NavSection } from "./types";

export const NAV_SECTIONS: NavSection[] = [
  {
    title: "Getting Started",
    items: [
      { id: "platform-overview", label: "Platform Overview", icon: "BookOpen", selection: { type: "concept", conceptId: "platform-overview" } },
      { id: "auth-connection", label: "Auth & Connection", icon: "Plug", selection: { type: "guide", guideId: "auth-connection" } },
      { id: "quickstart", label: "Quickstart", icon: "Rocket", selection: { type: "guide", guideId: "quickstart" } },
      { id: "platform-comparison", label: "Platform Comparison", icon: "Shield", selection: { type: "concept", conceptId: "platform-comparison" } },
    ],
  },
  {
    title: "Concepts",
    items: [
      { id: "architecture", label: "Architecture", icon: "Server", selection: { type: "concept", conceptId: "architecture" } },
      { id: "sources-extraction", label: "Sources & Extraction", icon: "FileText", selection: { type: "concept", conceptId: "sources-extraction" } },
      { id: "knowledge-bases-indexing", label: "Knowledge Bases & Indexing", icon: "Database", selection: { type: "concept", conceptId: "knowledge-bases-indexing" } },
      { id: "agents-tools", label: "Agents & Tools", icon: "Bot", selection: { type: "concept", conceptId: "agents-tools" } },
      { id: "orchestrations-concept", label: "Multi-Agent Orchestration", icon: "Network", selection: { type: "concept", conceptId: "orchestrations-concept" } },
      { id: "workflows-concept", label: "Workflows", icon: "Workflow", selection: { type: "concept", conceptId: "workflows-concept" } },
      { id: "streaming-patterns", label: "Streaming & SSE", icon: "Radio", selection: { type: "concept", conceptId: "streaming-patterns" } },
      { id: "database-access", label: "Database Access", icon: "Table2", selection: { type: "concept", conceptId: "database-access" } },
      { id: "ai-coding-assistants", label: "AI Coding Assistants", icon: "Code", selection: { type: "concept", conceptId: "ai-coding-assistants" } },
    ],
  },
  {
    title: "Guides",
    items: [
      { id: "upload-document", label: "Upload a Document", icon: "FileText", selection: { type: "guide", guideId: "upload-document" } },
      { id: "create-knowledge-base", label: "Create a Knowledge Base", icon: "Database", selection: { type: "guide", guideId: "create-knowledge-base" } },
      { id: "build-agent", label: "Build an Agent", icon: "Bot", selection: { type: "guide", guideId: "build-agent" } },
      { id: "orchestration", label: "Multi-Agent Orchestration", icon: "Network", selection: { type: "guide", guideId: "orchestration" } },
      { id: "workflows-programmatic", label: "Workflows (Programmatic)", icon: "Workflow", selection: { type: "guide", guideId: "workflows-programmatic" } },
      { id: "workflows-copilot", label: "Workflows (Copilot)", icon: "BrainCircuit", selection: { type: "guide", guideId: "workflows-copilot" } },
      { id: "streaming-guide", label: "Streaming Responses", icon: "Radio", selection: { type: "guide", guideId: "streaming-guide" } },
      { id: "advanced-agent-config", label: "Advanced Agent Config", icon: "Wrench", selection: { type: "guide", guideId: "advanced-agent-config" } },
    ],
  },
  {
    title: "API Reference",
    items: [
      { id: "ref-sources", label: "Sources", icon: "FileText", selection: { type: "reference", sectionId: "sources" } },
      { id: "ref-knowledge-bases", label: "Knowledge Bases", icon: "Database", selection: { type: "reference", sectionId: "knowledge-bases" } },
      { id: "ref-agents", label: "Agents", icon: "Bot", selection: { type: "reference", sectionId: "agents" } },
      { id: "ref-sessions", label: "Sessions", icon: "MessageSquare", selection: { type: "reference", sectionId: "sessions" } },
      { id: "ref-orchestrations", label: "Orchestrations", icon: "Network", selection: { type: "reference", sectionId: "orchestrations" } },
      { id: "ref-workflows", label: "Workflows", icon: "Workflow", selection: { type: "reference", sectionId: "workflows" } },
      { id: "ref-copilot", label: "Copilot", icon: "BrainCircuit", selection: { type: "reference", sectionId: "copilot" } },
      { id: "ref-tools", label: "Tools", icon: "Wrench", selection: { type: "reference", sectionId: "tools" } },
      { id: "ref-context-handlers", label: "Context Handlers", icon: "Layers", selection: { type: "reference", sectionId: "context-handlers" } },
      { id: "ref-postgrest", label: "Database (PostgREST)", icon: "Table2", selection: { type: "reference", sectionId: "postgrest" } },
      { id: "ref-auth-storage", label: "Auth & Storage", icon: "Key", selection: { type: "reference", sectionId: "auth-storage" } },
    ],
  },
];
