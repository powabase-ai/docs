// api/_data/guides/introduction.ts
import type { Guide } from "../types";

export const introductionGuide: Guide = {
  id: "introduction",
  title: "Introduction",
  description:
    "Your project exposes a REST API for AI features — sources, knowledge bases, agents, orchestrations, and workflows. All requests require authentication with your service_role key.",
  introduction:
    "This guide covers the basics: your project URL, authentication headers, and a quick verification request. Once you're set up, you can start building with any part of the API.",
  steps: [
    {
      title: "Your Project URL",
      description:
        "Every project has a unique base URL. All API endpoints are relative to this URL.",
      endpoint: "Base URL",
      snippets: {
        python: `BASE_URL = "{BASE_URL}"`,
        typescript: `const BASE_URL = "{BASE_URL}";`,
        curl: `# Base URL\n{BASE_URL}`,
      },
    },
    {
      title: "Authentication",
      description:
        "Include your service_role key in every request. This key has full access and bypasses Row Level Security — never expose it in client-side code.",
      endpoint: "Headers: apikey + Authorization",
      snippets: {
        python: `import requests

API_KEY = "{API_KEY}"

headers = {
    "apikey": API_KEY,
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
}`,
        typescript: `const API_KEY = "{API_KEY}";

const headers = {
  apikey: API_KEY,
  Authorization: \`Bearer \${API_KEY}\`,
  "Content-Type": "application/json",
};`,
        curl: `# Include in every request:\n-H "apikey: {API_KEY}" \\\n-H "Authorization: Bearer {API_KEY}" \\\n-H "Content-Type: application/json"`,
      },
    },
    {
      title: "Verify Your Setup",
      description:
        "Make a quick request to list agents. If you get an empty array or a list of agents, your setup is working.",
      endpoint: "GET /api/agents",
      snippets: {
        python: `response = requests.get(
    f"{BASE_URL}/api/agents",
    headers=headers,
)
print(response.json())`,
        typescript: `const response = await fetch(\`\${BASE_URL}/api/agents\`, { headers });
const agents = await response.json();
console.log(agents);`,
        curl: `curl '{BASE_URL}/api/agents' \\\n  -H "apikey: {API_KEY}" \\\n  -H "Authorization: Bearer {API_KEY}"`,
      },
      responseExample: `[\n  {\n    "id": "uuid-here",\n    "name": "My Agent",\n    "model": "gpt-4o",\n    "created_at": "2026-01-01T00:00:00Z"\n  }\n]`,
    },
  ],
  whatNext: [
    {
      title: "Quickstart",
      description: "Build an end-to-end RAG agent in 5 minutes.",
      icon: "Rocket",
      target: { type: "guide", guideId: "quickstart" },
    },
    {
      title: "Upload a Document",
      description: "Start ingesting content into the platform.",
      icon: "FileText",
      target: { type: "guide", guideId: "upload-document" },
    },
    {
      title: "Architecture",
      description: "Understand the platform's structure.",
      icon: "Server",
      target: { type: "concept", conceptId: "architecture" },
    },
  ],
};
