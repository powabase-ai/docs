// scripts/build-from-source.ts
// Converts TypeScript docs source data into Mintlify MDX files.
// Run with: npx tsx scripts/build-from-source.ts

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import { ALL_GUIDES } from "../_source/guides/index.ts";
import { ALL_CONCEPTS } from "../_source/concepts/index.ts";
import { ALL_REFERENCES } from "../_source/reference/index.ts";
import { NAV_SECTIONS } from "../_source/navigation.ts";
import type {
  Guide,
  ConceptPage,
  ReferenceSection,
  ContentBlock,
  NavCard,
  GuideStep,
  EndpointRef,
  ParamDef,
} from "../_source/types.ts";

const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);

// ── Helpers ──────────────────────────────────────────────────────────────────

function yamlValue(s: string): string {
  // Double-quote YAML scalar, escaping backslashes and double quotes.
  return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function frontmatter(fields: Record<string, string | undefined>): string {
  const lines = ["---"];
  for (const [k, v] of Object.entries(fields)) {
    if (v == null) continue;
    lines.push(`${k}: ${yamlValue(v)}`);
  }
  lines.push("---");
  return lines.join("\n");
}

function selToHref(target: NavCard["target"]): string {
  if (target.type === "guide") return `/guides/${target.guideId}`;
  if (target.type === "concept") return `/concepts/${target.conceptId}`;
  if (target.type === "reference") return `/api-reference/${target.sectionId}`;
  return "/";
}

// Lucide → Font Awesome icon name map. Mintlify accepts FA names directly in
// the `icon` frontmatter field, so we translate the navigation's lucide names
// (which mirror the Studio's built-in docs sidebar) into FA equivalents.
const LUCIDE_TO_FA: Record<string, string> = {
  BookOpen: "book-open",
  Rocket: "rocket",
  Key: "key",
  Shield: "shield-halved",
  Server: "server",
  FileText: "file-lines",
  Database: "database",
  Bot: "robot",
  Network: "diagram-project",
  Workflow: "share-nodes",
  Radio: "tower-broadcast",
  Table2: "table",
  Code: "code",
  BrainCircuit: "microchip",
  Wrench: "wrench",
  Layers: "layer-group",
  MessageSquare: "message",
};

function iconForPage(
  type: "guide" | "concept" | "reference",
  id: string,
): string | undefined {
  for (const section of NAV_SECTIONS) {
    for (const item of section.items) {
      const sel = item.selection;
      const matches =
        (sel.type === "guide" && type === "guide" && sel.guideId === id) ||
        (sel.type === "concept" && type === "concept" && sel.conceptId === id) ||
        (sel.type === "reference" && type === "reference" && sel.sectionId === id);
      if (matches) {
        return LUCIDE_TO_FA[item.icon] ?? item.icon.toLowerCase();
      }
    }
  }
  return undefined;
}

function codeGroup(snippets: { python: string; typescript: string; curl: string }): string {
  return [
    "<CodeGroup>",
    "",
    "```python Python",
    snippets.python,
    "```",
    "",
    "```typescript TypeScript",
    snippets.typescript,
    "```",
    "",
    "```bash cURL",
    snippets.curl,
    "```",
    "",
    "</CodeGroup>",
  ].join("\n");
}

// Escape MDX-significant characters in raw prose text (not in code blocks):
//   `{` / `}`  — JSX expression braces; need backslash escape
//   `<` not starting a real tag — JSX would treat <FOO> or <1foo> as a
//     component name and try to render it. Real HTML tags are lowercase
//     (<a>, <p>, ...) so we only escape `<` when followed by something
//     that isn't a-z — i.e. uppercase ASCII, digit, `_`, `*`, etc. — or
//     when it's at end of string. Exception: `</` (closing tag) starts
//     with lowercase or uppercase; we leave it.
function mdxText(s: string): string {
  return s
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/<(?=[^a-z/!?])/g, "&lt;");
}

function write(filePath: string, content: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
  console.log(`  wrote ${path.relative(REPO_ROOT, filePath)}`);
}

// ── Guide → MDX ──────────────────────────────────────────────────────────────

