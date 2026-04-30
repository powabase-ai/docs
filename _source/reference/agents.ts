// api/_data/reference/agents.ts
import type { ReferenceSection } from "../types";

export const agentsReference: ReferenceSection = {
  id: "agents",
  title: "Agents",
  description: "Create AI agents, assign tools and knowledge bases, configure MCP servers and hooks, and execute conversations.",
  introduction: "Agents are the conversational core of the platform. Each agent wraps an LLM with a system prompt, tools, knowledge bases, and optional MCP servers. Agents use a ReAct loop to reason about user messages, call tools as needed, and generate streaming responses. Sessions maintain conversation history across multiple turns.",
  commonPatterns: "Create an agent, assign tools and knowledge bases, then use the streaming endpoint for conversations. Pass session_id to continue multi-turn conversations. For human-in-the-loop workflows, configure hooks and use the approve endpoint when approval_requested events are received.",
  groups: [
    {
      title: "Agent CRUD",
      endpoints: [
        {
          method: "GET", path: "/api/agents",
          description: "List all agents.",
          snippets: {
            python: `response = requests.get(f"{BASE_URL}/api/agents", headers=headers)`,
            typescript: `const res = await fetch(\`\${BASE_URL}/api/agents\`, { headers });`,
            curl: `curl '{BASE_URL}/api/agents' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"`,
          },
        },
        {
          method: "POST", path: "/api/agents",
          description: "Create a new agent.",
          requestBody: `{\n  "name": "My Agent",\n  "model": "gpt-4o",\n  "system_prompt": "You are a helpful assistant.",\n  "temperature": 0.7\n}`,
          snippets: {
            python: `response = requests.post(f"{BASE_URL}/api/agents", headers=headers, json={"name": "My Agent", "model": "gpt-4o", "system_prompt": "You are helpful.", "temperature": 0.7})`,
            typescript: `const res = await fetch(\`\${BASE_URL}/api/agents\`, { method: "POST", headers, body: JSON.stringify({ name: "My Agent", model: "gpt-4o", system_prompt: "You are helpful.", temperature: 0.7 }) });`,
            curl: `curl -X POST '{BASE_URL}/api/agents' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}" -H "Content-Type: application/json" -d '{"name": "My Agent", "model": "gpt-4o"}'`,
          },
        },
        {
          method: "GET", path: "/api/agents/{id}",
          description: "Get an agent by ID.",
          parameters: [{ name: "id", in: "path", type: "string", required: true, description: "Agent ID" }],
          snippets: {
            python: `response = requests.get(f"{BASE_URL}/api/agents/{agent_id}", headers=headers)`,
            typescript: `const res = await fetch(\`\${BASE_URL}/api/agents/\${agentId}\`, { headers });`,
            curl: `curl '{BASE_URL}/api/agents/{id}' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"`,
          },
        },
        {
          method: "PATCH", path: "/api/agents/{id}",
          description: "Update an agent's name, model, system prompt, or settings.",
          parameters: [{ name: "id", in: "path", type: "string", required: true, description: "Agent ID" }],
          snippets: {
            python: `response = requests.patch(f"{BASE_URL}/api/agents/{agent_id}", headers=headers, json={"temperature": 0.5})`,
            typescript: `await fetch(\`\${BASE_URL}/api/agents/\${agentId}\`, { method: "PATCH", headers, body: JSON.stringify({ temperature: 0.5 }) });`,
            curl: `curl -X PATCH '{BASE_URL}/api/agents/{id}' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}" -H "Content-Type: application/json" -d '{"temperature": 0.5}'`,
          },
        },
        {
          method: "DELETE", path: "/api/agents/{id}",
          description: "Delete an agent.",
          parameters: [{ name: "id", in: "path", type: "string", required: true, description: "Agent ID" }],
          snippets: {
            python: `response = requests.delete(f"{BASE_URL}/api/agents/{agent_id}", headers=headers)`,
            typescript: `await fetch(\`\${BASE_URL}/api/agents/\${agentId}\`, { method: "DELETE", headers });`,
            curl: `curl -X DELETE '{BASE_URL}/api/agents/{id}' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"`,
          },
        },
      ],
    },
    {
      title: "Tool Assignments",
      endpoints: [
        {
          method: "POST", path: "/api/agents/{id}/tools",
          description: "Assign a tool to the agent.",
          parameters: [{ name: "id", in: "path", type: "string", required: true, description: "Agent ID" }],
          requestBody: `{ "tool_name": "database_query" }`,
          snippets: {
            python: `response = requests.post(f"{BASE_URL}/api/agents/{agent_id}/tools", headers=headers, json={"tool_name": "database_query"})`,
            typescript: `await fetch(\`\${BASE_URL}/api/agents/\${agentId}/tools\`, { method: "POST", headers, body: JSON.stringify({ tool_name: "database_query" }) });`,
            curl: `curl -X POST '{BASE_URL}/api/agents/{id}/tools' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}" -H "Content-Type: application/json" -d '{"tool_name": "database_query"}'`,
          },
        },
        {
          method: "GET", path: "/api/agents/{id}/tools",
          description: "List tool assignments for the agent.",
          parameters: [{ name: "id", in: "path", type: "string", required: true, description: "Agent ID" }],
          snippets: {
            python: `response = requests.get(f"{BASE_URL}/api/agents/{agent_id}/tools", headers=headers)`,
            typescript: `const res = await fetch(\`\${BASE_URL}/api/agents/\${agentId}/tools\`, { headers });`,
            curl: `curl '{BASE_URL}/api/agents/{id}/tools' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"`,
          },
        },
        {
          method: "PATCH", path: "/api/agents/{id}/tools/{assignment_id}",
          description: "Update tool assignment configuration.",
          parameters: [
            { name: "id", in: "path", type: "string", required: true, description: "Agent ID" },
            { name: "assignment_id", in: "path", type: "string", required: true, description: "Assignment ID" },
          ],
          snippets: {
            python: `response = requests.patch(f"{BASE_URL}/api/agents/{agent_id}/tools/{assignment_id}", headers=headers, json={"config": {"allowed_schemas": ["public", "ai"]}})`,
            typescript: `await fetch(\`\${BASE_URL}/api/agents/\${agentId}/tools/\${assignmentId}\`, { method: "PATCH", headers, body: JSON.stringify({ config: { allowed_schemas: ["public", "ai"] } }) });`,
            curl: `curl -X PATCH '{BASE_URL}/api/agents/{id}/tools/{assignment_id}' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}" -H "Content-Type: application/json" -d '{"config": {}}'`,
          },
        },
        {
          method: "DELETE", path: "/api/agents/{id}/tools/{assignment_id}",
          description: "Remove a tool assignment from the agent.",
          parameters: [
            { name: "id", in: "path", type: "string", required: true, description: "Agent ID" },
            { name: "assignment_id", in: "path", type: "string", required: true, description: "Assignment ID" },
          ],
          snippets: {
            python: `response = requests.delete(f"{BASE_URL}/api/agents/{agent_id}/tools/{assignment_id}", headers=headers)`,
            typescript: `await fetch(\`\${BASE_URL}/api/agents/\${agentId}/tools/\${assignmentId}\`, { method: "DELETE", headers });`,
            curl: `curl -X DELETE '{BASE_URL}/api/agents/{id}/tools/{assignment_id}' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"`,
          },
        },
      ],
    },
    {
      title: "Knowledge Base Assignments",
      endpoints: [
        {
          method: "POST", path: "/api/agents/{id}/knowledge-bases",
          description: "Link a knowledge base to the agent. Creates a dynamic search tool.",
          parameters: [{ name: "id", in: "path", type: "string", required: true, description: "Agent ID" }],
          requestBody: `{ "knowledge_base_id": "kb-uuid" }`,
          snippets: {
            python: `response = requests.post(f"{BASE_URL}/api/agents/{agent_id}/knowledge-bases", headers=headers, json={"knowledge_base_id": kb_id})`,
            typescript: `await fetch(\`\${BASE_URL}/api/agents/\${agentId}/knowledge-bases\`, { method: "POST", headers, body: JSON.stringify({ knowledge_base_id: kbId }) });`,
            curl: `curl -X POST '{BASE_URL}/api/agents/{id}/knowledge-bases' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}" -H "Content-Type: application/json" -d '{"knowledge_base_id": "kb-uuid"}'`,
          },
        },
        {
          method: "GET", path: "/api/agents/{id}/knowledge-bases",
          description: "List knowledge base assignments for the agent.",
          parameters: [{ name: "id", in: "path", type: "string", required: true, description: "Agent ID" }],
          snippets: {
            python: `response = requests.get(f"{BASE_URL}/api/agents/{agent_id}/knowledge-bases", headers=headers)`,
            typescript: `const res = await fetch(\`\${BASE_URL}/api/agents/\${agentId}/knowledge-bases\`, { headers });`,
            curl: `curl '{BASE_URL}/api/agents/{id}/knowledge-bases' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"`,
          },
        },
        {
          method: "DELETE", path: "/api/agents/{id}/knowledge-bases/{assignment_id}",
          description: "Remove a knowledge base from the agent.",
          parameters: [
            { name: "id", in: "path", type: "string", required: true, description: "Agent ID" },
            { name: "assignment_id", in: "path", type: "string", required: true, description: "Assignment ID" },
          ],
          snippets: {
            python: `response = requests.delete(f"{BASE_URL}/api/agents/{agent_id}/knowledge-bases/{assignment_id}", headers=headers)`,
            typescript: `await fetch(\`\${BASE_URL}/api/agents/\${agentId}/knowledge-bases/\${assignmentId}\`, { method: "DELETE", headers });`,
            curl: `curl -X DELETE '{BASE_URL}/api/agents/{id}/knowledge-bases/{assignment_id}' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"`,
          },
        },
      ],
    },
    {
      title: "MCP Servers",
      endpoints: [
        {
          method: "POST", path: "/api/agents/{id}/mcp-servers",
          description: "Add an MCP server to the agent.",
          parameters: [{ name: "id", in: "path", type: "string", required: true, description: "Agent ID" }],
          requestBody: `{\n  "url": "https://mcp.example.com",\n  "transport": "sse",\n  "name": "My MCP"\n}`,
          snippets: {
            python: `response = requests.post(f"{BASE_URL}/api/agents/{agent_id}/mcp-servers", headers=headers, json={"url": "https://mcp.example.com", "transport": "sse", "name": "My MCP"})`,
            typescript: `await fetch(\`\${BASE_URL}/api/agents/\${agentId}/mcp-servers\`, { method: "POST", headers, body: JSON.stringify({ url: "https://mcp.example.com", transport: "sse", name: "My MCP" }) });`,
            curl: `curl -X POST '{BASE_URL}/api/agents/{id}/mcp-servers' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}" -H "Content-Type: application/json" -d '{"url": "https://mcp.example.com", "transport": "sse"}'`,
          },
        },
        {
          method: "GET", path: "/api/agents/{id}/mcp-servers",
          description: "List MCP servers for the agent.",
          parameters: [{ name: "id", in: "path", type: "string", required: true, description: "Agent ID" }],
          snippets: {
            python: `response = requests.get(f"{BASE_URL}/api/agents/{agent_id}/mcp-servers", headers=headers)`,
            typescript: `const res = await fetch(\`\${BASE_URL}/api/agents/\${agentId}/mcp-servers\`, { headers });`,
            curl: `curl '{BASE_URL}/api/agents/{id}/mcp-servers' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"`,
          },
        },
        {
          method: "PUT", path: "/api/agents/{id}/mcp-servers/{server_id}",
          description: "Update an MCP server configuration.",
          parameters: [
            { name: "id", in: "path", type: "string", required: true, description: "Agent ID" },
            { name: "server_id", in: "path", type: "string", required: true, description: "MCP Server ID" },
          ],
          snippets: {
            python: `response = requests.put(f"{BASE_URL}/api/agents/{agent_id}/mcp-servers/{server_id}", headers=headers, json={"url": "https://new-url.com"})`,
            typescript: `await fetch(\`\${BASE_URL}/api/agents/\${agentId}/mcp-servers/\${serverId}\`, { method: "PUT", headers, body: JSON.stringify({ url: "https://new-url.com" }) });`,
            curl: `curl -X PUT '{BASE_URL}/api/agents/{id}/mcp-servers/{server_id}' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}" -H "Content-Type: application/json" -d '{"url": "https://new-url.com"}'`,
          },
        },
        {
          method: "DELETE", path: "/api/agents/{id}/mcp-servers/{server_id}",
          description: "Remove an MCP server from the agent.",
          parameters: [
            { name: "id", in: "path", type: "string", required: true, description: "Agent ID" },
            { name: "server_id", in: "path", type: "string", required: true, description: "MCP Server ID" },
          ],
          snippets: {
            python: `response = requests.delete(f"{BASE_URL}/api/agents/{agent_id}/mcp-servers/{server_id}", headers=headers)`,
            typescript: `await fetch(\`\${BASE_URL}/api/agents/\${agentId}/mcp-servers/\${serverId}\`, { method: "DELETE", headers });`,
            curl: `curl -X DELETE '{BASE_URL}/api/agents/{id}/mcp-servers/{server_id}' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"`,
          },
        },
      ],
    },
    {
      title: "Hooks",
      endpoints: [
        {
          method: "POST", path: "/api/agents/{id}/hooks",
          description: "Add a hook to the agent (pre/post execution events).",
          parameters: [{ name: "id", in: "path", type: "string", required: true, description: "Agent ID" }],
          snippets: {
            python: `response = requests.post(f"{BASE_URL}/api/agents/{agent_id}/hooks", headers=headers, json={"event": "before_run", "type": "webhook", "config": {"url": "https://example.com/hook"}})`,
            typescript: `await fetch(\`\${BASE_URL}/api/agents/\${agentId}/hooks\`, { method: "POST", headers, body: JSON.stringify({ event: "before_run", type: "webhook", config: { url: "https://example.com/hook" } }) });`,
            curl: `curl -X POST '{BASE_URL}/api/agents/{id}/hooks' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}" -H "Content-Type: application/json" -d '{"event": "before_run", "type": "webhook", "config": {"url": "..."}}'`,
          },
        },
        {
          method: "GET", path: "/api/agents/{id}/hooks",
          description: "List hooks for the agent.",
          parameters: [{ name: "id", in: "path", type: "string", required: true, description: "Agent ID" }],
          snippets: {
            python: `response = requests.get(f"{BASE_URL}/api/agents/{agent_id}/hooks", headers=headers)`,
            typescript: `const res = await fetch(\`\${BASE_URL}/api/agents/\${agentId}/hooks\`, { headers });`,
            curl: `curl '{BASE_URL}/api/agents/{id}/hooks' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"`,
          },
        },
        {
          method: "DELETE", path: "/api/agents/{id}/hooks/{hook_id}",
          description: "Remove a hook from the agent.",
          parameters: [
            { name: "id", in: "path", type: "string", required: true, description: "Agent ID" },
            { name: "hook_id", in: "path", type: "string", required: true, description: "Hook ID" },
          ],
          snippets: {
            python: `response = requests.delete(f"{BASE_URL}/api/agents/{agent_id}/hooks/{hook_id}", headers=headers)`,
            typescript: `await fetch(\`\${BASE_URL}/api/agents/\${agentId}/hooks/\${hookId}\`, { method: "DELETE", headers });`,
            curl: `curl -X DELETE '{BASE_URL}/api/agents/{id}/hooks/{hook_id}' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"`,
          },
        },
      ],
    },
    {
      title: "Execution",
      endpoints: [
        {
          method: "GET", path: "/api/agents/{id}/sessions",
          description: "List chat sessions for the agent.",
          parameters: [{ name: "id", in: "path", type: "string", required: true, description: "Agent ID" }],
          snippets: {
            python: `response = requests.get(f"{BASE_URL}/api/agents/{agent_id}/sessions", headers=headers)`,
            typescript: `const res = await fetch(\`\${BASE_URL}/api/agents/\${agentId}/sessions\`, { headers });`,
            curl: `curl '{BASE_URL}/api/agents/{id}/sessions' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"`,
          },
        },
        {
          method: "POST", path: "/api/agents/{id}/run",
          description: "Run agent synchronously (no tools, no streaming). Returns full response.",
          parameters: [{ name: "id", in: "path", type: "string", required: true, description: "Agent ID" }],
          requestBody: `{ "message": "Hello" }`,
          snippets: {
            python: `response = requests.post(f"{BASE_URL}/api/agents/{agent_id}/run", headers=headers, json={"message": "Hello"})`,
            typescript: `const res = await fetch(\`\${BASE_URL}/api/agents/\${agentId}/run\`, { method: "POST", headers, body: JSON.stringify({ message: "Hello" }) });`,
            curl: `curl -X POST '{BASE_URL}/api/agents/{id}/run' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}" -H "Content-Type: application/json" -d '{"message": "Hello"}'`,
          },
        },
        {
          method: "POST", path: "/api/agents/{id}/run/stream",
          description: "Run agent with streaming SSE. Supports tools, ReAct loop, and multi-turn via session_id. SSE event types include start, chunk, tool_call, tool_result, reasoning, reasoning_summary, and complete; the reasoning events surface the model's internal thought stream when reasoning is enabled. Set reasoning_requested=true to request reasoning output for this run.",
          parameters: [{ name: "id", in: "path", type: "string", required: true, description: "Agent ID" }],
          requestBody: `{\n  "message": "Hello",\n  "session_id": "optional-session-uuid",\n  "reasoning_requested": false\n}`,
          snippets: {
            python: `response = requests.post(\n    f"{BASE_URL}/api/agents/{agent_id}/run/stream",\n    headers=headers,\n    json={"message": "Hello", "reasoning_requested": True},\n    stream=True,\n)\nfor line in response.iter_lines():\n    if line and line.decode().startswith("data: "):\n        event = json.loads(line.decode()[6:])\n        print(event)`,
            typescript: `const response = await fetch(\`\${BASE_URL}/api/agents/\${agentId}/run/stream\`, {\n  method: "POST", headers,\n  body: JSON.stringify({ message: "Hello", reasoning_requested: true }),\n});\n// Parse SSE events: start, chunk, tool_call, tool_result, reasoning, complete`,
            curl: `curl -N -X POST '{BASE_URL}/api/agents/{id}/run/stream' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}" -H "Content-Type: application/json" -d '{"message": "Hello", "reasoning_requested": true}'`,
          },
        },
        {
          method: "POST", path: "/api/agents/runs/{run_id}/approve",
          description: "Approve or deny a pending tool call (human-in-the-loop).",
          parameters: [{ name: "run_id", in: "path", type: "string", required: true, description: "Run ID" }],
          requestBody: `{ "approved": true }`,
          snippets: {
            python: `response = requests.post(f"{BASE_URL}/api/agents/runs/{run_id}/approve", headers=headers, json={"approved": True})`,
            typescript: `await fetch(\`\${BASE_URL}/api/agents/runs/\${runId}/approve\`, { method: "POST", headers, body: JSON.stringify({ approved: true }) });`,
            curl: `curl -X POST '{BASE_URL}/api/agents/runs/{run_id}/approve' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}" -H "Content-Type: application/json" -d '{"approved": true}'`,
          },
        },
      ],
    },
  ],
  errorResponses: [
    { status: 400, code: "invalid_config", description: "Invalid agent configuration (e.g., unsupported model, invalid temperature)" },
    { status: 404, code: "agent_not_found", description: "No agent exists with the given ID" },
    { status: 409, code: "tool_conflict", description: "The tool is already assigned to this agent" },
  ],
};
