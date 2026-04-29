// api/_data/reference/sources.ts
import type { ReferenceSection } from "../types";

export const sourcesReference: ReferenceSection = {
  id: "sources",
  title: "Sources",
  description: "Upload, manage, and extract content from documents and files.",
  introduction: "Sources represent uploaded documents in the platform. Each source goes through an asynchronous extraction pipeline that converts files into structured derivatives (page texts, markdown, per-page images). Sources are the raw material for knowledge bases — once extracted, their content can be chunked and indexed for semantic search.",
  commonPatterns: "The typical flow is: upload a file (POST /api/sources/upload), poll for completion (GET /api/sources/{id} until extraction_status is 'extracted' or 'attention_required'), then retrieve extracted text (GET /api/sources/{id}/page-texts). For files already in project storage, use import-from-storage. For web pages, use import-url. To swap extraction backends after the fact, POST /api/sources/{id}/reextract with a new extraction_model.",
  groups: [
    {
      endpoints: [
        {
          method: "GET",
          path: "/api/sources",
          description: "List all sources with optional status filter.",
          parameters: [
            { name: "status", in: "query", type: "string", required: false, description: "Filter by extraction_status. One of: pending, extracting, extracted, attention_required, failed, cancelled." },
          ],
          snippets: {
            python: `response = requests.get(f"{BASE_URL}/api/sources", headers=headers)\nprint(response.json())`,
            typescript: `const res = await fetch(\`\${BASE_URL}/api/sources\`, { headers });\nconst sources = await res.json();`,
            curl: `curl '{BASE_URL}/api/sources' \\\n  -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"`,
          },
        },
        {
          method: "POST",
          path: "/api/sources/upload",
          description: "Upload a file for extraction. Accepts PDF, DOCX, PPTX, XLSX, images (PNG/JPG/WebP/GIF/TIFF), and plain text. Uses multipart/form-data. Optional fields: name (display name), metadata (JSON string, preserved through indexing), extraction_model (PDF only — one of auto, mistral, paddleocr, lighton, opendataloader, fitz, pdfplumber).",
          snippets: {
            python: `with open("file.pdf", "rb") as f:\n    response = requests.post(\n        f"{BASE_URL}/api/sources/upload",\n        headers={"apikey": API_KEY, "Authorization": f"Bearer {API_KEY}"},\n        files={"file": ("file.pdf", f, "application/pdf")},\n        data={"extraction_model": "mistral"},\n    )`,
            typescript: `const form = new FormData();\nform.append("file", blob, "file.pdf");\nform.append("extraction_model", "mistral");\nconst res = await fetch(\`\${BASE_URL}/api/sources/upload\`, {\n  method: "POST",\n  headers: { apikey: API_KEY, Authorization: \`Bearer \${API_KEY}\` },\n  body: form,\n});`,
            curl: `curl -X POST '{BASE_URL}/api/sources/upload' \\\n  -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}" \\\n  -F "file=@file.pdf" \\\n  -F "extraction_model=mistral"`,
          },
        },
        {
          method: "POST",
          path: "/api/sources/import-from-storage",
          description: "Import a file already in project storage as a source.",
          requestBody: `{\n  "bucket": "documents",\n  "path": "reports/q4.pdf",\n  "name": "Q4 Report"\n}`,
          snippets: {
            python: `response = requests.post(\n    f"{BASE_URL}/api/sources/import-from-storage",\n    headers=headers,\n    json={"bucket": "documents", "path": "reports/q4.pdf"},\n)`,
            typescript: `const res = await fetch(\`\${BASE_URL}/api/sources/import-from-storage\`, {\n  method: "POST", headers,\n  body: JSON.stringify({ bucket: "documents", path: "reports/q4.pdf" }),\n});`,
            curl: `curl -X POST '{BASE_URL}/api/sources/import-from-storage' \\\n  -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"bucket": "documents", "path": "reports/q4.pdf"}'`,
          },
        },
        {
          method: "POST",
          path: "/api/sources/import-url",
          description: "Import content from web URLs. mode='urls' imports a fixed list, mode='crawl' spiders from a seed URL, mode='sitemap' parses a sitemap XML. Requires Firecrawl API key to be configured in project settings.",
          requestBody: `{\n  "mode": "urls",\n  "urls": ["https://example.com/page1", "https://example.com/page2"],\n  "max_pages": 50\n}`,
          snippets: {
            python: `response = requests.post(\n    f"{BASE_URL}/api/sources/import-url",\n    headers=headers,\n    json={"mode": "urls", "urls": ["https://example.com/page1"]},\n)`,
            typescript: `const res = await fetch(\`\${BASE_URL}/api/sources/import-url\`, {\n  method: "POST", headers,\n  body: JSON.stringify({ mode: "urls", urls: ["https://example.com/page1"] }),\n});`,
            curl: `curl -X POST '{BASE_URL}/api/sources/import-url' \\\n  -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"mode": "urls", "urls": ["https://example.com/page1"]}'`,
          },
        },
        {
          method: "GET",
          path: "/api/sources/{id}",
          description: "Get source details including extraction status.",
          parameters: [
            { name: "id", in: "path", type: "string", required: true, description: "Source ID" },
          ],
          snippets: {
            python: `response = requests.get(f"{BASE_URL}/api/sources/{source_id}", headers=headers)`,
            typescript: `const res = await fetch(\`\${BASE_URL}/api/sources/\${sourceId}\`, { headers });`,
            curl: `curl '{BASE_URL}/api/sources/{id}' \\\n  -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"`,
          },
        },
        {
          method: "GET",
          path: "/api/sources/{id}/page-texts",
          description: "Get extracted text content organized by page.",
          parameters: [
            { name: "id", in: "path", type: "string", required: true, description: "Source ID" },
            { name: "page", in: "query", type: "integer", required: false, description: "Specific page number" },
          ],
          snippets: {
            python: `response = requests.get(f"{BASE_URL}/api/sources/{source_id}/page-texts", headers=headers)`,
            typescript: `const res = await fetch(\`\${BASE_URL}/api/sources/\${sourceId}/page-texts\`, { headers });`,
            curl: `curl '{BASE_URL}/api/sources/{id}/page-texts' \\\n  -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"`,
          },
        },
        {
          method: "PATCH",
          path: "/api/sources/{id}",
          description: "Update a source's display name or metadata.",
          parameters: [
            { name: "id", in: "path", type: "string", required: true, description: "Source ID" },
          ],
          requestBody: `{\n  "name": "New Display Name",\n  "metadata": { "author": "alice" }\n}`,
          snippets: {
            python: `response = requests.patch(f"{BASE_URL}/api/sources/{source_id}", headers=headers, json={"name": "New Display Name"})`,
            typescript: `const res = await fetch(\`\${BASE_URL}/api/sources/\${sourceId}\`, { method: "PATCH", headers, body: JSON.stringify({ name: "New Display Name" }) });`,
            curl: `curl -X PATCH '{BASE_URL}/api/sources/{id}' \\\n  -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"name": "New Display Name"}'`,
          },
        },
        {
          method: "POST",
          path: "/api/sources/{id}/reextract",
          description: "Re-run extraction on an existing source, optionally with a different extraction_model.",
          parameters: [
            { name: "id", in: "path", type: "string", required: true, description: "Source ID" },
          ],
          requestBody: `{\n  "extraction_model": "paddleocr"\n}`,
          snippets: {
            python: `response = requests.post(f"{BASE_URL}/api/sources/{source_id}/reextract", headers=headers, json={"extraction_model": "paddleocr"})`,
            typescript: `const res = await fetch(\`\${BASE_URL}/api/sources/\${sourceId}/reextract\`, { method: "POST", headers, body: JSON.stringify({ extraction_model: "paddleocr" }) });`,
            curl: `curl -X POST '{BASE_URL}/api/sources/{id}/reextract' \\\n  -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"extraction_model": "paddleocr"}'`,
          },
        },
        {
          method: "POST",
          path: "/api/sources/{id}/cancel",
          description: "Cancel an in-progress extraction. Sets extraction_status to 'cancelled'.",
          parameters: [
            { name: "id", in: "path", type: "string", required: true, description: "Source ID" },
          ],
          snippets: {
            python: `response = requests.post(f"{BASE_URL}/api/sources/{source_id}/cancel", headers=headers)`,
            typescript: `const res = await fetch(\`\${BASE_URL}/api/sources/\${sourceId}/cancel\`, { method: "POST", headers });`,
            curl: `curl -X POST '{BASE_URL}/api/sources/{id}/cancel' \\\n  -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"`,
          },
        },
        {
          method: "GET",
          path: "/api/sources/{id}/download",
          description: "Download the original uploaded file (as stored in project storage).",
          parameters: [
            { name: "id", in: "path", type: "string", required: true, description: "Source ID" },
          ],
          snippets: {
            python: `response = requests.get(f"{BASE_URL}/api/sources/{source_id}/download", headers=headers)\nopen("source.pdf", "wb").write(response.content)`,
            typescript: `const res = await fetch(\`\${BASE_URL}/api/sources/\${sourceId}/download\`, { headers });\nconst blob = await res.blob();`,
            curl: `curl '{BASE_URL}/api/sources/{id}/download' -o source.pdf \\\n  -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"`,
          },
        },
        {
          method: "GET",
          path: "/api/sources/{id}/derivatives/{type}/download",
          description: "Download a derivative artifact. type is one of: markdown, text, page_text, image. For per-page types (page_text, image) pass index=N (0-based) in the query string.",
          parameters: [
            { name: "id", in: "path", type: "string", required: true, description: "Source ID" },
            { name: "type", in: "path", type: "string", required: true, description: "Derivative type: markdown, text, page_text, or image" },
            { name: "index", in: "query", type: "integer", required: false, description: "0-based index for per-page derivatives (page_text, image)" },
          ],
          snippets: {
            python: `response = requests.get(f"{BASE_URL}/api/sources/{source_id}/derivatives/markdown/download", headers=headers)\nprint(response.text)`,
            typescript: `const res = await fetch(\`\${BASE_URL}/api/sources/\${sourceId}/derivatives/markdown/download\`, { headers });\nconst text = await res.text();`,
            curl: `curl '{BASE_URL}/api/sources/{id}/derivatives/markdown/download' \\\n  -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"`,
          },
        },
        {
          method: "DELETE",
          path: "/api/sources/{id}",
          description: "Delete a source and its associated storage files (original + derivatives).",
          parameters: [
            { name: "id", in: "path", type: "string", required: true, description: "Source ID" },
          ],
          snippets: {
            python: `response = requests.delete(f"{BASE_URL}/api/sources/{source_id}", headers=headers)`,
            typescript: `await fetch(\`\${BASE_URL}/api/sources/\${sourceId}\`, { method: "DELETE", headers });`,
            curl: `curl -X DELETE '{BASE_URL}/api/sources/{id}' \\\n  -H "apikey: {API_KEY}" -H "Authorization: Bearer {API_KEY}"`,
          },
        },
      ],
    },
  ],
  errorResponses: [
    { status: 400, code: "invalid_file", description: "The uploaded file type is not supported or the file is corrupted" },
    { status: 404, code: "source_not_found", description: "No source exists with the given ID" },
    { status: 413, code: "file_too_large", description: "The uploaded file exceeds the maximum allowed size" },
  ],
};
