// api/_data/guides/advanced-agent-config.ts
import type { Guide } from "../types";

export const advancedAgentConfigGuide: Guide = {
  id: "advanced-agent-config",
  title: "Advanced Agent Configuration",
  description:
    "Configure MCP servers, hooks, and the human-in-the-loop approval flow for production-grade agents.",
  prerequisites: ["An agent created (see Build an Agent guide)"],
  introduction:
    "Beyond basic tools and knowledge bases, agents support three powerful configuration options: MCP (Model Context Protocol) servers for external tool integrations, hooks for triggering webhooks on agent lifecycle events, and an approval flow that pauses execution until a human approves sensitive tool calls. This guide walks through each one.",
  steps: [
    {
      title: "Add an MCP server",
      description:
        "Connect an external MCP server to your agent. The agent discovers and calls tools exposed by the MCP server over SSE transport during runs.",
      endpoint: "POST /api/agents/{id}/mcp-servers",
      snippets: {
        python: `response = requests.post(
    f"{BASE_URL}/api/agents/{agent_id}/mcp-servers",
    headers=headers,
    json={
        "name": "GitHub Tools",
        "url": "https://mcp.example.com/github/sse",
        "transport": "sse",
        "headers": {
            "Authorization": "Bearer ghp_your_token_here",
        },
    },
)
mcp_server = response.json()
print(f"MCP server added: {mcp_server['id']}")
print(f"Available tools will be discovered at runtime")`,
        typescript: `const response = await fetch(\`\${BASE_URL}/api/agents/\${agentId}/mcp-servers\`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    name: "GitHub Tools",
    url: "https://mcp.example.com/github/sse",
    transport: "sse",
    headers: {
      Authorization: "Bearer ghp_your_token_here",
    },
  }),
});
const mcpServer = await response.json();
console.log("MCP server added:", mcpServer.id);`,
        curl: `curl -X POST '{BASE_URL}/api/agents/{agent_id}/mcp-servers' \\\n  -H "apikey: {API_KEY}" \\\n  -H "Authorization: Bearer {API_KEY}" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "name": "GitHub Tools",\n    "url": "https://mcp.example.com/github/sse",\n    "transport": "sse",\n    "headers": {\n      "Authorization": "Bearer ghp_your_token_here"\n    }\n  }'`,
      },
      responseExample: `{\n  "id": "mcp-uuid",\n  "name": "GitHub Tools",\n  "url": "https://mcp.example.com/github/sse",\n  "transport": "sse",\n  "created_at": "2026-01-01T00:00:00Z"\n}`,
      notes:
        "The agent connects to the MCP server at the start of each run to discover available tools. Tools are then available alongside builtin tools and knowledge base search.",
    },
    {
      title: "Configure a webhook hook",
      description:
        "Add an HTTP webhook hook that fires before each tool call. Use hooks to log tool usage, enforce policies, or notify external systems.",
      endpoint: "POST /api/agents/{id}/hooks",
      snippets: {
        python: `response = requests.post(
    f"{BASE_URL}/api/agents/{agent_id}/hooks",
    headers=headers,
    json={
        "event": "PreToolUse",
        "type": "http",
        "config": {
            "url": "https://your-app.com/webhooks/tool-calls",
        },
    },
)
hook = response.json()
print(f"Hook created: {hook['id']}")
print(f"Event: {hook['event']}, Type: {hook['type']}")`,
        typescript: `const response = await fetch(\`\${BASE_URL}/api/agents/\${agentId}/hooks\`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    event: "PreToolUse",
    type: "http",
    config: {
      url: "https://your-app.com/webhooks/tool-calls",
    },
  }),
});
const hook = await response.json();
console.log("Hook created:", hook.id);
console.log("Event:", hook.event, "Type:", hook.type);`,
        curl: `curl -X POST '{BASE_URL}/api/agents/{agent_id}/hooks' \\\n  -H "apikey: {API_KEY}" \\\n  -H "Authorization: Bearer {API_KEY}" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "event": "PreToolUse",\n    "type": "http",\n    "config": {"url": "https://your-app.com/webhooks/tool-calls"}\n  }'`,
      },
      notes:
        "Hook events: PreToolUse (before tool execution), PostToolUse (after tool execution). Use the optional matcher field to target a specific tool by name.",
    },
    {
      title: "Enable approval flow",
      description:
        "Add an approval hook to the agent. When a tool call matches, the run pauses and emits an `approval_requested` SSE event. The run waits until you approve or reject via the API.",
      endpoint: "POST /api/agents/{id}/hooks",
      snippets: {
        python: `# Add an approval hook — pauses on database_query calls
response = requests.post(
    f"{BASE_URL}/api/agents/{agent_id}/hooks",
    headers=headers,
    json={
        "event": "PreToolUse",
        "type": "approval",
        "matcher": "database_query",
        "config": {"message": "Approve this database query?"},
    },
)
print(f"Approval hook added: {response.json()['id']}")

# Stream a run — watch for approval_requested events
response = requests.post(
    f"{BASE_URL}/api/agents/{agent_id}/run/stream",
    headers=headers,
    json={"message": "Delete all inactive users from the database"},
    stream=True,
)

import json

for line in response.iter_lines():
    if not line:
        continue
    text = line.decode("utf-8")
    if not text.startswith("data: "):
        continue
    event = json.loads(text[6:])

    if event["event"] == "approval_requested":
        print(f"Approval needed for: {event['tool_name']}")
        print(f"Input: {json.dumps(event.get('tool_input', {}), indent=2)}")
        print(f"Run ID: {event['run_id']}")
        # The stream pauses here — approve or reject via the API
        break

    elif event["event"] == "chunk":
        print(event["content"], end="")`,
        typescript: `// Add an approval hook — pauses on database_query calls
await fetch(\`\${BASE_URL}/api/agents/\${agentId}/hooks\`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    event: "PreToolUse",
    type: "approval",
    matcher: "database_query",
    config: { message: "Approve this database query?" },
  }),
});

// Stream a run and watch for approval_requested events
const response = await fetch(\`\${BASE_URL}/api/agents/\${agentId}/run/stream\`, {
  method: "POST",
  headers,
  body: JSON.stringify({ message: "Delete all inactive users from the database" }),
});

const reader = response.body!.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  for (const line of decoder.decode(value).split("\\n")) {
    if (!line.startsWith("data: ")) continue;
    const event = JSON.parse(line.slice(6));

    if (event.event === "approval_requested") {
      console.log(\`Approval needed for: \${event.tool_name}\`);
      console.log("Input:", JSON.stringify(event.tool_input ?? {}, null, 2));
      console.log(\`Run ID: \${event.run_id}\`);
      // Stream pauses here — approve or reject via the API
      break;
    }

    if (event.event === "chunk") {
      process.stdout.write(event.content);
    }
  }
}`,
        curl: `# Add an approval hook for database_query\ncurl -X POST '{BASE_URL}/api/agents/{agent_id}/hooks' \\\n  -H "apikey: {API_KEY}" \\\n  -H "Authorization: Bearer {API_KEY}" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "event": "PreToolUse",\n    "type": "approval",\n    "matcher": "database_query",\n    "config": {"message": "Approve this database query?"}\n  }'\n\n# Stream a run — look for approval_requested events\ncurl -N -X POST '{BASE_URL}/api/agents/{agent_id}/run/stream' \\\n  -H "apikey: {API_KEY}" \\\n  -H "Authorization: Bearer {API_KEY}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"message": "Delete all inactive users from the database"}'`,
      },
      notes:
        "Set matcher to a specific tool name to only require approval for that tool, or omit matcher to require approval for all tool calls.",
    },
    {
      title: "Approve a pending tool call",
      description:
        "When an approval_requested event pauses a run, call the approve endpoint to allow execution to continue, or reject to skip the tool call.",
      endpoint: "POST /api/agents/runs/{run_id}/approve",
      snippets: {
        python: `# Approve the pending tool call
response = requests.post(
    f"{BASE_URL}/api/agents/runs/{run_id}/approve",
    headers=headers,
    json={"approved": True},
)
print(f"Approved: {response.json()}")

# Or reject
response = requests.post(
    f"{BASE_URL}/api/agents/runs/{run_id}/approve",
    headers=headers,
    json={"approved": False},
)
print(f"Rejected: {response.json()}")`,
        typescript: `// Approve the pending tool call
const approveRes = await fetch(
  \`\${BASE_URL}/api/agents/runs/\${runId}/approve\`,
  {
    method: "POST",
    headers,
    body: JSON.stringify({ approved: true }),
  },
);
console.log("Approved:", await approveRes.json());

// Or reject
const rejectRes = await fetch(
  \`\${BASE_URL}/api/agents/runs/\${runId}/approve\`,
  {
    method: "POST",
    headers,
    body: JSON.stringify({ approved: false }),
  },
);
console.log("Rejected:", await rejectRes.json());`,
        curl: `# Approve\ncurl -X POST '{BASE_URL}/api/agents/runs/{run_id}/approve' \\\n  -H "apikey: {API_KEY}" \\\n  -H "Authorization: Bearer {API_KEY}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"approved": true}'\n\n# Reject\ncurl -X POST '{BASE_URL}/api/agents/runs/{run_id}/approve' \\\n  -H "apikey: {API_KEY}" \\\n  -H "Authorization: Bearer {API_KEY}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"approved": false}'`,
      },
      notes:
        "After approval, the SSE stream resumes and the tool executes normally. After rejection, the agent skips the tool call and may choose an alternative approach or respond to the user.",
    },
  ],
  whatNext: [
    {
      title: "Agents & Tools",
      description:
        "Understand the full tool system including MCP, builtins, and custom tools.",
      icon: "Bot",
      target: { type: "concept", conceptId: "agents-tools" },
    },
    {
      title: "Orchestration",
      description: "Coordinate multiple agents working together.",
      icon: "GitBranch",
      target: { type: "guide", guideId: "orchestration" },
    },
    {
      title: "Agents API Reference",
      description: "Full endpoint documentation for agents.",
      icon: "FileText",
      target: { type: "reference", sectionId: "agents" },
    },
  ],
};
