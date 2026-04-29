// api/_data/reference/context-handlers.ts
import type { ReferenceSection } from "../types";

export const contextHandlersReference: ReferenceSection = {
  id: "context-handlers",
  title: "Context Handlers",
  description: "Execute standalone knowledge retrieval outside of agent runs. Useful for building custom RAG pipelines.",
  introduction: "Context handlers provide standalone RAG retrieval without requiring an agent. Send a query with one or more knowledge base configurations, and the handler retrieves the most relevant chunks from each knowledge base. This is useful when you want to implement your own LLM integration but still leverage the platform's vector search.",
  commonPatterns: "Execute a context handler with POST /api/context-handlers, providing a query and an array of knowledge_base_configs (each specifying a knowledge_base_id and optional top_k). The response includes the retrieved chunks ranked by relevance, which you can inject into your own LLM prompts.",
  groups: [
    {
      endpoints: [
        {
          method: "GET", path: "/api/context-handlers",
          description: "List context handlers with pagination.",
          snippets: {
            python: `response = requests.get(f"{BASE_URL}/api/context-handlers", headers=headers)`,
            typescript: `const res = await fetch(\`\${BASE_URL}/api/context-handlers\`, { headers });`,
            curl: `curl '{BASE_URL}/api/context-handlers' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"`,
          },
        },
        {
          method: "POST", path: "/api/context-handlers",
          description: "Create and execute a context handler — retrieves relevant chunks from one or more knowledge bases.",
          requestBody: `{\n  "query": "How to get started?",\n  "knowledge_base_configs": [\n    { "id": "kb-uuid", "top_k": 5 }\n  ],\n  "max_context_tokens": 8000\n}`,
          snippets: {
            python: `response = requests.post(f"{BASE_URL}/api/context-handlers", headers=headers, json={\n    "query": "How to get started?",\n    "knowledge_base_configs": [{"id": kb_id, "top_k": 5}],\n    "max_context_tokens": 8000,\n})`,
            typescript: `const res = await fetch(\`\${BASE_URL}/api/context-handlers\`, {\n  method: "POST", headers,\n  body: JSON.stringify({\n    query: "How to get started?",\n    knowledge_base_configs: [{ id: kbId, top_k: 5 }],\n    max_context_tokens: 8000,\n  }),\n});`,
            curl: `curl -X POST '{BASE_URL}/api/context-handlers' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}" -H "Content-Type: application/json" -d '{"query": "How to get started?", "knowledge_base_configs": [{"id": "kb-uuid", "top_k": 5}]}'`,
          },
        },
        {
          method: "GET", path: "/api/context-handlers/{id}",
          description: "Get a context handler result by ID.",
          parameters: [{ name: "id", in: "path", type: "string", required: true, description: "Handler ID" }],
          snippets: {
            python: `response = requests.get(f"{BASE_URL}/api/context-handlers/{handler_id}", headers=headers)`,
            typescript: `const res = await fetch(\`\${BASE_URL}/api/context-handlers/\${handlerId}\`, { headers });`,
            curl: `curl '{BASE_URL}/api/context-handlers/{id}' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"`,
          },
        },
      ],
    },
  ],
  errorResponses: [
    { status: 400, code: "invalid_config", description: "Invalid knowledge base configuration (e.g., missing knowledge_base_id or invalid top_k)" },
  ],
};
