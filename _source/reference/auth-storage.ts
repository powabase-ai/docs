// api/_data/reference/auth-storage.ts
//
// Auth + Storage are served by the control-plane platform proxy, not by the
// per-project service API. Routing is ref-only: /api/platform/auth/{ref}/*
// and /api/platform/storage/{ref}/*.  (Pre-port versions of this file used
// the legacy two-slug pattern `/api/organizations/{org}/projects/{proj}/*`,
// which is no longer wired up in the ported backend.)
//
// The {BASE_URL} placeholder in other reference files (agents, sources, etc.)
// resolves to the project PostgREST URL — wrong for these endpoints. Auth
// + Storage go through the STUDIO APP origin. We therefore use a literal
// placeholder "<PLATFORM_URL>" here and instruct readers to replace it with
// their Studio app base (e.g. http://localhost:3001 in dev).  Do NOT switch
// to {BASE_URL} without first teaching the page-level replacer about a
// second placeholder.
import type { ReferenceSection } from "../types";

const N = "\n";

export const authStorageReference: ReferenceSection = {
  id: "auth-storage",
  title: "Authentication & Storage",
  description:
    "Auth user management and storage operations are served by the control-plane proxy, not the per-project service API. Routing is ref-only: /api/platform/auth/{ref}/* and /api/platform/storage/{ref}/*.",
  introduction:
    "Auth and Storage endpoints are proxied through the control plane to each project's GoTrue (authentication) and Storage (file management) services. Substitute <PLATFORM_URL> with your Studio app's base URL (e.g. http://localhost:3001 in dev) and {ref} with your project ref.",
  commonPatterns:
    "For authentication, list users with GET /api/platform/auth/{ref}/users and create them with POST. For storage, list buckets and upload files under /api/platform/storage/{ref}/*. A platform JWT (signed-in user's access token) is required; service-role bypasses are not available through the proxy.",
  groups: [
    {
      title: "Authentication (via Control Plane)",
      endpoints: [
        {
          method: "GET",
          path: "/api/platform/auth/{ref}/users",
          description:
            "List project auth users. Full URL: GET <PLATFORM_URL>/api/platform/auth/{ref}/users",
          snippets: {
            python:
              `import requests${N}${N}` +
              `PLATFORM_URL = "http://localhost:3001"  # your Studio app base${N}` +
              `REF = "your-project-ref"${N}${N}` +
              `response = requests.get(${N}` +
              `    f"{PLATFORM_URL}/api/platform/auth/{REF}/users",${N}` +
              `    headers={"Authorization": "Bearer YOUR_PLATFORM_JWT"},${N}` +
              `)`,
            typescript:
              `const PLATFORM_URL = "http://localhost:3001";  // your Studio app base${N}` +
              `const ref = "your-project-ref";${N}` +
              `const res = await fetch(${N}` +
              `  \`\${PLATFORM_URL}/api/platform/auth/\${ref}/users\`,${N}` +
              `  { headers: { Authorization: \`Bearer \${platformJwt}\` } },${N}` +
              `);`,
            curl:
              `curl '<PLATFORM_URL>/api/platform/auth/{ref}/users' \\${N}` +
              `  -H "Authorization: Bearer YOUR_PLATFORM_JWT"`,
          },
        },
        {
          method: "POST",
          path: "/api/platform/auth/{ref}/users",
          description:
            "Create an auth user. Full URL: POST <PLATFORM_URL>/api/platform/auth/{ref}/users",
          snippets: {
            python:
              `requests.post(${N}` +
              `    f"{PLATFORM_URL}/api/platform/auth/{REF}/users",${N}` +
              `    headers={"Authorization": "Bearer YOUR_PLATFORM_JWT", "Content-Type": "application/json"},${N}` +
              `    json={"email": "user@example.com", "password": "securepass"},${N}` +
              `)`,
            typescript:
              `await fetch(${N}` +
              `  \`\${PLATFORM_URL}/api/platform/auth/\${ref}/users\`,${N}` +
              `  {${N}` +
              `    method: "POST",${N}` +
              `    headers: { Authorization: \`Bearer \${platformJwt}\`, "Content-Type": "application/json" },${N}` +
              `    body: JSON.stringify({ email: "user@example.com", password: "securepass" }),${N}` +
              `  },${N}` +
              `);`,
            curl:
              `curl -X POST '<PLATFORM_URL>/api/platform/auth/{ref}/users' \\${N}` +
              `  -H "Authorization: Bearer YOUR_PLATFORM_JWT" -H "Content-Type: application/json" \\${N}` +
              `  -d '{"email": "user@example.com", "password": "securepass"}'`,
          },
        },
      ],
    },
    {
      title: "Storage (via Control Plane)",
      endpoints: [
        {
          method: "GET",
          path: "/api/platform/storage/{ref}/buckets",
          description:
            "List storage buckets. Full URL: GET <PLATFORM_URL>/api/platform/storage/{ref}/buckets",
          snippets: {
            python:
              `response = requests.get(${N}` +
              `    f"{PLATFORM_URL}/api/platform/storage/{REF}/buckets",${N}` +
              `    headers={"Authorization": "Bearer YOUR_PLATFORM_JWT"},${N}` +
              `)`,
            typescript:
              `const res = await fetch(${N}` +
              `  \`\${PLATFORM_URL}/api/platform/storage/\${ref}/buckets\`,${N}` +
              `  { headers: { Authorization: \`Bearer \${platformJwt}\` } },${N}` +
              `);`,
            curl:
              `curl '<PLATFORM_URL>/api/platform/storage/{ref}/buckets' \\${N}` +
              `  -H "Authorization: Bearer YOUR_PLATFORM_JWT"`,
          },
        },
        {
          method: "POST",
          path: "/api/platform/storage/{ref}/object/{bucket}/{path}",
          description:
            "Upload a file. Full URL: POST <PLATFORM_URL>/api/platform/storage/{ref}/object/{bucket}/{path}",
          snippets: {
            python:
              `with open("file.txt", "rb") as f:${N}` +
              `    requests.post(${N}` +
              `        f"{PLATFORM_URL}/api/platform/storage/{REF}/object/mybucket/file.txt",${N}` +
              `        headers={"Authorization": "Bearer YOUR_PLATFORM_JWT"},${N}` +
              `        files={"file": f},${N}` +
              `    )`,
            typescript:
              `const form = new FormData();${N}` +
              `form.append("file", blob);${N}` +
              `await fetch(${N}` +
              `  \`\${PLATFORM_URL}/api/platform/storage/\${ref}/object/mybucket/file.txt\`,${N}` +
              `  { method: "POST", headers: { Authorization: \`Bearer \${platformJwt}\` }, body: form },${N}` +
              `);`,
            curl:
              `curl -X POST '<PLATFORM_URL>/api/platform/storage/{ref}/object/mybucket/file.txt' \\${N}` +
              `  -H "Authorization: Bearer YOUR_PLATFORM_JWT" -F "file=@file.txt"`,
          },
        },
      ],
    },
  ],
  errorResponses: [
    { status: 401, code: "unauthorized", description: "Missing or invalid authentication credentials" },
  ],
};
