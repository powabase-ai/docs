// api/_data/reference/sessions.ts
import type { ReferenceSection } from "../types";

export const sessionsReference: ReferenceSection = {
  id: "sessions",
  title: "Sessions",
  description: "Manage multi-turn chat sessions and their message/run history.",
  introduction: "Sessions store the conversation history between users and agents. Each session contains messages (user inputs, assistant responses, tool calls, tool results, plus the retrieved context that grounded each assistant turn) and can span multiple agent runs. Sessions also track reasoning configuration on a per-run basis when the agent is configured for reasoning. Sessions persist until explicitly deleted, enabling long-running multi-turn conversations.",
  commonPatterns: "Sessions are created automatically when you run an agent without a session_id. To continue a conversation, pass the session_id from the start event of a previous run. Retrieve message history with GET /api/sessions/{id}/messages to display conversation context.",
  groups: [
    {
      endpoints: [
        {
          method: "GET", path: "/api/sessions/{id}",
          description: "Get a session by ID.",
          parameters: [{ name: "id", in: "path", type: "string", required: true, description: "Session ID" }],
          snippets: {
            python: `response = requests.get(f"{BASE_URL}/api/sessions/{session_id}", headers=headers)`,
            typescript: `const res = await fetch(\`\${BASE_URL}/api/sessions/\${sessionId}\`, { headers });`,
            curl: `curl '{BASE_URL}/api/sessions/{id}' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"`,
          },
        },
        {
          method: "GET", path: "/api/sessions/{id}/messages",
          description: "Get assembled chat messages for a session. Each assistant message includes its retrieved_context (knowledge-base chunks fetched during the run) so you can surface citations alongside replies.",
          parameters: [{ name: "id", in: "path", type: "string", required: true, description: "Session ID" }],
          snippets: {
            python: `response = requests.get(f"{BASE_URL}/api/sessions/{session_id}/messages", headers=headers)`,
            typescript: `const res = await fetch(\`\${BASE_URL}/api/sessions/\${sessionId}/messages\`, { headers });`,
            curl: `curl '{BASE_URL}/api/sessions/{id}/messages' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"`,
          },
        },
        {
          method: "GET", path: "/api/sessions/{id}/runs",
          description: "List all agent runs within a session.",
          parameters: [{ name: "id", in: "path", type: "string", required: true, description: "Session ID" }],
          snippets: {
            python: `response = requests.get(f"{BASE_URL}/api/sessions/{session_id}/runs", headers=headers)`,
            typescript: `const res = await fetch(\`\${BASE_URL}/api/sessions/\${sessionId}/runs\`, { headers });`,
            curl: `curl '{BASE_URL}/api/sessions/{id}/runs' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"`,
          },
        },
        {
          method: "DELETE", path: "/api/sessions/{id}",
          description: "Delete a session and all its runs.",
          parameters: [{ name: "id", in: "path", type: "string", required: true, description: "Session ID" }],
          snippets: {
            python: `response = requests.delete(f"{BASE_URL}/api/sessions/{session_id}", headers=headers)`,
            typescript: `await fetch(\`\${BASE_URL}/api/sessions/\${sessionId}\`, { method: "DELETE", headers });`,
            curl: `curl -X DELETE '{BASE_URL}/api/sessions/{id}' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"`,
          },
        },
      ],
    },
  ],
  errorResponses: [
    { status: 404, code: "session_not_found", description: "No session exists with the given ID" },
  ],
};
