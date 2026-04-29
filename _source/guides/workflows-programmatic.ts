// api/_data/guides/workflows-programmatic.ts
import type { Guide } from "../types";

export const workflowsProgrammaticGuide: Guide = {
  id: "workflows-programmatic",
  title: "Build Workflows Programmatically",
  description:
    "Create automated workflows by defining blocks and edges via the API. Blocks are processing steps (LLM calls, agent runs, conditions). Edges connect them into a directed graph.",
  prerequisites: ["Authentication configured (see Authentication guide)"],
  introduction:
    "Workflows are deterministic automation pipelines. Unlike agents (which decide what to do), workflows follow a fixed graph of blocks and edges. This guide creates a simple summarizer workflow and deploys it as a webhook.",
  steps: [
    {
      title: "Create a workflow",
      description: "Create an empty workflow container.",
      endpoint: "POST /api/workflows",
      snippets: {
        python: `response = requests.post(
    f"{BASE_URL}/api/workflows",
    headers=headers,
    json={"name": "Document Summarizer", "description": "Summarizes uploaded documents"},
)
workflow = response.json()
wf_id = workflow["id"]`,
        typescript: `const response = await fetch(\`\${BASE_URL}/api/workflows\`, {
  method: "POST",
  headers,
  body: JSON.stringify({ name: "Document Summarizer", description: "Summarizes uploaded documents" }),
});
const workflow = await response.json();`,
        curl: `curl -X POST '{BASE_URL}/api/workflows' \\\n  -H "apikey: {API_KEY}" \\\n  -H "Authorization: Bearer {API_KEY}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"name": "Document Summarizer"}'`,
      },
    },
    {
      title: "Define the graph",
      description:
        "Save blocks (processing steps) and edges (connections between them) as a complete graph. Block types include: input, output, llm, agent, condition, code, and more.",
      endpoint: "PUT /api/workflows/{id}/graph",
      snippets: {
        python: `response = requests.put(
    f"{BASE_URL}/api/workflows/{wf_id}/graph",
    headers=headers,
    json={
        "blocks": [
            {"id": "input", "type": "input", "config": {}, "position": {"x": 0, "y": 0}},
            {"id": "summarize", "type": "llm", "config": {
                "model": "gpt-4o",
                "prompt": "Summarize the following document:\\n\\n{{input.text}}",
            }, "position": {"x": 300, "y": 0}},
            {"id": "output", "type": "output", "config": {}, "position": {"x": 600, "y": 0}},
        ],
        "edges": [
            {"source": "input", "target": "summarize"},
            {"source": "summarize", "target": "output"},
        ],
    },
)
print(response.json())`,
        typescript: `await fetch(\`\${BASE_URL}/api/workflows/\${wfId}/graph\`, {
  method: "PUT",
  headers,
  body: JSON.stringify({
    blocks: [
      { id: "input", type: "input", config: {}, position: { x: 0, y: 0 } },
      { id: "summarize", type: "llm", config: {
        model: "gpt-4o",
        prompt: "Summarize the following document:\\n\\n{{input.text}}",
      }, position: { x: 300, y: 0 } },
      { id: "output", type: "output", config: {}, position: { x: 600, y: 0 } },
    ],
    edges: [
      { source: "input", target: "summarize" },
      { source: "summarize", target: "output" },
    ],
  }),
});`,
        curl: `curl -X PUT '{BASE_URL}/api/workflows/{wf_id}/graph' \\\n  -H "apikey: {API_KEY}" \\\n  -H "Authorization: Bearer {API_KEY}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"blocks": [...], "edges": [...]}'`,
      },
    },
    {
      title: "Execute the workflow",
      description: "Run the workflow with input data. Returns execution results.",
      endpoint: "POST /api/workflows/{id}/execute",
      snippets: {
        python: `response = requests.post(
    f"{BASE_URL}/api/workflows/{wf_id}/execute",
    headers=headers,
    json={"input": {"text": "Your document content here..."}},
)
result = response.json()
print(result)`,
        typescript: `const response = await fetch(\`\${BASE_URL}/api/workflows/\${wfId}/execute\`, {
  method: "POST",
  headers,
  body: JSON.stringify({ input: { text: "Your document content here..." } }),
});
const result = await response.json();
console.log(result);`,
        curl: `curl -X POST '{BASE_URL}/api/workflows/{wf_id}/execute' \\\n  -H "apikey: {API_KEY}" \\\n  -H "Authorization: Bearer {API_KEY}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"input": {"text": "Your document content here..."}}'`,
      },
    },
    {
      title: "Deploy with webhook",
      description:
        "Deploy the workflow to make it externally triggerable via webhook. First deploy, then arm for a single execution.",
      endpoint: "POST /api/workflows/{id}/deploy + POST /api/workflows/{id}/arm",
      snippets: {
        python: `# Deploy
requests.post(f"{BASE_URL}/api/workflows/{wf_id}/deploy", headers=headers)

# Arm for webhook trigger
arm_response = requests.post(f"{BASE_URL}/api/workflows/{wf_id}/arm", headers=headers)
webhook_info = arm_response.json()
print(f"Webhook ID: {webhook_info['webhook_id']}")
print(f"Secret: {webhook_info['secret']}")`,
        typescript: `// Deploy
await fetch(\`\${BASE_URL}/api/workflows/\${wfId}/deploy\`, { method: "POST", headers });

// Arm for webhook trigger
const armRes = await fetch(\`\${BASE_URL}/api/workflows/\${wfId}/arm\`, { method: "POST", headers });
const webhookInfo = await armRes.json();
console.log("Webhook ID:", webhookInfo.webhook_id);`,
        curl: `# Deploy\ncurl -X POST '{BASE_URL}/api/workflows/{wf_id}/deploy' \\\n  -H "apikey: {API_KEY}" \\\n  -H "Authorization: Bearer {API_KEY}"\n\n# Arm\ncurl -X POST '{BASE_URL}/api/workflows/{wf_id}/arm' \\\n  -H "apikey: {API_KEY}" \\\n  -H "Authorization: Bearer {API_KEY}"`,
      },
    },
    {
      title: "Trigger externally",
      description:
        "Call the webhook endpoint from any external system. No API key needed — uses the secret from the arm step.",
      endpoint: "POST /api/webhooks/{webhook_id}",
      snippets: {
        python: `response = requests.post(
    f"{BASE_URL}/api/webhooks/{webhook_id}",
    json={
        "secret": webhook_secret,
        "input": {"text": "Document to summarize..."},
    },
)
print(response.json())`,
        typescript: `const response = await fetch(\`\${BASE_URL}/api/webhooks/\${webhookId}\`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    secret: webhookSecret,
    input: { text: "Document to summarize..." },
  }),
});
console.log(await response.json());`,
        curl: `curl -X POST '{BASE_URL}/api/webhooks/{webhook_id}' \\\n  -H "Content-Type: application/json" \\\n  -d '{"secret": "{webhook_secret}", "input": {"text": "Document to summarize..."}}'`,
      },
      notes: "Webhooks are unauthenticated but validated by secret. After one trigger, you must re-arm the workflow for the next execution.",
    },
  ],
  whatNext: [
    {
      title: "Workflows (Copilot)",
      description: "Build workflows with natural language.",
      icon: "BrainCircuit",
      target: { type: "guide", guideId: "workflows-copilot" },
    },
    {
      title: "Workflows",
      description: "Understand block types and graph execution.",
      icon: "Workflow",
      target: { type: "concept", conceptId: "workflows-concept" },
    },
    {
      title: "Workflows API Reference",
      description: "Full endpoint documentation.",
      icon: "Workflow",
      target: { type: "reference", sectionId: "workflows" },
    },
  ],
};
