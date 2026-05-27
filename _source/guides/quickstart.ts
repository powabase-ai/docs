// api/_data/guides/quickstart.ts
import type { Guide } from "../types";

export const quickstartGuide: Guide = {
  id: "quickstart",
  title: "Quickstart",
  description:
    "Build an end-to-end RAG agent in 5 minutes — from document upload to a streaming conversation.",
  prerequisites: [
    "A Powabase project — grab your Project URL and Service Role (Secret) Key from the Connect modal in the Studio (click the Connect button in your project header, or append ?showConnect=true to any project URL). See the Auth & Connection guide for the full walkthrough.",
  ],
  introduction:
    "In this guide you will upload a document, create a knowledge base, index the document into it, spin up an agent backed by that knowledge base, and run a streaming conversation — all through the REST API. By the end you will have a fully functional RAG agent that can answer questions grounded in your own content.",
  steps: [
    {
      title: "Authenticate",
      description:
        "Set up your base URL and authentication headers. Copy Project URL and Service Role (Secret) Key from the Studio's Connect modal — every /api/* request needs the service role key in both the apikey and Authorization headers.",
      endpoint: "Headers: apikey + Authorization",
      snippets: {
        python: `import requests

BASE_URL = "{BASE_URL}"   # Connect modal -> Project URL
API_KEY = "{API_KEY}"     # Connect modal -> Service Role (Secret) Key

headers = {
    "apikey": API_KEY,
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
}`,
        typescript: `const BASE_URL = "{BASE_URL}";  // Connect modal -> Project URL
const API_KEY = "{API_KEY}";    // Connect modal -> Service Role (Secret) Key

const headers = {
  apikey: API_KEY,
  Authorization: \`Bearer \${API_KEY}\`,
  "Content-Type": "application/json",
};`,
        curl: `# Set these variables for the rest of the guide.
# Both values come from the Studio's Connect modal:
#   BASE_URL = Project URL
#   API_KEY  = Service Role (Secret) Key
BASE_URL="{BASE_URL}"
API_KEY="{API_KEY}"`,
      },
    },
    {
      title: "Upload a document",
      description:
        "Upload a file to create a Source. The platform automatically extracts its text content for indexing.",
      endpoint: "POST /api/sources/upload",
      snippets: {
        python: `with open("product-docs.pdf", "rb") as f:
    response = requests.post(
        f"{BASE_URL}/api/sources/upload",
        headers={"apikey": API_KEY, "Authorization": f"Bearer {API_KEY}"},
        files={"file": ("product-docs.pdf", f, "application/pdf")},
    )
source = response.json()
source_id = source["id"]
print(f"Source created: {source_id}, status: {source['extraction_status']}")

# Poll until extraction completes
import time
TERMINAL = {"extracted", "attention_required", "failed", "cancelled"}
while True:
    res = requests.get(f"{BASE_URL}/api/sources/{source_id}", headers=headers)
    status = res.json()["extraction_status"]
    if status in TERMINAL:
        print(f"Extraction ended with status: {status}")
        break
    time.sleep(2)`,
        typescript: `const formData = new FormData();
formData.append("file", fileBlob, "product-docs.pdf");

const uploadRes = await fetch(\`\${BASE_URL}/api/sources/upload\`, {
  method: "POST",
  headers: { apikey: API_KEY, Authorization: \`Bearer \${API_KEY}\` },
  body: formData,
});
const source = await uploadRes.json();
const sourceId = source.id;
console.log("Source created:", sourceId);

// Poll until extraction reaches a terminal state
const TERMINAL = new Set(["extracted", "attention_required", "failed", "cancelled"]);
let status = "pending";
while (!TERMINAL.has(status)) {
  await new Promise((r) => setTimeout(r, 2000));
  const res = await fetch(\`\${BASE_URL}/api/sources/\${sourceId}\`, { headers });
  status = (await res.json()).extraction_status;
}
console.log("Extraction ended with status:", status);`,
        curl: `# Upload the document\ncurl -X POST '{BASE_URL}/api/sources/upload' \\\n  -H "apikey: {API_KEY}" \\\n  -H "Authorization: Bearer {API_KEY}" \\\n  -F "file=@product-docs.pdf"\n\n# Poll extraction status (replace {source_id})\ncurl '{BASE_URL}/api/sources/{source_id}' \\\n  -H "apikey: {API_KEY}" \\\n  -H "Authorization: Bearer {API_KEY}"`,
      },
      responseExample: `{\n  "id": "source-uuid",\n  "filename": "product-docs.pdf",\n  "content_type": "application/pdf",\n  "extraction_status": "pending",\n  "created_at": "2026-01-01T00:00:00Z"\n}`,
    },
    {
      title: "Create a knowledge base and index the document",
      description:
        "Create a knowledge base, then add the source to it. Adding a source triggers chunking and vector indexing automatically.",
      endpoint: "POST /api/knowledge-bases",
      snippets: {
        python: `# Create the knowledge base
response = requests.post(
    f"{BASE_URL}/api/knowledge-bases",
    headers=headers,
    json={
        "name": "Product Docs",
        "description": "Product documentation knowledge base",
    },
)
kb = response.json()
kb_id = kb["id"]
print(f"Knowledge base created: {kb_id}")

# Add the source to trigger indexing
response = requests.post(
    f"{BASE_URL}/api/knowledge-bases/{kb_id}/sources",
    headers=headers,
    json={"source_id": source_id},
)
print(f"Source added, indexing started: {response.json()}")`,
        typescript: `// Create the knowledge base
const kbRes = await fetch(\`\${BASE_URL}/api/knowledge-bases\`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    name: "Product Docs",
    description: "Product documentation knowledge base",
  }),
});
const kb = await kbRes.json();
const kbId = kb.id;
console.log("Knowledge base created:", kbId);

// Add the source to trigger indexing
await fetch(\`\${BASE_URL}/api/knowledge-bases/\${kbId}/sources\`, {
  method: "POST",
  headers,
  body: JSON.stringify({ source_id: sourceId }),
});
console.log("Source added, indexing started");`,
        curl: `# Create the knowledge base\ncurl -X POST '{BASE_URL}/api/knowledge-bases' \\\n  -H "apikey: {API_KEY}" \\\n  -H "Authorization: Bearer {API_KEY}" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "name": "Product Docs",\n    "description": "Product documentation knowledge base"\n  }'\n\n# Add source to trigger indexing (replace {kb_id})\ncurl -X POST '{BASE_URL}/api/knowledge-bases/{kb_id}/sources' \\\n  -H "apikey: {API_KEY}" \\\n  -H "Authorization: Bearer {API_KEY}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"source_id": "{source_id}"}'`,
      },
    },
    {
      title: "Create an agent with the knowledge base",
      description:
        "Create an agent and link the knowledge base to it. The agent automatically gets a search tool for each linked knowledge base.",
      endpoint: "POST /api/agents",
      snippets: {
        python: `# Create the agent
response = requests.post(
    f"{BASE_URL}/api/agents",
    headers=headers,
    json={
        "name": "Docs Assistant",
        "model": "gpt-4o",
        "system_prompt": "You are a helpful assistant. Use the knowledge base to answer questions about our product documentation.",
        "temperature": 0.7,
    },
)
agent = response.json()
agent_id = agent["id"]
print(f"Agent created: {agent_id}")

# Link the knowledge base
response = requests.post(
    f"{BASE_URL}/api/agents/{agent_id}/knowledge-bases",
    headers=headers,
    json={"knowledge_base_id": kb_id},
)
print(f"Knowledge base linked: {response.json()}")`,
        typescript: `// Create the agent
const agentRes = await fetch(\`\${BASE_URL}/api/agents\`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    name: "Docs Assistant",
    model: "gpt-4o",
    system_prompt: "You are a helpful assistant. Use the knowledge base to answer questions about our product documentation.",
    temperature: 0.7,
  }),
});
const agent = await agentRes.json();
const agentId = agent.id;
console.log("Agent created:", agentId);

// Link the knowledge base
await fetch(\`\${BASE_URL}/api/agents/\${agentId}/knowledge-bases\`, {
  method: "POST",
  headers,
  body: JSON.stringify({ knowledge_base_id: kbId }),
});
console.log("Knowledge base linked");`,
        curl: `# Create the agent\ncurl -X POST '{BASE_URL}/api/agents' \\\n  -H "apikey: {API_KEY}" \\\n  -H "Authorization: Bearer {API_KEY}" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "name": "Docs Assistant",\n    "model": "gpt-4o",\n    "system_prompt": "You are a helpful assistant.",\n    "temperature": 0.7\n  }'\n\n# Link knowledge base (replace {agent_id})\ncurl -X POST '{BASE_URL}/api/agents/{agent_id}/knowledge-bases' \\\n  -H "apikey: {API_KEY}" \\\n  -H "Authorization: Bearer {API_KEY}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"knowledge_base_id": "{kb_id}"}'`,
      },
    },
    {
      title: "Chat with your agent (streaming)",
      description:
        "Send a message and consume the SSE stream. The agent will search the knowledge base, reason about the results, and stream back an answer.",
      endpoint: "POST /api/agents/{id}/run/stream",
      snippets: {
        python: `response = requests.post(
    f"{BASE_URL}/api/agents/{agent_id}/run/stream",
    headers=headers,
    json={"message": "How do I get started with the product?"},
    stream=True,
)

import json

session_id = None
for line in response.iter_lines():
    if not line:
        continue
    text = line.decode("utf-8")
    if text.startswith("data: "):
        event = json.loads(text[6:])
        if event["event"] == "start":
            session_id = event["session_id"]
        elif event["event"] == "chunk":
            print(event["content"], end="")
        elif event["event"] == "tool_call":
            print(f"\\n[Searching: {event['tool_name']}]")
        elif event["event"] == "tool_result":
            print(f"[Results received]")
        elif event["event"] == "complete":
            print(f"\\n\\nDone! Session: {session_id}")`,
        typescript: `const response = await fetch(\`\${BASE_URL}/api/agents/\${agentId}/run/stream\`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    message: "How do I get started with the product?",
  }),
});

const reader = response.body!.getReader();
const decoder = new TextDecoder();
let sessionId: string | null = null;

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const text = decoder.decode(value);
  for (const line of text.split("\\n")) {
    if (line.startsWith("data: ")) {
      const event = JSON.parse(line.slice(6));
      if (event.event === "start") sessionId = event.session_id;
      if (event.event === "chunk") process.stdout.write(event.content);
      if (event.event === "tool_call") console.log(\`\\n[Searching: \${event.tool_name}]\`);
      if (event.event === "tool_result") console.log("[Results received]");
      if (event.event === "complete") console.log(\`\\nDone! Session: \${sessionId}\`);
    }
  }
}`,
        curl: `curl -N -X POST '{BASE_URL}/api/agents/{agent_id}/run/stream' \\\n  -H "apikey: {API_KEY}" \\\n  -H "Authorization: Bearer {API_KEY}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"message": "How do I get started with the product?"}'`,
      },
      notes:
        "The agent will emit tool_call and tool_result events as it searches the knowledge base, followed by chunk events containing the streamed answer.",
    },
  ],
  whatNext: [
    {
      title: "Agents & Tools",
      description: "Understand the ReAct loop, tool types, and how agents reason.",
      icon: "Bot",
      target: { type: "concept", conceptId: "agents-tools" },
    },
    {
      title: "Streaming Responses",
      description: "Deep dive into SSE event handling and multi-turn sessions.",
      icon: "Radio",
      target: { type: "guide", guideId: "streaming-guide" },
    },
    {
      title: "Agents API Reference",
      description: "Full endpoint documentation for agents.",
      icon: "FileText",
      target: { type: "reference", sectionId: "agents" },
    },
  ],
};
