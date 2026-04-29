import type { ConceptPage } from "../types";

export const orchestrationsConceptPage: ConceptPage = {
  id: "orchestrations-concept",
  title: "Multi-Agent Orchestration",
  description: "Orchestrations coordinate multiple agents to solve complex tasks. Three execution strategies — Supervisor, Sequential, and Parallel — give you different patterns for multi-agent collaboration, from autonomous delegation to pipeline processing to concurrent fan-out with merged results.",
  content: [
    {
      type: "heading", level: 2, text: "What is an Orchestration?", id: "what-is-orch",
    },
    {
      type: "prose",
      text: "An Orchestration is a container that groups multiple agents (entities) and runs them using a coordination strategy. Each entity agent has its own system prompt, tools, and knowledge bases — the orchestration handles how they interact. You choose a strategy that matches your use case: Supervisor for autonomous delegation, Sequential for pipeline processing, or Parallel for concurrent execution with merged results.",
    },

    // ─── STRATEGIES ────────────────────────────────────────────────

    {
      type: "heading", level: 2, text: "Execution Strategies", id: "strategies",
    },
    {
      type: "table",
      headers: ["Strategy", "Pattern", "How It Works", "Best For"],
      rows: [
        ["supervisor", "Coordinator delegates", "A coordinator agent reasons about the user's message and delegates subtasks to entity agents by calling delegate_to_{name} tools. The coordinator synthesizes entity responses into a final answer.", "Multi-domain support (billing + tech + sales), complex routing, dynamic task decomposition"],
        ["sequential", "Pipeline", "Entity agents run in order (sorted by position). Each agent receives the previous agent's output as its input. The final agent's output is the orchestration result.", "Multi-stage processing: extract → analyze → summarize → format"],
        ["parallel", "Fan-out + merge", "All entity agents run concurrently on the same input. If multiple agents produce results, a merge agent (gpt-4.1-mini) combines them into a single coherent response.", "Independent analysis from multiple perspectives, parallel research tasks"],
      ],
    },

    // --- Supervisor ---
    {
      type: "heading", level: 3, text: "Supervisor Strategy", id: "supervisor",
    },
    {
      type: "prose",
      text: "The Supervisor strategy creates a coordinator agent that has access to a delegation tool for each entity agent. When a user message arrives, the coordinator reasons about which entity should handle it and calls the appropriate delegate_to_{name} tool with a task description. The entity agent runs with its own tools and knowledge bases (up to 10 ReAct steps by default) and returns its result. The coordinator can delegate to multiple entities in sequence or use the results from one delegation to inform the next. The coordinator's own ReAct loop runs for up to 25 steps.",
    },
    {
      type: "diagram",
      svgId: "orchestration-flow",
      caption: "Supervisor strategy: coordinator delegates to specialized agents",
      alt: "Orchestration flow: User → Coordinator → delegates to Agent A and Agent B → results merge → Coordinator synthesizes → Final Response.",
    },
    {
      type: "prose",
      text: "Each delegation creates a child execution context with an incremented depth (max depth: 3, preventing infinite recursive delegation). The child context gets a budget allocation from the parent's remaining token budget. Entity agents share the parent's abort signal, so cancelling the orchestration cancels all active entity runs.",
    },
    {
      type: "prose",
      text: "The coordinator's system prompt is auto-generated from the entity role descriptions. Write specific, non-overlapping role descriptions to help the coordinator make clear routing decisions — for example, \"Handles billing inquiries, invoices, and payment issues\" rather than \"Handles customer questions.\"",
    },

    // --- Sequential ---
    {
      type: "heading", level: 3, text: "Sequential Strategy", id: "sequential",
    },
    {
      type: "prose",
      text: "The Sequential strategy runs entity agents one after another in position order. The first agent receives the user's message as input. Each subsequent agent receives the previous agent's output as its input. If any agent in the chain fails, the entire orchestration fails immediately. This is ideal for multi-stage processing pipelines where each stage transforms or enriches the data.",
    },
    {
      type: "callout",
      variant: "tip",
      title: "Example: Document processing pipeline",
      text: "Agent 1 (Extractor): extracts key facts from a document. Agent 2 (Analyzer): identifies risks and opportunities from the extracted facts. Agent 3 (Writer): produces a formatted executive summary from the analysis.",
    },

    // --- Parallel ---
    {
      type: "heading", level: 3, text: "Parallel Strategy", id: "parallel",
    },
    {
      type: "prose",
      text: "The Parallel strategy runs all entity agents concurrently on the same input using a thread pool. Each agent processes the user's message independently with its own tools and knowledge bases. If there is only one entity, its output is returned directly. If there are multiple entities, after all agents complete, a merge agent (gpt-4.1-mini by default, configurable via orchestration settings) combines their outputs into a single coherent response. If any agent fails, the entire orchestration fails.",
    },

    // ─── ENTITY CONFIGURATION ──────────────────────────────────────

    {
      type: "heading", level: 2, text: "Entity Configuration", id: "entity-config",
    },
    {
      type: "prose",
      text: "Each entity in an orchestration has a role description and optional configuration. The role description is critical for the Supervisor strategy — it tells the coordinator what the entity specializes in. For Sequential and Parallel, the role is descriptive metadata. Entity config can override max_steps (default 10) to control how many ReAct iterations the entity agent runs.",
    },
    {
      type: "code",
      snippets: {
        python: `# Create an orchestration with the supervisor strategy
response = requests.post(
    f"{BASE_URL}/api/orchestrations",
    headers=headers,
    json={
        "name": "Customer Support Team",
        "strategy": "supervisor",
    },
)
orch = response.json()
orch_id = orch["id"]

# Add entity agents with clear role descriptions
requests.post(
    f"{BASE_URL}/api/orchestrations/{orch_id}/entities",
    headers=headers,
    json={
        "agent_id": billing_agent_id,
        "role": "Handles billing inquiries, invoices, payments, and refund requests",
    },
)

requests.post(
    f"{BASE_URL}/api/orchestrations/{orch_id}/entities",
    headers=headers,
    json={
        "agent_id": tech_agent_id,
        "role": "Handles technical issues, API errors, integration problems, and setup questions",
    },
)`,
        typescript: `// Create an orchestration with the supervisor strategy
const orchRes = await fetch(\`\${BASE_URL}/api/orchestrations\`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    name: "Customer Support Team",
    strategy: "supervisor",
  }),
});
const orch = await orchRes.json();

// Add entity agents with clear role descriptions
await fetch(\`\${BASE_URL}/api/orchestrations/\${orch.id}/entities\`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    agent_id: billingAgentId,
    role: "Handles billing inquiries, invoices, payments, and refund requests",
  }),
});

await fetch(\`\${BASE_URL}/api/orchestrations/\${orch.id}/entities\`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    agent_id: techAgentId,
    role: "Handles technical issues, API errors, integration problems, and setup questions",
  }),
});`,
        curl: `# Create orchestration
curl -X POST '{BASE_URL}/api/orchestrations' \\
  -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Customer Support Team", "strategy": "supervisor"}'

# Add billing agent entity
curl -X POST '{BASE_URL}/api/orchestrations/{orch_id}/entities' \\
  -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{"agent_id": "{billing_agent_id}", "role": "Handles billing inquiries, invoices, and payments"}'`,
      },
    },

    // ─── STREAMING EVENTS ──────────────────────────────────────────

    {
      type: "heading", level: 2, text: "Streaming Events", id: "streaming",
    },
    {
      type: "prose",
      text: "Orchestration streaming exposes the full execution flow via SSE. For the Supervisor strategy, you see delegation events as the coordinator routes tasks to entities. For Sequential, you see step events as each agent runs. For Parallel, events from concurrent agents may interleave.",
    },
    {
      type: "table",
      headers: ["Event", "Description"],
      rows: [
        ["start", "Orchestration run started — includes run_id and session_id"],
        ["orchestration_started", "Execution has begun with the configured strategy"],
        ["delegation_started", "Supervisor: coordinator is delegating a task to an entity agent"],
        ["delegation_completed", "Supervisor: entity agent finished its subtask"],
        ["sequential_step", "Sequential: an agent in the pipeline has started/completed"],
        ["tool_call / tool_result", "An entity agent is calling/receiving a tool"],
        ["chunk", "Text chunk from the final response"],
        ["complete", "Orchestration run finished — includes content, usage, steps"],
        ["error", "An error occurred during execution"],
      ],
    },

    // ─── LIMITS ────────────────────────────────────────────────────

    {
      type: "heading", level: 2, text: "Limits", id: "limits",
    },
    {
      type: "table",
      headers: ["Constraint", "Default", "Notes"],
      rows: [
        ["Coordinator max steps", "25", "Supervisor strategy: how many ReAct steps the coordinator gets"],
        ["Entity max steps", "10", "Per-entity ReAct step limit, configurable in entity config"],
        ["Max orchestration depth", "3", "Prevents recursive delegation loops (coordinator → entity → sub-delegation)"],
        ["Parallel merge model", "gpt-4.1-mini", "Configurable via orchestration settings. Used to combine parallel agent outputs."],
      ],
    },

    // ─── NEXT STEPS ────────────────────────────────────────────────

    {
      type: "heading", level: 2, text: "Next Steps", id: "next-steps",
    },
    {
      type: "card-grid",
      cards: [
        {
          title: "Orchestration Guide",
          description: "Create an orchestration and run it step by step.",
          icon: "Network",
          target: { type: "guide", guideId: "orchestration" },
        },
        {
          title: "Agents & Tools",
          description: "Understand the ReAct loop and tool system that powers each entity.",
          icon: "Bot",
          target: { type: "concept", conceptId: "agents-tools" },
        },
        {
          title: "Workflows",
          description: "For deterministic multi-step pipelines, use workflows instead.",
          icon: "Workflow",
          target: { type: "concept", conceptId: "workflows-concept" },
        },
        {
          title: "Orchestrations API Reference",
          description: "Full endpoint documentation.",
          icon: "Network",
          target: { type: "reference", sectionId: "orchestrations" },
        },
      ],
    },
  ],
};
