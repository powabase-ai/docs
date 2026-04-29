// api/_data/guides/create-knowledge-base.ts
import type { Guide } from "../types";

export const createKnowledgeBaseGuide: Guide = {
  id: "create-knowledge-base",
  title: "Create a Knowledge Base",
  description:
    "Index your documents for semantic search and retrieval-augmented generation. Knowledge bases chunk, embed, and store your content for fast vector similarity search.",
  prerequisites: ["A completed source (see Upload a Document guide)"],
  introduction:
    "Knowledge bases give your AI agents the ability to search and retrieve relevant information from your documents. This guide walks through creating a KB, adding a source, waiting for indexing, and testing semantic search.",
  steps: [
    {
      title: "Create the knowledge base",
      description:
        "Choose a name and indexing strategy. The default strategy works well for most documents.",
      endpoint: "POST /api/knowledge-bases",
      snippets: {
        python: `response = requests.post(
    f"{BASE_URL}/api/knowledge-bases",
    headers=headers,
    json={
        "name": "Product Docs",
        "description": "Product documentation and guides",
    },
)
kb = response.json()
kb_id = kb["id"]
print(f"KB created: {kb_id}")`,
        typescript: `const response = await fetch(\`\${BASE_URL}/api/knowledge-bases\`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    name: "Product Docs",
    description: "Product documentation and guides",
  }),
});
const kb = await response.json();
console.log("KB created:", kb.id);`,
        curl: `curl -X POST '{BASE_URL}/api/knowledge-bases' \\\n  -H "apikey: {API_KEY}" \\\n  -H "Authorization: Bearer {API_KEY}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"name": "Product Docs", "description": "Product documentation and guides"}'`,
      },
      responseExample: `{\n  "id": "kb-uuid",\n  "name": "Product Docs",\n  "description": "Product documentation and guides",\n  "created_at": "2026-01-01T00:00:00Z"\n}`,
    },
    {
      title: "Add a source to the knowledge base",
      description:
        "Link an uploaded source (from the previous guide) to trigger indexing. The source's extracted content is chunked, embedded, and stored.",
      endpoint: "POST /api/knowledge-bases/{id}/sources",
      snippets: {
        python: `response = requests.post(
    f"{BASE_URL}/api/knowledge-bases/{kb_id}/sources",
    headers=headers,
    json={"source_id": source_id},
)
print(response.json())`,
        typescript: `const response = await fetch(
  \`\${BASE_URL}/api/knowledge-bases/\${kbId}/sources\`,
  {
    method: "POST",
    headers,
    body: JSON.stringify({ source_id: sourceId }),
  },
);
console.log(await response.json());`,
        curl: `curl -X POST '{BASE_URL}/api/knowledge-bases/{kb_id}/sources' \\\n  -H "apikey: {API_KEY}" \\\n  -H "Authorization: Bearer {API_KEY}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"source_id": "{source_id}"}'`,
      },
      notes: "Indexing runs asynchronously. For large documents this can take 30 seconds or more.",
    },
    {
      title: "Check indexing status",
      description:
        "Fetch the knowledge base to see the status of each indexed source. Wait until all sources show 'indexed'.",
      endpoint: "GET /api/knowledge-bases/{id}",
      snippets: {
        python: `response = requests.get(
    f"{BASE_URL}/api/knowledge-bases/{kb_id}",
    headers=headers,
)
kb = response.json()
for src in kb.get("indexed_sources", []):
    print(f"Source {src['source_id']}: {src['index_status']}")`,
        typescript: `const res = await fetch(\`\${BASE_URL}/api/knowledge-bases/\${kbId}\`, { headers });
const kb = await res.json();
kb.indexed_sources?.forEach((s: any) =>
  console.log(\`Source \${s.source_id}: \${s.index_status}\`)
);`,
        curl: `curl '{BASE_URL}/api/knowledge-bases/{kb_id}' \\\n  -H "apikey: {API_KEY}" \\\n  -H "Authorization: Bearer {API_KEY}"`,
      },
    },
    {
      title: "Test search",
      description:
        "Run a semantic search query against the knowledge base to verify indexing worked.",
      endpoint: "POST /api/knowledge-bases/{id}/search",
      snippets: {
        python: `response = requests.post(
    f"{BASE_URL}/api/knowledge-bases/{kb_id}/search",
    headers=headers,
    json={"query": "How do I get started?", "top_k": 5},
)
results = response.json()
for r in results.get("results", []):
    print(f"Score: {r['score']:.3f} — {r['text'][:80]}...")`,
        typescript: `const res = await fetch(\`\${BASE_URL}/api/knowledge-bases/\${kbId}/search\`, {
  method: "POST",
  headers,
  body: JSON.stringify({ query: "How do I get started?", top_k: 5 }),
});
const { results } = await res.json();
results.forEach((r: any) => console.log(\`Score: \${r.score} — \${r.text.slice(0, 80)}...\`));`,
        curl: `curl -X POST '{BASE_URL}/api/knowledge-bases/{kb_id}/search' \\\n  -H "apikey: {API_KEY}" \\\n  -H "Authorization: Bearer {API_KEY}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"query": "How do I get started?", "top_k": 5}'`,
      },
    },
  ],
  whatNext: [
    {
      title: "Build an Agent",
      description: "Create an agent that uses your knowledge base.",
      icon: "Bot",
      target: { type: "guide", guideId: "build-agent" },
    },
    {
      title: "Knowledge Bases & Indexing",
      description: "Deep dive into chunking and embeddings.",
      icon: "Database",
      target: { type: "concept", conceptId: "knowledge-bases-indexing" },
    },
    {
      title: "Knowledge Bases API Reference",
      description: "Full endpoint documentation.",
      icon: "Database",
      target: { type: "reference", sectionId: "knowledge-bases" },
    },
  ],
};
