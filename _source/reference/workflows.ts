// api/_data/reference/workflows.ts
import type { ReferenceSection } from "../types";

export const workflowsReference: ReferenceSection = {
  id: "workflows",
  title: "Workflows",
  description: "Create and manage automated block-based workflows with visual graph definitions.",
  introduction: "Workflows are DAG-based automation pipelines that execute a fixed sequence of blocks (LLM calls, code execution, conditions, agent runs). Unlike agents that decide what to do dynamically, workflows follow a predetermined graph. They can be executed directly, streamed, or triggered externally via webhooks.",
  commonPatterns: "Create a workflow, define its graph with PUT /api/workflows/{id}/graph, then execute. For external triggers, deploy the workflow and arm it to get a webhook URL. Webhooks are single-use — re-arm after each trigger. Use the streaming endpoint for real-time block execution updates.",
  groups: [
    {
      title: "CRUD",
      endpoints: [
        { method: "GET", path: "/api/workflows", description: "List workflows.", parameters: [{ name: "limit", in: "query", type: "integer", required: false, description: "Max results" }, { name: "offset", in: "query", type: "integer", required: false, description: "Pagination offset" }], snippets: { python: `requests.get(f"{BASE_URL}/api/workflows", headers=headers)`, typescript: `await fetch(\`\${BASE_URL}/api/workflows\`, { headers });`, curl: `curl '{BASE_URL}/api/workflows' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"` } },
        { method: "POST", path: "/api/workflows", description: "Create a workflow.", requestBody: `{ "name": "My Workflow" }`, snippets: { python: `requests.post(f"{BASE_URL}/api/workflows", headers=headers, json={"name": "My Workflow"})`, typescript: `await fetch(\`\${BASE_URL}/api/workflows\`, { method: "POST", headers, body: JSON.stringify({ name: "My Workflow" }) });`, curl: `curl -X POST '{BASE_URL}/api/workflows' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}" -H "Content-Type: application/json" -d '{"name": "My Workflow"}'` } },
        { method: "GET", path: "/api/workflows/{id}", description: "Get workflow with blocks and edges.", parameters: [{ name: "id", in: "path", type: "string", required: true, description: "Workflow ID" }], snippets: { python: `requests.get(f"{BASE_URL}/api/workflows/{wf_id}", headers=headers)`, typescript: `await fetch(\`\${BASE_URL}/api/workflows/\${wfId}\`, { headers });`, curl: `curl '{BASE_URL}/api/workflows/{id}' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"` } },
        { method: "PATCH", path: "/api/workflows/{id}", description: "Update workflow metadata.", parameters: [{ name: "id", in: "path", type: "string", required: true, description: "Workflow ID" }], snippets: { python: `requests.patch(f"{BASE_URL}/api/workflows/{wf_id}", headers=headers, json={"name": "Renamed"})`, typescript: `await fetch(\`\${BASE_URL}/api/workflows/\${wfId}\`, { method: "PATCH", headers, body: JSON.stringify({ name: "Renamed" }) });`, curl: `curl -X PATCH '{BASE_URL}/api/workflows/{id}' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}" -H "Content-Type: application/json" -d '{"name": "Renamed"}'` } },
        { method: "DELETE", path: "/api/workflows/{id}", description: "Delete a workflow.", parameters: [{ name: "id", in: "path", type: "string", required: true, description: "Workflow ID" }], snippets: { python: `requests.delete(f"{BASE_URL}/api/workflows/{wf_id}", headers=headers)`, typescript: `await fetch(\`\${BASE_URL}/api/workflows/\${wfId}\`, { method: "DELETE", headers });`, curl: `curl -X DELETE '{BASE_URL}/api/workflows/{id}' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"` } },
      ],
    },
    {
      title: "Graph",
      endpoints: [
        { method: "PUT", path: "/api/workflows/{id}/graph", description: "Save the complete graph — blocks and edges.", parameters: [{ name: "id", in: "path", type: "string", required: true, description: "Workflow ID" }], requestBody: `{\n  "blocks": [\n    { "id": "input", "type": "input", "config": {}, "position": {"x": 0, "y": 0} }\n  ],\n  "edges": [\n    { "source": "input", "target": "output" }\n  ]\n}`, snippets: { python: `requests.put(f"{BASE_URL}/api/workflows/{wf_id}/graph", headers=headers, json={"blocks": [...], "edges": [...]})`, typescript: `await fetch(\`\${BASE_URL}/api/workflows/\${wfId}/graph\`, { method: "PUT", headers, body: JSON.stringify({ blocks: [...], edges: [...] }) });`, curl: `curl -X PUT '{BASE_URL}/api/workflows/{id}/graph' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}" -H "Content-Type: application/json" -d '{"blocks": [], "edges": []}'` } },
      ],
    },
    {
      title: "Deploy",
      endpoints: [
        { method: "POST", path: "/api/workflows/{id}/deploy", description: "Deploy the workflow (enables webhook triggering).", parameters: [{ name: "id", in: "path", type: "string", required: true, description: "Workflow ID" }], snippets: { python: `requests.post(f"{BASE_URL}/api/workflows/{wf_id}/deploy", headers=headers)`, typescript: `await fetch(\`\${BASE_URL}/api/workflows/\${wfId}/deploy\`, { method: "POST", headers });`, curl: `curl -X POST '{BASE_URL}/api/workflows/{id}/deploy' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"` } },
        { method: "POST", path: "/api/workflows/{id}/undeploy", description: "Undeploy the workflow.", parameters: [{ name: "id", in: "path", type: "string", required: true, description: "Workflow ID" }], snippets: { python: `requests.post(f"{BASE_URL}/api/workflows/{wf_id}/undeploy", headers=headers)`, typescript: `await fetch(\`\${BASE_URL}/api/workflows/\${wfId}/undeploy\`, { method: "POST", headers });`, curl: `curl -X POST '{BASE_URL}/api/workflows/{id}/undeploy' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"` } },
        { method: "POST", path: "/api/workflows/{id}/arm", description: "Arm webhook for a single external trigger.", parameters: [{ name: "id", in: "path", type: "string", required: true, description: "Workflow ID" }], snippets: { python: `response = requests.post(f"{BASE_URL}/api/workflows/{wf_id}/arm", headers=headers)\nprint(response.json())  # { webhook_id, secret }`, typescript: `const res = await fetch(\`\${BASE_URL}/api/workflows/\${wfId}/arm\`, { method: "POST", headers });\nconst { webhook_id, secret } = await res.json();`, curl: `curl -X POST '{BASE_URL}/api/workflows/{id}/arm' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"` } },
      ],
    },
    {
      title: "Execution",
      endpoints: [
        { method: "POST", path: "/api/workflows/{id}/execute", description: "Execute the workflow synchronously.", parameters: [{ name: "id", in: "path", type: "string", required: true, description: "Workflow ID" }], requestBody: `{ "input": { "text": "..." } }`, snippets: { python: `requests.post(f"{BASE_URL}/api/workflows/{wf_id}/execute", headers=headers, json={"input": {"text": "..."}})`, typescript: `await fetch(\`\${BASE_URL}/api/workflows/\${wfId}/execute\`, { method: "POST", headers, body: JSON.stringify({ input: { text: "..." } }) });`, curl: `curl -X POST '{BASE_URL}/api/workflows/{id}/execute' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}" -H "Content-Type: application/json" -d '{"input": {"text": "..."}}'` } },
        { method: "POST", path: "/api/workflows/{id}/execute/stream", description: "Execute with streaming SSE.", parameters: [{ name: "id", in: "path", type: "string", required: true, description: "Workflow ID" }], snippets: { python: `requests.post(f"{BASE_URL}/api/workflows/{wf_id}/execute/stream", headers=headers, json={"input": {"text": "..."}}, stream=True)`, typescript: `await fetch(\`\${BASE_URL}/api/workflows/\${wfId}/execute/stream\`, { method: "POST", headers, body: JSON.stringify({ input: { text: "..." } }) });`, curl: `curl -N -X POST '{BASE_URL}/api/workflows/{id}/execute/stream' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}" -H "Content-Type: application/json" -d '{"input": {"text": "..."}}'` } },
        { method: "GET", path: "/api/workflows/{id}/executions", description: "List execution history.", parameters: [{ name: "id", in: "path", type: "string", required: true, description: "Workflow ID" }], snippets: { python: `requests.get(f"{BASE_URL}/api/workflows/{wf_id}/executions", headers=headers)`, typescript: `await fetch(\`\${BASE_URL}/api/workflows/\${wfId}/executions\`, { headers });`, curl: `curl '{BASE_URL}/api/workflows/{id}/executions' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"` } },
        { method: "GET", path: "/api/workflows/{id}/executions/{eid}/logs", description: "Get per-block execution logs.", parameters: [{ name: "id", in: "path", type: "string", required: true, description: "Workflow ID" }, { name: "eid", in: "path", type: "string", required: true, description: "Execution ID" }], snippets: { python: `requests.get(f"{BASE_URL}/api/workflows/{wf_id}/executions/{exec_id}/logs", headers=headers)`, typescript: `await fetch(\`\${BASE_URL}/api/workflows/\${wfId}/executions/\${execId}/logs\`, { headers });`, curl: `curl '{BASE_URL}/api/workflows/{id}/executions/{eid}/logs' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"` } },
      ],
    },
  ],
  errorResponses: [
    { status: 400, code: "invalid_graph", description: "The workflow graph is invalid (e.g., cycles, disconnected blocks, missing required config)" },
    { status: 404, code: "workflow_not_found", description: "No workflow exists with the given ID" },
    { status: 409, code: "already_deployed", description: "The workflow is already deployed — undeploy first to make changes" },
  ],
};
