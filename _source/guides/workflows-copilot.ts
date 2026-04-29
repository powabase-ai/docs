// api/_data/guides/workflows-copilot.ts
import type { Guide } from "../types";

export const workflowsCopilotGuide: Guide = {
  id: "workflows-copilot",
  title: "Build Workflows with Copilot",
  description:
    "Describe what you want in natural language and let the AI copilot build the workflow graph for you. The copilot generates blocks and edges based on your description.",
  prerequisites: ["Authentication configured (see Authentication guide)"],
  introduction:
    "The AI copilot can generate a complete workflow graph from a natural language description. You create a copilot session linked to a workflow, describe what you want, and the copilot generates the blocks and edges. You can iterate through multiple chat turns to refine the workflow.",
  steps: [
    {
      title: "Create a workflow",
      description: "Create an empty workflow that the copilot will populate.",
      endpoint: "POST /api/workflows",
      snippets: {
        python: `response = requests.post(
    f"{BASE_URL}/api/workflows",
    headers=headers,
    json={"name": "Email Classifier"},
)
workflow = response.json()
wf_id = workflow["id"]`,
        typescript: `const response = await fetch(\`\${BASE_URL}/api/workflows\`, {
  method: "POST",
  headers,
  body: JSON.stringify({ name: "Email Classifier" }),
});
const workflow = await response.json();
const wfId = workflow.id;`,
        curl: `curl -X POST '{BASE_URL}/api/workflows' \\\n  -H "apikey: {API_KEY}" \\\n  -H "Authorization: Bearer {API_KEY}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"name": "Email Classifier"}'`,
      },
    },
    {
      title: "Start a copilot session",
      description: "Create a copilot session linked to the workflow.",
      endpoint: "POST /api/copilot/sessions",
      snippets: {
        python: `response = requests.post(
    f"{BASE_URL}/api/copilot/sessions",
    headers=headers,
    json={"workflow_id": wf_id},
)
session = response.json()
session_id = session["id"]`,
        typescript: `const response = await fetch(\`\${BASE_URL}/api/copilot/sessions\`, {
  method: "POST",
  headers,
  body: JSON.stringify({ workflow_id: wfId }),
});
const session = await response.json();
const sessionId = session.id;`,
        curl: `curl -X POST '{BASE_URL}/api/copilot/sessions' \\\n  -H "apikey: {API_KEY}" \\\n  -H "Authorization: Bearer {API_KEY}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"workflow_id": "{wf_id}"}'`,
      },
    },
    {
      title: "Describe your workflow",
      description:
        "Send a natural language description via the chat endpoint. The copilot responds with a streaming SSE response that includes the generated workflow graph.",
      endpoint: "POST /api/copilot/sessions/{id}/chat",
      snippets: {
        python: `response = requests.post(
    f"{BASE_URL}/api/copilot/sessions/{session_id}/chat",
    headers=headers,
    json={
        "message": "Build a workflow that takes an email as input, classifies it as spam/not-spam using an LLM, and outputs the classification with confidence score.",
    },
    stream=True,
)

message_id = None
for line in response.iter_lines():
    if not line:
        continue
    text = line.decode("utf-8")
    if text.startswith("data: "):
        event = json.loads(text[6:])
        if event.get("message_id"):
            message_id = event["message_id"]
        if event["event"] == "chunk":
            print(event["content"], end="")
print(f"\\nMessage ID: {message_id}")`,
        typescript: `const response = await fetch(\`\${BASE_URL}/api/copilot/sessions/\${sessionId}/chat\`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    message: "Build a workflow that takes an email as input, classifies it as spam/not-spam using an LLM, and outputs the classification with confidence score.",
  }),
});
// Parse SSE stream for chunks and message_id`,
        curl: `curl -N -X POST '{BASE_URL}/api/copilot/sessions/{session_id}/chat' \\\n  -H "apikey: {API_KEY}" \\\n  -H "Authorization: Bearer {API_KEY}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"message": "Build a workflow that classifies emails as spam or not-spam"}'`,
      },
    },
    {
      title: "Save the copilot's suggestion",
      description:
        "Save the copilot's generated workflow graph as a snapshot. This applies the blocks and edges to the workflow.",
      endpoint: "POST /api/copilot/sessions/{id}/messages/{mid}/snapshot",
      snippets: {
        python: `response = requests.post(
    f"{BASE_URL}/api/copilot/sessions/{session_id}/messages/{message_id}/snapshot",
    headers=headers,
)
print(response.json())`,
        typescript: `await fetch(
  \`\${BASE_URL}/api/copilot/sessions/\${sessionId}/messages/\${messageId}/snapshot\`,
  { method: "POST", headers },
);`,
        curl: `curl -X POST '{BASE_URL}/api/copilot/sessions/{session_id}/messages/{message_id}/snapshot' \\\n  -H "apikey: {API_KEY}" \\\n  -H "Authorization: Bearer {API_KEY}"`,
      },
    },
    {
      title: "Execute the workflow",
      description: "Run the copilot-built workflow with input data.",
      endpoint: "POST /api/workflows/{id}/execute",
      snippets: {
        python: `response = requests.post(
    f"{BASE_URL}/api/workflows/{wf_id}/execute",
    headers=headers,
    json={"input": {"email": "Congratulations! You've won a free iPhone..."}},
)
print(response.json())`,
        typescript: `const response = await fetch(\`\${BASE_URL}/api/workflows/\${wfId}/execute\`, {
  method: "POST",
  headers,
  body: JSON.stringify({ input: { email: "Congratulations! You've won a free iPhone..." } }),
});
console.log(await response.json());`,
        curl: `curl -X POST '{BASE_URL}/api/workflows/{wf_id}/execute' \\\n  -H "apikey: {API_KEY}" \\\n  -H "Authorization: Bearer {API_KEY}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"input": {"email": "Congratulations! You have won a free iPhone..."}}'`,
      },
      notes: "You can also build workflows programmatically via PUT /api/workflows/{id}/graph — see the Build Workflows Programmatically guide.",
    },
  ],
  whatNext: [
    {
      title: "Workflows (Programmatic)",
      description: "Fine-tune workflows by editing the graph directly.",
      icon: "Workflow",
      target: { type: "guide", guideId: "workflows-programmatic" },
    },
    {
      title: "Workflows",
      description: "Understand block types and graph execution.",
      icon: "Workflow",
      target: { type: "concept", conceptId: "workflows-concept" },
    },
    {
      title: "Copilot API Reference",
      description: "Full endpoint documentation.",
      icon: "BrainCircuit",
      target: { type: "reference", sectionId: "copilot" },
    },
  ],
};
