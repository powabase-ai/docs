// api/_data/reference/knowledge-bases.ts
import type { ReferenceSection } from "../types";

export const knowledgeBasesReference: ReferenceSection = {
  id: "knowledge-bases",
  title: "Knowledge Bases",
  description: "Create and manage knowledge bases for semantic search and RAG.",
  introduction: "Knowledge bases provide semantic search over your document content. They store chunked and embedded text from one or more sources, enabling retrieval-augmented generation (RAG). When you add a source to a knowledge base, the platform automatically chunks the source's page texts, generates vector embeddings, and stores them for similarity search.",
  commonPatterns: "Create a knowledge base, add one or more sources to trigger indexing, then use the search endpoint to query. Check indexing status by fetching the knowledge base details. Reindex when you change chunking parameters or want to re-process sources.",
  groups: [
    {
      endpoints: [
        {
          method: "GET", path: "/api/knowledge-bases",
          description: "List all knowledge bases.",
          snippets: {
            python: `response = requests.get(f"{BASE_URL}/api/knowledge-bases", headers=headers)`,
            typescript: `const res = await fetch(\`\${BASE_URL}/api/knowledge-bases\`, { headers });`,
            curl: `curl '{BASE_URL}/api/knowledge-bases' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"`,
          },
        },
        {
          method: "POST", path: "/api/knowledge-bases",
          description: "Create a new knowledge base.",
          requestBody: `{\n  "name": "Product Docs",\n  "description": "Product documentation"\n}`,
          snippets: {
            python: `response = requests.post(f"{BASE_URL}/api/knowledge-bases", headers=headers, json={"name": "Product Docs"})`,
            typescript: `const res = await fetch(\`\${BASE_URL}/api/knowledge-bases\`, { method: "POST", headers, body: JSON.stringify({ name: "Product Docs" }) });`,
            curl: `curl -X POST '{BASE_URL}/api/knowledge-bases' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}" -H "Content-Type: application/json" -d '{"name": "Product Docs"}'`,
          },
        },
        {
          method: "GET", path: "/api/knowledge-bases/{id}",
          description: "Get a knowledge base with its indexed sources and status.",
          parameters: [{ name: "id", in: "path", type: "string", required: true, description: "KB ID" }],
          snippets: {
            python: `response = requests.get(f"{BASE_URL}/api/knowledge-bases/{kb_id}", headers=headers)`,
            typescript: `const res = await fetch(\`\${BASE_URL}/api/knowledge-bases/\${kbId}\`, { headers });`,
            curl: `curl '{BASE_URL}/api/knowledge-bases/{id}' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"`,
          },
        },
        {
          method: "PATCH", path: "/api/knowledge-bases/{id}",
          description: "Update knowledge base configuration or strategy.",
          parameters: [{ name: "id", in: "path", type: "string", required: true, description: "KB ID" }],
          snippets: {
            python: `response = requests.patch(f"{BASE_URL}/api/knowledge-bases/{kb_id}", headers=headers, json={"description": "Updated"})`,
            typescript: `await fetch(\`\${BASE_URL}/api/knowledge-bases/\${kbId}\`, { method: "PATCH", headers, body: JSON.stringify({ description: "Updated" }) });`,
            curl: `curl -X PATCH '{BASE_URL}/api/knowledge-bases/{id}' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}" -H "Content-Type: application/json" -d '{"description": "Updated"}'`,
          },
        },
        {
          method: "DELETE", path: "/api/knowledge-bases/{id}",
          description: "Delete a knowledge base and all its indexed data.",
          parameters: [{ name: "id", in: "path", type: "string", required: true, description: "KB ID" }],
          snippets: {
            python: `response = requests.delete(f"{BASE_URL}/api/knowledge-bases/{kb_id}", headers=headers)`,
            typescript: `await fetch(\`\${BASE_URL}/api/knowledge-bases/\${kbId}\`, { method: "DELETE", headers });`,
            curl: `curl -X DELETE '{BASE_URL}/api/knowledge-bases/{id}' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"`,
          },
        },
        {
          method: "POST", path: "/api/knowledge-bases/{id}/sources",
          description: "Add a source to the knowledge base. Triggers asynchronous indexing.",
          parameters: [{ name: "id", in: "path", type: "string", required: true, description: "KB ID" }],
          requestBody: `{ "source_id": "source-uuid" }`,
          snippets: {
            python: `response = requests.post(f"{BASE_URL}/api/knowledge-bases/{kb_id}/sources", headers=headers, json={"source_id": source_id})`,
            typescript: `await fetch(\`\${BASE_URL}/api/knowledge-bases/\${kbId}/sources\`, { method: "POST", headers, body: JSON.stringify({ source_id: sourceId }) });`,
            curl: `curl -X POST '{BASE_URL}/api/knowledge-bases/{id}/sources' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}" -H "Content-Type: application/json" -d '{"source_id": "uuid"}'`,
          },
        },
        {
          method: "POST", path: "/api/knowledge-bases/{id}/reindex",
          description: "Reindex all sources in the knowledge base.",
          parameters: [{ name: "id", in: "path", type: "string", required: true, description: "KB ID" }],
          snippets: {
            python: `response = requests.post(f"{BASE_URL}/api/knowledge-bases/{kb_id}/reindex", headers=headers)`,
            typescript: `await fetch(\`\${BASE_URL}/api/knowledge-bases/\${kbId}/reindex\`, { method: "POST", headers });`,
            curl: `curl -X POST '{BASE_URL}/api/knowledge-bases/{id}/reindex' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"`,
          },
        },
        {
          method: "POST", path: "/api/knowledge-bases/{id}/search",
          description: "Run a semantic vector search against the knowledge base.",
          parameters: [{ name: "id", in: "path", type: "string", required: true, description: "KB ID" }],
          requestBody: `{ "query": "search text", "top_k": 5 }`,
          snippets: {
            python: `response = requests.post(f"{BASE_URL}/api/knowledge-bases/{kb_id}/search", headers=headers, json={"query": "search text", "top_k": 5})`,
            typescript: `const res = await fetch(\`\${BASE_URL}/api/knowledge-bases/\${kbId}/search\`, { method: "POST", headers, body: JSON.stringify({ query: "search text", top_k: 5 }) });`,
            curl: `curl -X POST '{BASE_URL}/api/knowledge-bases/{id}/search' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}" -H "Content-Type: application/json" -d '{"query": "search text", "top_k": 5}'`,
          },
        },
      ],
    },
  ],
  errorResponses: [
    { status: 400, code: "invalid_config", description: "Invalid chunking or embedding configuration" },
    { status: 404, code: "kb_not_found", description: "No knowledge base exists with the given ID" },
    { status: 409, code: "already_indexing", description: "The knowledge base is already being indexed — wait for completion before reindexing" },
  ],
};
