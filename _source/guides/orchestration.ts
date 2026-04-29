// api/_data/guides/orchestration.ts
import type { Guide } from "../types";

export const orchestrationGuide: Guide = {
  id: "orchestration",
  title: "Multi-Agent Orchestration",
  description:
    "Combine multiple agents into an orchestration. A coordinator routes messages to the right agent based on the conversation context.",
  prerequisites: ["Two or more agents created (see Build an Agent guide)"],
  introduction:
    "Orchestrations let you combine specialized agents into a team. A coordinator agent decides which entity agent should handle each part of a user's request, enabling complex multi-domain conversations.",
  steps: [
    {
      title: "Create the orchestration",
      description:
        "Define an orchestration with a name and strategy. The supervisor strategy creates a coordinator that delegates to entity agents.",
      endpoint: "POST /api/orchestrations",
      snippets: {
        python: `response = requests.post(
    f"{BASE_URL}/api/orchestrations",
    headers=headers,
    json={
        "name": "Customer Support Team",
        "strategy": "supervisor",
        "orchestrator_config": {
            "additional_instructions": "Route billing questions to the Billing agent and technical questions to the Tech Support agent.",
        },
    },
)
orch = response.json()
orch_id = orch["id"]`,
        typescript: `const response = await fetch(\`\${BASE_URL}/api/orchestrations\`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    name: "Customer Support Team",
    strategy: "supervisor",
    orchestrator_config: {
      additional_instructions: "Route billing questions to the Billing agent and technical questions to the Tech Support agent.",
    },
  }),
});
const orch = await response.json();`,
        curl: `curl -X POST '{BASE_URL}/api/orchestrations' \\\n  -H "apikey: {API_KEY}" \\\n  -H "Authorization: Bearer {API_KEY}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"name": "Customer Support Team", "strategy": "supervisor"}'`,
      },
    },
    {
      title: "Add agents as entities",
      description:
        "Add each agent to the orchestration with a role description that helps the coordinator decide when to delegate.",
      endpoint: "POST /api/orchestrations/{id}/entities",
      snippets: {
        python: `# Add billing agent
requests.post(
    f"{BASE_URL}/api/orchestrations/{orch_id}/entities",
    headers=headers,
    json={
        "agent_id": billing_agent_id,
        "role": "Handles billing, invoices, and payment questions",
    },
)

# Add tech support agent
requests.post(
    f"{BASE_URL}/api/orchestrations/{orch_id}/entities",
    headers=headers,
    json={
        "agent_id": tech_agent_id,
        "role": "Handles technical issues, bugs, and setup questions",
    },
)`,
        typescript: `await fetch(\`\${BASE_URL}/api/orchestrations/\${orchId}/entities\`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    agent_id: billingAgentId,
    role: "Handles billing, invoices, and payment questions",
  }),
});

await fetch(\`\${BASE_URL}/api/orchestrations/\${orchId}/entities\`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    agent_id: techAgentId,
    role: "Handles technical issues, bugs, and setup questions",
  }),
});`,
        curl: `curl -X POST '{BASE_URL}/api/orchestrations/{orch_id}/entities' \\\n  -H "apikey: {API_KEY}" \\\n  -H "Authorization: Bearer {API_KEY}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"agent_id": "{billing_agent_id}", "role": "Handles billing questions"}'`,
      },
    },
    {
      title: "Run the orchestration",
      description:
        "Send a message to the orchestration. The coordinator delegates to the appropriate agent. Events include delegation_started and delegation_completed.",
      endpoint: "POST /api/orchestrations/{id}/run/stream",
      snippets: {
        python: `response = requests.post(
    f"{BASE_URL}/api/orchestrations/{orch_id}/run/stream",
    headers=headers,
    json={"message": "I have a question about my last invoice"},
    stream=True,
)

for line in response.iter_lines():
    if not line:
        continue
    text = line.decode("utf-8")
    if text.startswith("data: "):
        event = json.loads(text[6:])
        if event["event"] == "delegation_started":
            print(f"Delegating to: {event['agent']}")
        elif event["event"] == "chunk":
            print(event["content"], end="")
        elif event["event"] == "complete":
            print("\\nDone.")`,
        typescript: `const response = await fetch(\`\${BASE_URL}/api/orchestrations/\${orchId}/run/stream\`, {
  method: "POST",
  headers,
  body: JSON.stringify({ message: "I have a question about my last invoice" }),
});
// Parse SSE stream — events include delegation_started, chunk, complete`,
        curl: `curl -N -X POST '{BASE_URL}/api/orchestrations/{orch_id}/run/stream' \\\n  -H "apikey: {API_KEY}" \\\n  -H "Authorization: Bearer {API_KEY}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"message": "I have a question about my last invoice"}'`,
      },
      notes: "Additional SSE events for orchestrations: delegation_started (agent name + child run ID), delegation_completed (agent name + usage stats).",
    },
  ],
  whatNext: [
    {
      title: "Multi-Agent Orchestration",
      description: "Understand the coordinator pattern.",
      icon: "Network",
      target: { type: "concept", conceptId: "orchestrations-concept" },
    },
    {
      title: "Orchestrations API Reference",
      description: "Full endpoint documentation.",
      icon: "Network",
      target: { type: "reference", sectionId: "orchestrations" },
    },
  ],
};
