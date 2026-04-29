import type { ConceptPage } from "../types";

export const streamingPatternsConcept: ConceptPage = {
  id: "streaming-patterns",
  title: "Streaming & SSE",
  description: "The platform uses Server-Sent Events (SSE) for real-time streaming of agent responses, orchestration flows, and workflow executions. This page covers the event format, event types, and consumption patterns.",
  content: [
    {
      type: "heading", level: 2, text: "SSE Overview", id: "sse-overview",
    },
    {
      type: "prose",
      text: "Server-Sent Events (SSE) provide a one-directional stream from server to client over a single HTTP connection. When you call a streaming endpoint (e.g. /api/agents/{id}/run/stream), the response is a text/event-stream with individual events sent as they occur. Each event is a JSON object prefixed with 'data: ' on a single line, separated by blank lines.",
    },
    {
      type: "heading", level: 2, text: "Agent Streaming Events", id: "agent-events",
    },
    {
      type: "table",
      headers: ["Event", "Key Fields", "Description"],
      rows: [
        ["start", "run_id, session_id", "Agent run has started — save session_id for multi-turn"],
        ["step_started", "step", "Agent is beginning a new reasoning step"],
        ["chunk", "content", "A piece of the agent's text response"],
        ["tool_call", "tool_name, arguments", "Agent is calling a tool with the given arguments"],
        ["tool_result", "tool_name, result", "Tool execution completed with this result"],
        ["step_completed", "step", "Agent finished a reasoning step"],
        ["approval_requested", "tool_name, tool_input", "Tool call paused — waiting for approval via the approve endpoint"],
        ["complete", "run_id", "Agent run finished"],
        ["error", "message", "An error occurred during execution"],
      ],
    },
    {
      type: "heading", level: 2, text: "Consuming SSE in Python", id: "python-consumer",
    },
    {
      type: "code",
      snippets: {
        python: `import requests
import json

response = requests.post(
    f"{BASE_URL}/api/agents/{agent_id}/run/stream",
    headers=headers,
    json={"message": "What can you help me with?"},
    stream=True,
)

for line in response.iter_lines():
    if not line:
        continue
    text = line.decode("utf-8")
    if text.startswith("data: "):
        event = json.loads(text[6:])
        event_type = event["event"]

        if event_type == "start":
            print(f"Session: {event['session_id']}")
        elif event_type == "chunk":
            print(event["content"], end="", flush=True)
        elif event_type == "tool_call":
            print(f"\\n[Calling {event['tool_name']}...]")
        elif event_type == "tool_result":
            print(f"[Tool returned result]")
        elif event_type == "error":
            print(f"\\nError: {event['message']}")
        elif event_type == "complete":
            print("\\nDone.")`,
        typescript: `const response = await fetch(\`\${BASE_URL}/api/agents/\${agentId}/run/stream\`, {
  method: "POST",
  headers,
  body: JSON.stringify({ message: "What can you help me with?" }),
});

const reader = response.body!.getReader();
const decoder = new TextDecoder();
let buffer = "";

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  buffer += decoder.decode(value, { stream: true });

  const lines = buffer.split("\\n");
  buffer = lines.pop() || "";

  for (const line of lines) {
    if (line.startsWith("data: ")) {
      const event = JSON.parse(line.slice(6));
      switch (event.event) {
        case "start":
          console.log("Session:", event.session_id);
          break;
        case "chunk":
          process.stdout.write(event.content);
          break;
        case "tool_call":
          console.log(\`\\n[Calling \${event.tool_name}...]\`);
          break;
        case "complete":
          console.log("\\nDone.");
          break;
      }
    }
  }
}`,
        curl: `# Stream events to terminal (each line is a JSON event)
curl -N -X POST '{BASE_URL}/api/agents/{agent_id}/run/stream' \\
  -H "apikey: {API_KEY}" \\
  -H "Authorization: Bearer {API_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{"message": "What can you help me with?"}'`,
      },
    },
    {
      type: "heading", level: 2, text: "Orchestration Events", id: "orchestration-events",
    },
    {
      type: "prose",
      text: "Orchestration streaming extends the agent event model with delegation events. You see the coordinator reasoning, delegating to entity agents, each entity's response, and the coordinator's final synthesis. Events like delegation_start and entity_chunk let you show which agent is currently working.",
    },
    {
      type: "heading", level: 2, text: "Workflow Streaming", id: "workflow-streaming",
    },
    {
      type: "prose",
      text: "Workflow streaming sends events as each block executes: block_started, block_output, block_completed, and the final workflow result. This lets you show a progress indicator for each step in a multi-block workflow.",
    },
    {
      type: "callout",
      variant: "tip",
      title: "Buffer handling",
      text: "SSE data may arrive in partial chunks — a single read() call might contain half an event or multiple events. Always buffer incoming data and split on newlines to ensure you process complete events.",
    },
    {
      type: "heading", level: 2, text: "Next Steps", id: "next-steps",
    },
    {
      type: "card-grid",
      cards: [
        {
          title: "Streaming Responses Guide",
          description: "Hands-on guide to consuming streaming events.",
          icon: "Radio",
          target: { type: "guide", guideId: "streaming-guide" },
        },
        {
          title: "Build an Agent",
          description: "Create an agent with streaming support.",
          icon: "Bot",
          target: { type: "guide", guideId: "build-agent" },
        },
        {
          title: "Agents API Reference",
          description: "Streaming endpoint documentation.",
          icon: "Bot",
          target: { type: "reference", sectionId: "agents" },
        },
      ],
    },
  ],
};
