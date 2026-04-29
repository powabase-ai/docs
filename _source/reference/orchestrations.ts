// api/_data/reference/orchestrations.ts
import type { ReferenceSection } from "../types";

export const orchestrationsReference: ReferenceSection = {
  id: "orchestrations",
  title: "Orchestrations",
  description: "Combine multiple agents into coordinated multi-agent systems.",
  introduction: "Orchestrations coordinate multiple agents to handle complex, multi-domain tasks. A coordinator agent analyzes incoming messages and delegates subtasks to specialized entity agents based on their role descriptions. The coordinator synthesizes entity responses into a unified reply.",
  commonPatterns: "Create an orchestration, add entity agents with clear role descriptions, then use the streaming endpoint. The coordinator automatically handles delegation. Entity role descriptions should be specific and non-overlapping so the coordinator can make clear routing decisions.",
  groups: [
    {
      title: "CRUD",
      endpoints: [
        { method: "POST", path: "/api/orchestrations", description: "Create an orchestration.", requestBody: `{ "name": "Team", "strategy": "supervisor" }`, snippets: { python: `requests.post(f"{BASE_URL}/api/orchestrations", headers=headers, json={"name": "Team", "strategy": "supervisor"})`, typescript: `await fetch(\`\${BASE_URL}/api/orchestrations\`, { method: "POST", headers, body: JSON.stringify({ name: "Team", strategy: "supervisor" }) });`, curl: `curl -X POST '{BASE_URL}/api/orchestrations' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}" -H "Content-Type: application/json" -d '{"name": "Team"}'` } },
        { method: "GET", path: "/api/orchestrations", description: "List all orchestrations.", snippets: { python: `requests.get(f"{BASE_URL}/api/orchestrations", headers=headers)`, typescript: `await fetch(\`\${BASE_URL}/api/orchestrations\`, { headers });`, curl: `curl '{BASE_URL}/api/orchestrations' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"` } },
        { method: "GET", path: "/api/orchestrations/{id}", description: "Get orchestration with its entities.", parameters: [{ name: "id", in: "path", type: "string", required: true, description: "Orchestration ID" }], snippets: { python: `requests.get(f"{BASE_URL}/api/orchestrations/{orch_id}", headers=headers)`, typescript: `await fetch(\`\${BASE_URL}/api/orchestrations/\${orchId}\`, { headers });`, curl: `curl '{BASE_URL}/api/orchestrations/{id}' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"` } },
        { method: "PUT", path: "/api/orchestrations/{id}", description: "Update orchestration config.", parameters: [{ name: "id", in: "path", type: "string", required: true, description: "Orchestration ID" }], snippets: { python: `requests.put(f"{BASE_URL}/api/orchestrations/{orch_id}", headers=headers, json={"name": "Updated"})`, typescript: `await fetch(\`\${BASE_URL}/api/orchestrations/\${orchId}\`, { method: "PUT", headers, body: JSON.stringify({ name: "Updated" }) });`, curl: `curl -X PUT '{BASE_URL}/api/orchestrations/{id}' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}" -H "Content-Type: application/json" -d '{"name": "Updated"}'` } },
        { method: "DELETE", path: "/api/orchestrations/{id}", description: "Delete an orchestration.", parameters: [{ name: "id", in: "path", type: "string", required: true, description: "Orchestration ID" }], snippets: { python: `requests.delete(f"{BASE_URL}/api/orchestrations/{orch_id}", headers=headers)`, typescript: `await fetch(\`\${BASE_URL}/api/orchestrations/\${orchId}\`, { method: "DELETE", headers });`, curl: `curl -X DELETE '{BASE_URL}/api/orchestrations/{id}' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"` } },
      ],
    },
    {
      title: "Entities",
      endpoints: [
        { method: "POST", path: "/api/orchestrations/{id}/entities", description: "Add an agent as an entity.", parameters: [{ name: "id", in: "path", type: "string", required: true, description: "Orchestration ID" }], requestBody: `{ "agent_id": "uuid", "role": "Handles billing" }`, snippets: { python: `requests.post(f"{BASE_URL}/api/orchestrations/{orch_id}/entities", headers=headers, json={"agent_id": agent_id, "role": "Handles billing"})`, typescript: `await fetch(\`\${BASE_URL}/api/orchestrations/\${orchId}/entities\`, { method: "POST", headers, body: JSON.stringify({ agent_id: agentId, role: "Handles billing" }) });`, curl: `curl -X POST '{BASE_URL}/api/orchestrations/{id}/entities' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}" -H "Content-Type: application/json" -d '{"agent_id": "uuid", "role": "Handles billing"}'` } },
        { method: "GET", path: "/api/orchestrations/{id}/entities", description: "List entities in the orchestration.", parameters: [{ name: "id", in: "path", type: "string", required: true, description: "Orchestration ID" }], snippets: { python: `requests.get(f"{BASE_URL}/api/orchestrations/{orch_id}/entities", headers=headers)`, typescript: `await fetch(\`\${BASE_URL}/api/orchestrations/\${orchId}/entities\`, { headers });`, curl: `curl '{BASE_URL}/api/orchestrations/{id}/entities' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"` } },
        { method: "PUT", path: "/api/orchestrations/{id}/entities/{eid}", description: "Update an entity's role or config.", parameters: [{ name: "id", in: "path", type: "string", required: true, description: "Orchestration ID" }, { name: "eid", in: "path", type: "string", required: true, description: "Entity ID" }], snippets: { python: `requests.put(f"{BASE_URL}/api/orchestrations/{orch_id}/entities/{entity_id}", headers=headers, json={"role": "Updated role"})`, typescript: `await fetch(\`\${BASE_URL}/api/orchestrations/\${orchId}/entities/\${entityId}\`, { method: "PUT", headers, body: JSON.stringify({ role: "Updated" }) });`, curl: `curl -X PUT '{BASE_URL}/api/orchestrations/{id}/entities/{eid}' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}" -H "Content-Type: application/json" -d '{"role": "Updated"}'` } },
        { method: "DELETE", path: "/api/orchestrations/{id}/entities/{eid}", description: "Remove an entity.", parameters: [{ name: "id", in: "path", type: "string", required: true, description: "Orchestration ID" }, { name: "eid", in: "path", type: "string", required: true, description: "Entity ID" }], snippets: { python: `requests.delete(f"{BASE_URL}/api/orchestrations/{orch_id}/entities/{entity_id}", headers=headers)`, typescript: `await fetch(\`\${BASE_URL}/api/orchestrations/\${orchId}/entities/\${entityId}\`, { method: "DELETE", headers });`, curl: `curl -X DELETE '{BASE_URL}/api/orchestrations/{id}/entities/{eid}' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"` } },
      ],
    },
    {
      title: "Execution",
      endpoints: [
        { method: "POST", path: "/api/orchestrations/{id}/run/stream", description: "Run orchestration with streaming SSE. Includes delegation events.", parameters: [{ name: "id", in: "path", type: "string", required: true, description: "Orchestration ID" }], requestBody: `{ "message": "Hello" }`, snippets: { python: `requests.post(f"{BASE_URL}/api/orchestrations/{orch_id}/run/stream", headers=headers, json={"message": "Hello"}, stream=True)`, typescript: `await fetch(\`\${BASE_URL}/api/orchestrations/\${orchId}/run/stream\`, { method: "POST", headers, body: JSON.stringify({ message: "Hello" }) });`, curl: `curl -N -X POST '{BASE_URL}/api/orchestrations/{id}/run/stream' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}" -H "Content-Type: application/json" -d '{"message": "Hello"}'` } },
        { method: "GET", path: "/api/orchestrations/runs/{run_id}", description: "Get orchestration run result.", parameters: [{ name: "run_id", in: "path", type: "string", required: true, description: "Run ID" }], snippets: { python: `requests.get(f"{BASE_URL}/api/orchestrations/runs/{run_id}", headers=headers)`, typescript: `await fetch(\`\${BASE_URL}/api/orchestrations/runs/\${runId}\`, { headers });`, curl: `curl '{BASE_URL}/api/orchestrations/runs/{run_id}' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"` } },
      ],
    },
  ],
  errorResponses: [
    { status: 400, code: "no_entities", description: "The orchestration has no entity agents — add at least one before running" },
    { status: 404, code: "orchestration_not_found", description: "No orchestration exists with the given ID" },
  ],
};