function guideStepToMdx(step: GuideStep): string {
  const parts: string[] = [];
  parts.push(`<Step title="${step.title.replace(/"/g, "&quot;")}">`);
  parts.push("");
  parts.push(mdxText(step.description));
  parts.push("");
  parts.push(`**Endpoint:** \`${step.endpoint}\``);
  parts.push("");

  if (step.notes) {
    parts.push(`<Note>`);
    parts.push(mdxText(step.notes));
    parts.push(`</Note>`);
    parts.push("");
  }

  parts.push(codeGroup(step.snippets));

  if (step.responseExample) {
    parts.push("");
    parts.push("**Response:**");
    parts.push("");
    parts.push("```json");
    parts.push(step.responseExample);
    parts.push("```");
  }

  parts.push("");
  parts.push("</Step>");
  return parts.join("\n");
}

function guideToMdx(guide: Guide): string {
  const sections: string[] = [];

  sections.push(frontmatter({
    title: guide.title,
    description: guide.description,
    icon: iconForPage("guide", guide.id) ?? "book-open",
  }));
  sections.push("");

  if (guide.introduction) {
    sections.push(mdxText(guide.introduction));
    sections.push("");
  }

  if (guide.prerequisites && guide.prerequisites.length > 0) {
    sections.push("<Note>");
    sections.push("**Prerequisites:**");
    sections.push("");
    for (const prereq of guide.prerequisites) {
      sections.push(`- ${mdxText(prereq)}`);
    }
    sections.push("</Note>");
    sections.push("");
  }

  sections.push("<Steps>");
  sections.push("");
  for (const step of guide.steps) {
    sections.push(guideStepToMdx(step));
    sections.push("");
  }
  sections.push("</Steps>");

  if (guide.whatNext && guide.whatNext.length > 0) {
    sections.push("");
    sections.push("## What's Next");
    sections.push("");
    sections.push('<CardGroup cols={2}>');
    sections.push("");
    for (const card of guide.whatNext) {
      const href = selToHref(card.target);
      sections.push(`<Card title="${card.title.replace(/"/g, "&quot;")}" href="${href}">`);
      sections.push(mdxText(card.description));
      sections.push("</Card>");
      sections.push("");
    }
    sections.push("</CardGroup>");
  }

  return sections.join("\n");
}

// ── ConceptPage → MDX ────────────────────────────────────────────────────────

function contentBlockToMdx(block: ContentBlock): string {
  switch (block.type) {
    case "prose":
      return mdxText(block.text) + "\n";

    case "heading": {
      const hashes = block.level === 2 ? "##" : "###";
      return `${hashes} ${block.text}\n`;
    }

    case "code":
      return codeGroup(block.snippets) + "\n";

    case "callout": {
      const tag =
        block.variant === "warning"
          ? "Warning"
          : block.variant === "tip"
          ? "Tip"
          : "Info";
      const lines: string[] = [];
      lines.push(`<${tag}>`);
      if (block.title) {
        lines.push(`**${block.title}**`);
        lines.push("");
      }
      lines.push(mdxText(block.text));
      lines.push(`</${tag}>`);
      return lines.join("\n") + "\n";
    }

    case "diagram": {
      const caption = block.caption ? ` caption="${block.caption.replace(/"/g, "&quot;")}"` : "";
      return [
        `<Frame${caption}>`,
        `  <img src="/diagrams/${block.svgId}.svg" alt="${block.alt.replace(/"/g, "&quot;")}" />`,
        `</Frame>`,
        "",
      ].join("\n");
    }

    case "card-grid": {
      const lines: string[] = [];
      lines.push('<CardGroup cols={2}>');
      lines.push("");
      for (const card of block.cards) {
        const href = selToHref(card.target);
        lines.push(`<Card title="${card.title.replace(/"/g, "&quot;")}" href="${href}">`);
        lines.push(mdxText(card.description));
        lines.push("</Card>");
        lines.push("");
      }
      lines.push("</CardGroup>");
      return lines.join("\n") + "\n";
    }

    case "table": {
      // MDX cell content needs `|` escaped (markdown table syntax) and `<`
      // escaped when it isn't starting a real lowercase HTML tag.
      // Lowercase letters keep meaning (<a>, <em>, ...); uppercase letters
      // and digits would otherwise be parsed as JSX components (<FOO>, <1>)
      // and break the build.
      const escapeCell = (cell: string) =>
        cell
          .replace(/\|/g, "\\|")
          .replace(/<(?=[^a-z/!?])/g, "&lt;");
      const lines: string[] = [];
      lines.push("| " + block.headers.map(escapeCell).join(" | ") + " |");
      lines.push("| " + block.headers.map(() => "---").join(" | ") + " |");
      for (const row of block.rows) {
        lines.push("| " + row.map(escapeCell).join(" | ") + " |");
      }
      return lines.join("\n") + "\n";
    }

    default:
      return "";
  }
}

