// api/_data/guides/upload-document.ts
import type { Guide } from "../types";

export const uploadDocumentGuide: Guide = {
  id: "upload-document",
  title: "Upload Your First Document",
  description:
    "Upload a file (PDF, DOCX, images, etc.) and extract its content. Extracted text becomes available for knowledge base indexing.",
  prerequisites: ["Authentication configured (see Authentication guide)"],
  introduction:
    "Uploading a document creates a Source — the platform's representation of your file. After upload, an asynchronous extraction pipeline converts the file into structured page texts. You'll poll for status and then retrieve the extracted content.",
  steps: [
    {
      title: "Upload a file",
      description:
        "Send a multipart form-data request with your file. The server starts extraction automatically and returns the source metadata.",
      endpoint: "POST /api/sources/upload",
      snippets: {
        python: `with open("document.pdf", "rb") as f:
    response = requests.post(
        f"{BASE_URL}/api/sources/upload",
        headers={"apikey": API_KEY, "Authorization": f"Bearer {API_KEY}"},
        files={"file": ("document.pdf", f, "application/pdf")},
    )
source = response.json()
source_id = source["id"]
print(f"Source created: {source_id}")`,
        typescript: `const formData = new FormData();
formData.append("file", fileBlob, "document.pdf");

const response = await fetch(\`\${BASE_URL}/api/sources/upload\`, {
  method: "POST",
  headers: { apikey: API_KEY, Authorization: \`Bearer \${API_KEY}\` },
  body: formData,
});
const source = await response.json();
console.log("Source created:", source.id);`,
        curl: `curl -X POST '{BASE_URL}/api/sources/upload' \\\n  -H "apikey: {API_KEY}" \\\n  -H "Authorization: Bearer {API_KEY}" \\\n  -F "file=@document.pdf"`,
      },
      responseExample: `{\n  "id": "source-uuid",\n  "filename": "document.pdf",\n  "content_type": "application/pdf",\n  "extraction_status": "pending",\n  "created_at": "2026-01-01T00:00:00Z"\n}`,
    },
    {
      title: "Check extraction status",
      description:
        "Poll the source until extraction_status reaches a terminal state: extracted (success), attention_required (partial — some pages failed but the source is still indexable), failed, or cancelled. Typically takes a few seconds for small documents.",
      endpoint: "GET /api/sources/{id}",
      snippets: {
        python: `import time

TERMINAL = {"extracted", "attention_required", "failed", "cancelled"}
while True:
    response = requests.get(
        f"{BASE_URL}/api/sources/{source_id}",
        headers=headers,
    )
    body = response.json()
    status = body["extraction_status"]
    if status == "extracted":
        print("Extraction complete!")
        break
    elif status == "attention_required":
        print("Extraction partial:", body.get("error_message"))
        break
    elif status in ("failed", "cancelled"):
        print(f"Extraction {status}:", body.get("error_message"))
        break
    time.sleep(2)`,
        typescript: `const TERMINAL = new Set(["extracted", "attention_required", "failed", "cancelled"]);
let status = "pending";
while (!TERMINAL.has(status)) {
  await new Promise((r) => setTimeout(r, 2000));
  const res = await fetch(\`\${BASE_URL}/api/sources/\${sourceId}\`, { headers });
  const data = await res.json();
  status = data.extraction_status;
}
console.log("Extraction ended with status:", status);`,
        curl: `curl '{BASE_URL}/api/sources/{source_id}' \\\n  -H "apikey: {API_KEY}" \\\n  -H "Authorization: Bearer {API_KEY}"`,
      },
    },
    {
      title: "View extracted content",
      description:
        "Retrieve the extracted text, organized by page. Each page includes its text content and page number.",
      endpoint: "GET /api/sources/{id}/page-texts",
      snippets: {
        python: `response = requests.get(
    f"{BASE_URL}/api/sources/{source_id}/page-texts",
    headers=headers,
)
pages = response.json()
for page in pages:
    print(f"Page {page['page']}: {page['text'][:100]}...")`,
        typescript: `const res = await fetch(
  \`\${BASE_URL}/api/sources/\${sourceId}/page-texts\`,
  { headers },
);
const pages = await res.json();
pages.forEach((p: any) => console.log(\`Page \${p.page}: \${p.text.slice(0, 100)}...\`));`,
        curl: `curl '{BASE_URL}/api/sources/{source_id}/page-texts' \\\n  -H "apikey: {API_KEY}" \\\n  -H "Authorization: Bearer {API_KEY}"`,
      },
    },
  ],
  whatNext: [
    {
      title: "Create a Knowledge Base",
      description: "Index your extracted content for semantic search.",
      icon: "Database",
      target: { type: "guide", guideId: "create-knowledge-base" },
    },
    {
      title: "Sources & Extraction",
      description: "Understand the extraction pipeline in depth.",
      icon: "FileText",
      target: { type: "concept", conceptId: "sources-extraction" },
    },
    {
      title: "Sources API Reference",
      description: "Full endpoint documentation.",
      icon: "FileText",
      target: { type: "reference", sectionId: "sources" },
    },
  ],
};
