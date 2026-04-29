// api/_data/guides/streaming-guide.ts
import type { Guide } from "../types";

export const streamingGuide: Guide = {
  id: "streaming-guide",
  title: "Streaming Responses",
  description:
    "Consume Server-Sent Events from agent runs. Learn to parse events, handle tool calls, manage errors, and build multi-turn conversations.",
  prerequisites: ["An agent created (see Build an Agent guide)"],
  introduction:
    "Agent runs stream results as Server-Sent Events (SSE). Each event is a JSON object prefixed with `data: ` on its own line. This guide walks through parsing every event type, rendering tool calls in a UI, handling errors gracefully, and chaining multi-turn conversations with session IDs.",
  steps: [
    {
      title: "Basic streaming request",
      description:
        "Send a message to an agent and open an SSE stream. Read lines, filter for `data: ` prefixes, and parse each event as JSON.",
      endpoint: "POST /api/agents/{id}/run/stream",
      snippets: {
        python: `import requests
import json

response = requests.post(
    f"{BASE_URL}/api/agents/{agent_id}/run/stream",
    headers=headers,
    json={"message": "Hello, what can you help me with?"},
    stream=True,
)

for line in response.iter_lines():
    if not line:
        continue
    text = line.decode("utf-8")
    if text.startswith("data: "):
        event = json.loads(text[6:])
        print(event["event"], "->", event.get("content", "")[:80])`,
        typescript: `const response = await fetch(\`\${BASE_URL}/api/agents/\${agentId}/run/stream\`, {
  method: "POST",
  headers,
  body: JSON.stringify({ message: "Hello, what can you help me with?" }),
});

const reader = response.body!.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const text = decoder.decode(value);
  for (const line of text.split("\\n")) {
    if (line.startsWith("data: ")) {
      const event = JSON.parse(line.slice(6));
      console.log(event.event, "->", (event.content ?? "").slice(0, 80));
    }
  }
}`,
        curl: `curl -N -X POST '{BASE_URL}/api/agents/{agent_id}/run/stream' \\\n  -H "apikey: {API_KEY}" \\\n  -H "Authorization: Bearer {API_KEY}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"message": "Hello, what can you help me with?"}'`,
      },
      notes:
        "The -N flag in curl disables output buffering so events appear in real time.",
    },
    {
      title: "Parse all event types",
      description:
        "Handle every event the stream can emit: start, chunk, tool_call, tool_result, step_started, step_completed, complete, and error.",
      endpoint: "POST /api/agents/{id}/run/stream",
      snippets: {
        python: `session_id = None
full_response = []

for line in response.iter_lines():
    if not line:
        continue
    text = line.decode("utf-8")
    if not text.startswith("data: "):
        continue

    event = json.loads(text[6:])
    etype = event["event"]

    if etype == "start":
        session_id = event["session_id"]
        print(f"Run started — session: {session_id}, run: {event['run_id']}")

    elif etype == "step_started":
        print(f"Step {event['step_number']} started")

    elif etype == "chunk":
        full_response.append(event["content"])
        print(event["content"], end="", flush=True)

    elif etype == "tool_call":
        print(f"\\n[Tool call: {event['tool_name']}({json.dumps(event.get('arguments', {}))})]")

    elif etype == "tool_result":
        print(f"[Tool result: {str(event.get('result', ''))[:100]}]")

    elif etype == "step_completed":
        print(f"\\nStep {event['step_number']} completed")

    elif etype == "complete":
        print(f"\\n\\nRun complete — total tokens: {event.get('usage', {})}")

    elif etype == "error":
        print(f"\\nError: {event.get('message', 'Unknown error')}")`,
        typescript: `let sessionId: string | null = null;
const chunks: string[] = [];

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const text = decoder.decode(value);
  for (const line of text.split("\\n")) {
    if (!line.startsWith("data: ")) continue;
    const event = JSON.parse(line.slice(6));

    switch (event.event) {
      case "start":
        sessionId = event.session_id;
        console.log(\`Run started — session: \${sessionId}, run: \${event.run_id}\`);
        break;
      case "step_started":
        console.log(\`Step \${event.step_number} started\`);
        break;
      case "chunk":
        chunks.push(event.content);
        process.stdout.write(event.content);
        break;
      case "tool_call":
        console.log(\`\\n[Tool call: \${event.tool_name}(\${JSON.stringify(event.arguments ?? {})})]\`);
        break;
      case "tool_result":
        console.log(\`[Tool result: \${String(event.result ?? "").slice(0, 100)}]\`);
        break;
      case "step_completed":
        console.log(\`\\nStep \${event.step_number} completed\`);
        break;
      case "complete":
        console.log(\`\\n\\nRun complete — usage: \${JSON.stringify(event.usage ?? {})}\`);
        break;
      case "error":
        console.error(\`Error: \${event.message ?? "Unknown error"}\`);
        break;
    }
  }
}`,
        curl: `# curl streams all events to stdout — pipe through jq for pretty printing
curl -N -X POST '{BASE_URL}/api/agents/{agent_id}/run/stream' \\
  -H "apikey: {API_KEY}" \\
  -H "Authorization: Bearer {API_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Search for information about our API"}'

# Each line is a JSON event prefixed with "data: "
# data: {"event":"start","run_id":"...","session_id":"..."}
# data: {"event":"chunk","content":"Based on..."}
# data: {"event":"complete","run_id":"..."}`,
      },
    },
    {
      title: "Handle tool calls in the UI",
      description:
        "Display tool calls and results as collapsible cards in a chat UI. Use the tool_call event to show a loading indicator, then update with the tool_result.",
      endpoint: "POST /api/agents/{id}/run/stream",
      snippets: {
        python: `# Example: collect tool call/result pairs for UI rendering
tool_calls = []

for line in response.iter_lines():
    if not line:
        continue
    text = line.decode("utf-8")
    if not text.startswith("data: "):
        continue

    event = json.loads(text[6:])

    if event["event"] == "tool_call":
        tool_calls.append({
            "name": event["tool_name"],
            "arguments": event.get("arguments", {}),
            "status": "running",
            "result": None,
        })
        # UI: render a loading card for this tool call

    elif event["event"] == "tool_result":
        if tool_calls:
            tool_calls[-1]["status"] = "complete"
            tool_calls[-1]["result"] = event.get("result")
        # UI: update the card with the result

    elif event["event"] == "chunk":
        # UI: append to the assistant message bubble
        pass`,
        typescript: `interface ToolCallUI {
  name: string;
  arguments: Record<string, unknown>;
  status: "running" | "complete";
  result: unknown;
}

const toolCalls: ToolCallUI[] = [];
let assistantMessage = "";

// Inside your SSE parsing loop:
switch (event.event) {
  case "tool_call":
    toolCalls.push({
      name: event.tool_name,
      arguments: event.arguments ?? {},
      status: "running",
      result: null,
    });
    // Re-render: show a spinner card for the tool call
    break;

  case "tool_result":
    if (toolCalls.length > 0) {
      const last = toolCalls[toolCalls.length - 1];
      last.status = "complete";
      last.result = event.result;
    }
    // Re-render: replace spinner with result content
    break;

  case "chunk":
    assistantMessage += event.content;
    // Re-render: update the streaming text
    break;
}`,
        curl: `# Tool call events appear inline in the SSE stream:\n# data: {"event":"tool_call","tool_name":"knowledge_base_search","arguments":{"query":"API setup"}}\n# data: {"event":"tool_result","result":[{"text":"To set up the API...","score":0.92}]}\n# data: {"event":"chunk","content":"Based on the documentation, "}`,
      },
      notes:
        "Tool calls always appear in pairs: a tool_call event followed by a tool_result event. Multiple tool calls can occur in a single step if the agent decides to call several tools.",
    },
    {
      title: "Error handling",
      description:
        "Handle error events from the stream and connection-level failures. Always wrap your stream reader in a try/catch.",
      endpoint: "POST /api/agents/{id}/run/stream",
      snippets: {
        python: `try:
    response = requests.post(
        f"{BASE_URL}/api/agents/{agent_id}/run/stream",
        headers=headers,
        json={"message": "What is the refund policy?"},
        stream=True,
        timeout=60,
    )
    response.raise_for_status()

    for line in response.iter_lines():
        if not line:
            continue
        text = line.decode("utf-8")
        if not text.startswith("data: "):
            continue

        event = json.loads(text[6:])

        if event["event"] == "error":
            print(f"Agent error: {event.get('message', 'Unknown')}")
            print(f"Error code: {event.get('code', 'N/A')}")
            break

        if event["event"] == "chunk":
            print(event["content"], end="")

except requests.exceptions.ConnectionError:
    print("Connection lost — retry with exponential backoff")
except requests.exceptions.Timeout:
    print("Request timed out")
except json.JSONDecodeError as e:
    print(f"Malformed SSE event: {e}")`,
        typescript: `try {
  const response = await fetch(\`\${BASE_URL}/api/agents/\${agentId}/run/stream\`, {
    method: "POST",
    headers,
    body: JSON.stringify({ message: "What is the refund policy?" }),
    signal: AbortSignal.timeout(60_000),
  });

  if (!response.ok) {
    const body = await response.json();
    throw new Error(\`HTTP \${response.status}: \${body.error ?? "Unknown"}\`);
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const text = decoder.decode(value);
    for (const line of text.split("\\n")) {
      if (!line.startsWith("data: ")) continue;
      const event = JSON.parse(line.slice(6));

      if (event.event === "error") {
        console.error(\`Agent error: \${event.message ?? "Unknown"}\`);
        console.error(\`Error code: \${event.code ?? "N/A"}\`);
        return; // Stop processing
      }

      if (event.event === "chunk") {
        process.stdout.write(event.content);
      }
    }
  }
} catch (err) {
  if (err instanceof DOMException && err.name === "TimeoutError") {
    console.error("Request timed out");
  } else {
    console.error("Connection error:", err);
  }
}`,
        curl: `# curl exits with non-zero status on connection errors\n# Use --max-time for a timeout\ncurl -N --max-time 60 -X POST '{BASE_URL}/api/agents/{agent_id}/run/stream' \\\n  -H "apikey: {API_KEY}" \\\n  -H "Authorization: Bearer {API_KEY}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"message": "What is the refund policy?"}'\n\n# Check exit code: 0 = success, 28 = timeout, 7 = connection refused`,
      },
      notes:
        "Error events have an optional `code` field (e.g., \"rate_limited\", \"context_length_exceeded\"). Always check for HTTP-level errors before reading the stream.",
    },
    {
      title: "Multi-turn with session_id",
      description:
        "The `start` event includes a `session_id`. Pass it in subsequent requests to continue the conversation with full message history.",
      endpoint: "POST /api/agents/{id}/run/stream",
      snippets: {
        python: `import json

def chat(agent_id: str, message: str, session_id: str | None = None) -> str:
    """Send a message and return (response_text, session_id)."""
    body = {"message": message}
    if session_id:
        body["session_id"] = session_id

    response = requests.post(
        f"{BASE_URL}/api/agents/{agent_id}/run/stream",
        headers=headers,
        json=body,
        stream=True,
    )

    result_text = []
    sid = session_id
    for line in response.iter_lines():
        if not line:
            continue
        text = line.decode("utf-8")
        if not text.startswith("data: "):
            continue
        event = json.loads(text[6:])
        if event["event"] == "start":
            sid = event["session_id"]
        elif event["event"] == "chunk":
            result_text.append(event["content"])
    return "".join(result_text), sid

# First message — no session yet
answer1, session_id = chat(agent_id, "What products do you offer?")
print(answer1)

# Follow-up — same session, agent remembers context
answer2, session_id = chat(agent_id, "Which one is best for small teams?", session_id)
print(answer2)`,
        typescript: `async function chat(
  agentId: string,
  message: string,
  sessionId?: string,
): Promise<{ text: string; sessionId: string }> {
  const body: Record<string, string> = { message };
  if (sessionId) body.session_id = sessionId;

  const response = await fetch(\`\${BASE_URL}/api/agents/\${agentId}/run/stream\`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  const chunks: string[] = [];
  let sid = sessionId ?? "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    for (const line of decoder.decode(value).split("\\n")) {
      if (!line.startsWith("data: ")) continue;
      const event = JSON.parse(line.slice(6));
      if (event.event === "start") sid = event.session_id;
      if (event.event === "chunk") chunks.push(event.content);
    }
  }
  return { text: chunks.join(""), sessionId: sid };
}

// First message
const turn1 = await chat(agentId, "What products do you offer?");
console.log(turn1.text);

// Follow-up with session context
const turn2 = await chat(agentId, "Which one is best for small teams?", turn1.sessionId);
console.log(turn2.text);`,
        curl: `# Turn 1 — capture the session_id from the start event\ncurl -N -X POST '{BASE_URL}/api/agents/{agent_id}/run/stream' \\\n  -H "apikey: {API_KEY}" \\\n  -H "Authorization: Bearer {API_KEY}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"message": "What products do you offer?"}'\n\n# Turn 2 — pass session_id for conversation continuity\ncurl -N -X POST '{BASE_URL}/api/agents/{agent_id}/run/stream' \\\n  -H "apikey: {API_KEY}" \\\n  -H "Authorization: Bearer {API_KEY}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"message": "Which one is best for small teams?", "session_id": "{session_id}"}'`,
      },
      notes:
        "Sessions persist the full conversation history. You can also list session messages via GET /api/sessions/{session_id}/messages.",
    },
  ],
  whatNext: [
    {
      title: "Streaming Patterns",
      description: "Understand the SSE protocol and event lifecycle in depth.",
      icon: "Radio",
      target: { type: "concept", conceptId: "streaming-patterns" },
    },
    {
      title: "Build an Agent",
      description: "Create an agent from scratch with tools and knowledge bases.",
      icon: "Bot",
      target: { type: "guide", guideId: "build-agent" },
    },
    {
      title: "Agents API Reference",
      description: "Full endpoint documentation for agent runs.",
      icon: "FileText",
      target: { type: "reference", sectionId: "agents" },
    },
  ],
};