function conceptToMdx(concept: ConceptPage): string {
  const sections: string[] = [];

  sections.push(frontmatter({
    title: concept.title,
    description: concept.description,
    icon: iconForPage("concept", concept.id),
  }));
  sections.push("");

  for (const block of concept.content) {
    sections.push(contentBlockToMdx(block));
  }

  return sections.join("\n");
}

// ── ReferenceSection → MDX ───────────────────────────────────────────────────

function endpointToMdx(ep: EndpointRef): string {
  const parts: string[] = [];

  parts.push(`### ${ep.method} ${ep.path}`);
  parts.push("");
  parts.push(mdxText(ep.description));
  parts.push("");

  if (ep.parameters && ep.parameters.length > 0) {
    for (const param of ep.parameters) {
      const loc = param.in === "path" ? "path" : "query";
      const req = param.required ? " required" : "";
      parts.push(
        `<ParamField ${loc}="${param.name}" type="${param.type}"${req}>`
      );
      parts.push(mdxText(param.description));
      parts.push("</ParamField>");
      parts.push("");
    }
  }

  if (ep.requestBody) {
    parts.push("<RequestExample>");
    parts.push("");
    parts.push("```json Request");
    parts.push(ep.requestBody);
    parts.push("```");
    parts.push("");
    parts.push("</RequestExample>");
    parts.push("");
  }

  parts.push(codeGroup(ep.snippets));
  parts.push("");

  if (ep.responseBody) {
    parts.push("<ResponseExample>");
    parts.push("");
    parts.push("```json Response");
    parts.push(ep.responseBody);
    parts.push("```");
    parts.push("");
    parts.push("</ResponseExample>");
    parts.push("");
  }

  return parts.join("\n");
}

function referenceToMdx(ref: ReferenceSection): string {
  const sections: string[] = [];

  sections.push(frontmatter({
    title: ref.title,
    description: ref.description,
    icon: iconForPage("reference", ref.id),
  }));
  sections.push("");

  if (ref.introduction) {
    sections.push(mdxText(ref.introduction));
    sections.push("");
  }

  if (ref.commonPatterns) {
    sections.push("## Common Patterns");
    sections.push("");
    sections.push(mdxText(ref.commonPatterns));
    sections.push("");
  }

  for (const group of ref.groups) {
    if (group.title) {
      sections.push(`## ${group.title}`);
      sections.push("");
    }
    for (const ep of group.endpoints) {
      sections.push(endpointToMdx(ep));
    }
  }

  if (ref.errorResponses && ref.errorResponses.length > 0) {
    sections.push("## Error Responses");
    sections.push("");
    sections.push("| Status | Code | Description |");
    sections.push("| --- | --- | --- |");
    for (const err of ref.errorResponses) {
      sections.push(
        `| ${err.status} | \`${err.code}\` | ${err.description.replace(/\|/g, "\\|")} |`
      );
    }
    sections.push("");
  }

  return sections.join("\n");
}

// ── Main ─────────────────────────────────────────────────────────────────────

console.log("Building guides...");
for (const guide of ALL_GUIDES) {
  const filePath = path.join(REPO_ROOT, "guides", `${guide.id}.mdx`);
  write(filePath, guideToMdx(guide));
}

console.log("\nBuilding concepts...");
for (const concept of ALL_CONCEPTS) {
  const filePath = path.join(REPO_ROOT, "concepts", `${concept.id}.mdx`);
  write(filePath, conceptToMdx(concept));
}

console.log("\nBuilding API reference...");
for (const ref of ALL_REFERENCES) {
  const filePath = path.join(REPO_ROOT, "api-reference", `${ref.id}.mdx`);
  write(filePath, referenceToMdx(ref));
}

console.log("\nDone!");
console.log(`  ${ALL_GUIDES.length} guides`);
console.log(`  ${ALL_CONCEPTS.length} concepts`);
console.log(`  ${ALL_REFERENCES.length} api-reference pages`);
