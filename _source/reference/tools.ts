// api/_data/reference/tools.ts
import type { ReferenceSection } from "../types";

export const toolsReference: ReferenceSection = {
  id: "tools",
  title: "Tools",
  description: "Manage custom tools and view builtin tools available to agents.",
  introduction: "Tools extend agent capabilities beyond conversation. The platform provides builtin tools (database_query, database_write, http_request, code_execute, storage_read, storage_write, web_search, web_scrape) and lets you create custom tools that call your own endpoints. Custom tools are defined with a name, description, JSON Schema for inputs, and an endpoint URL that the platform calls when the agent uses the tool.",
  commonPatterns: "List available tools with GET /api/tools to see both builtin and custom tools. Create custom tools with a clear description and input schema — agents use the description to decide when to call the tool. Assign tools to agents via the agent tools API (POST /api/agents/{id}/tools).",
  groups: [
    {
      endpoints: [
        {
          method: "GET", path: "/api/tools",
          description: "List all tools (builtin: database_query, database_write, http_request, code_execute, storage_read, storage_write, web_search, web_scrape + custom).",
          snippets: {
            python: `response = requests.get(f"{BASE_URL}/api/tools", headers=headers)`,
            typescript: `const res = await fetch(\`\${BASE_URL}/api/tools\`, { headers });`,
            curl: `curl '{BASE_URL}/api/tools' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"`,
          },
        },
        {
          method: "POST", path: "/api/tools",
          description: "Create a custom tool (HTTP endpoint with JSON schema).",
          requestBody: `{\n  "name": "weather_lookup",\n  "description": "Get current weather for a city",\n  "endpoint_url": "https://api.weather.com/v1/current",\n  "method": "GET",\n  "input_schema": {\n    "type": "object",\n    "properties": {\n      "city": { "type": "string" }\n    },\n    "required": ["city"]\n  }\n}`,
          snippets: {
            python: `response = requests.post(f"{BASE_URL}/api/tools", headers=headers, json={\n    "name": "weather_lookup",\n    "description": "Get current weather",\n    "endpoint_url": "https://api.weather.com/v1/current",\n    "method": "GET",\n    "input_schema": {"type": "object", "properties": {"city": {"type": "string"}}, "required": ["city"]},\n})`,
            typescript: `const res = await fetch(\`\${BASE_URL}/api/tools\`, { method: "POST", headers, body: JSON.stringify({\n  name: "weather_lookup",\n  description: "Get current weather",\n  endpoint_url: "https://api.weather.com/v1/current",\n  method: "GET",\n  input_schema: { type: "object", properties: { city: { type: "string" } }, required: ["city"] },\n}) });`,
            curl: `curl -X POST '{BASE_URL}/api/tools' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}" -H "Content-Type: application/json" -d '{"name": "weather_lookup", ...}'`,
          },
        },
        {
          method: "GET", path: "/api/tools/{id}",
          description: "Get a tool definition by ID.",
          parameters: [{ name: "id", in: "path", type: "string", required: true, description: "Tool ID" }],
          snippets: {
            python: `response = requests.get(f"{BASE_URL}/api/tools/{tool_id}", headers=headers)`,
            typescript: `const res = await fetch(\`\${BASE_URL}/api/tools/\${toolId}\`, { headers });`,
            curl: `curl '{BASE_URL}/api/tools/{id}' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"`,
          },
        },
        {
          method: "PUT", path: "/api/tools/{id}",
          description: "Update a custom tool.",
          parameters: [{ name: "id", in: "path", type: "string", required: true, description: "Tool ID" }],
          snippets: {
            python: `response = requests.put(f"{BASE_URL}/api/tools/{tool_id}", headers=headers, json={"description": "Updated"})`,
            typescript: `await fetch(\`\${BASE_URL}/api/tools/\${toolId}\`, { method: "PUT", headers, body: JSON.stringify({ description: "Updated" }) });`,
            curl: `curl -X PUT '{BASE_URL}/api/tools/{id}' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}" -H "Content-Type: application/json" -d '{"description": "Updated"}'`,
          },
        },
        {
          method: "DELETE", path: "/api/tools/{id}",
          description: "Delete a custom tool.",
          parameters: [{ name: "id", in: "path", type: "string", required: true, description: "Tool ID" }],
          snippets: {
            python: `response = requests.delete(f"{BASE_URL}/api/tools/{tool_id}", headers=headers)`,
            typescript: `await fetch(\`\${BASE_URL}/api/tools/\${toolId}\`, { method: "DELETE", headers });`,
            curl: `curl -X DELETE '{BASE_URL}/api/tools/{id}' -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"`,
          },
        },
      ],
    },
  ],
  errorResponses: [
    { status: 400, code: "invalid_schema", description: "The tool's input_schema is not valid JSON Schema" },
    { status: 404, code: "tool_not_found", description: "No tool exists with the given ID" },
  ],
};
