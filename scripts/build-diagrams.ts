// scripts/build-diagrams.ts
// Converts React+SVG diagram components to static SVG files.
// Approach: text-transform each TSX file, replacing CSS variable references with hex values,
// then extract the SVG content by stripping the React wrapper.
// Run with: npx tsx scripts/build-diagrams.ts

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);

const DIAGRAM_SRC = path.resolve(
  REPO_ROOT,
  "..",
  "powabase-website",
  "components",
  "docs",
  "diagrams"
);

const DIAGRAM_OUT = path.join(REPO_ROOT, "diagrams");

// CSS variable → hex color token map
const TOKEN_MAP: Record<string, string> = {
  "var(--color-fg)": "#FAFAFA",
  "var(--color-fg-muted)": "#A1A1AA",
  "var(--color-fg-dim)": "#71717A",
  "var(--color-border)": "#27272A",
  "var(--color-border-strong)": "#3F3F46",
  "var(--color-bg-elev)": "#0E0E10",
  "var(--color-brand)": "#A855F7",
  "var(--color-brand-soft)": "#C4B5FD",
  "var(--color-accent-cyan)": "#22D3EE",
  "var(--color-accent-amber)": "#F59E0B",
  "var(--color-ok)": "#22C55E",
};

const DIAGRAMS: { file: string; id: string }[] = [
  { file: "AgentReactLoop.tsx", id: "agent-react-loop" },
  { file: "ArchitectureOverview.tsx", id: "architecture-overview" },
  { file: "ExtractionPipeline.tsx", id: "extraction-pipeline" },
  { file: "IndexingPipeline.tsx", id: "indexing-pipeline" },
  { file: "OrchestrationFlow.tsx", id: "orchestration-flow" },
  { file: "PlatformComparison.tsx", id: "platform-comparison" },
  { file: "PlatformPipeline.tsx", id: "platform-pipeline" },
  { file: "WorkflowExecution.tsx", id: "workflow-execution" },
];

/**
 * Apply token substitution: replace all CSS variable references with hex.
 * Handles both inline string form `"var(--color-fg)"` and template/identifier form.
 */
function applyTokens(src: string): string {
  let result = src;
  for (const [token, hex] of Object.entries(TOKEN_MAP)) {
    // Replace all occurrences (in strings, JSX attributes, template literals, variable values)
    result = result.split(token).join(hex);
  }
  return result;
}

/**
 * Convert JSX to static SVG string with a simple text transformation.
 * Handles:
 *  - JSX className → class
 *  - {expr} attribute values → evaluated constants
 *  - self-closing tags normalization
 *  - Remove React-specific attributes (key, style={{}})
 *  - JS expressions in fill/stroke/etc. that resolved to hex strings after token substitution
 */
function jsxToSvg(src: string): string {
  // After token substitution, color variables are hex strings like "#FAFAFA".
  // Now we need to:
  // 1. Extract just the SVG element from the return statement
  // 2. Convert JSX attributes to HTML/SVG attributes

  // Find the <svg ...> opening
  const svgStart = src.indexOf("<svg");
  if (svgStart === -1) throw new Error("No <svg> element found");

  // Find the closing </svg> - take everything from <svg to </svg>
  const svgEnd = src.lastIndexOf("</svg>");
  if (svgEnd === -1) throw new Error("No </svg> closing tag found");

  let svgContent = src.slice(svgStart, svgEnd + "</svg>".length);

  // Remove TypeScript/JSX-specific patterns:

  // 1. Remove {/* comments */}
  svgContent = svgContent.replace(/\{\/\*[\s\S]*?\*\/\}/g, "");

  // 2. Convert JSX expressions in attribute values to their string content
  //    After token substitution, color values in variables are plain strings.
  //    Pattern: attribute={variableName} where variable resolved to "#HEXHEX"
  //    We need to handle the JS variable pattern:
  //    In OrchestrationFlow, colors are JS vars: fg = "#FAFAFA", etc.
  //    These appear as fill={fg}, stroke={border}, etc.
  //    We need to extract the variable declarations and substitute.

  // Extract JS const/let variable declarations from the source
  const varDecls: Record<string, string> = {};
  const varPattern = /(?:const|let)\s+(\w+)\s*=\s*["']([^"']+)["']/g;
  let m: RegExpExecArray | null;
  while ((m = varPattern.exec(src)) !== null) {
    varDecls[m[1]] = m[2];
  }

  // Replace {varName} attribute expressions with the resolved value
  // e.g., fill={fg} → fill="#FAFAFA"
  svgContent = svgContent.replace(/=\{(\w+)\}/g, (match, varName) => {
    if (varDecls[varName]) return `="${varDecls[varName]}"`;
    return match;
  });

  // 3. Replace JSX expressions {`string literal`} with the string
  svgContent = svgContent.replace(/=\{`([^`]*)`\}/g, '="$1"');

  // 4. Replace JSX string expressions {"..."} with the string
  svgContent = svgContent.replace(/=\{"([^"]*)"\}/g, '="$1"');

  // 5. Replace number expressions ={123} with ="123"
  svgContent = svgContent.replace(/=\{(\d+(?:\.\d+)?)\}/g, '="$1"');

  // 6. Handle JSX expression children (text content) - {expr} → string
  // These are JS expressions in element bodies, e.g., {totalW}
  // After variable substitution they'd be identifiers. We'll remove them.
  svgContent = svgContent.replace(/\{[a-zA-Z_]\w*\}/g, "");

  // 7. Handle template literals in attribute values that survived
  // e.g., viewBox={`0 0 ${totalW} ${totalH}`} - these are complex expressions
  // For PlatformComparison which uses computed values, handle specially
  svgContent = svgContent.replace(/=\{`([^`]*)`\}/g, '="$1"');

  // 8. Handle complex JSX expressions - {(...)} or function calls
  // Remove remaining {...} attribute expressions that we couldn't resolve
  // (these were already handled by variable substitution above)

  // 9. Convert style={{...}} to remove React style objects (SVG uses inline style strings)
  // Simple case: style={{ maxWidth: "100%", height: "auto" }}
  svgContent = svgContent.replace(/style=\{\{[^}]*\}\}/g, "");
  // style={{ maxWidth: 800, maxHeight: 300 }} - single line
  svgContent = svgContent.replace(/style=\{\{[^}]*maxWidth[^}]*\}\}/g, "");

  // 10. Remove key={...} attributes (React-specific)
  svgContent = svgContent.replace(/\s+key=\{[^}]+\}/g, "");

  // 11. Remove transform={`translate(...)`} → transform="translate(...)"
  svgContent = svgContent.replace(/transform=\{`([^`]*)`\}/g, 'transform="$1"');

  // 12. Handle fillOpacity={0.06} type attributes
  svgContent = svgContent.replace(/=\{(0\.\d+)\}/g, '="$1"');

  // 13. Handle remaining JSX expressions by evaluating simple ones
  // For things like x={colX(0)} - these are function calls we can't resolve easily
  // Leave as is for now and handle the PlatformComparison specially

  // 14. Remove JSX map expressions entirely - these need special handling
  // The {rows.map(...)} and {columns.map(...)} expressions in PlatformComparison
  // are the most complex. We'll handle this component separately.

  // 15. Convert camelCase SVG attributes to SVG spec
  // strokeWidth → stroke-width, etc. - SVG in JSX uses camelCase, but SVG spec uses kebab
  // Actually JSX SVG uses camelCase which browsers also accept, so leave as-is

  // 16. Remove null returns from map (null fragments)
  svgContent = svgContent.replace(/\s*null\s*/g, "");

  // 17. Clean up any remaining {expr} text nodes
  svgContent = svgContent.replace(/\{[^}]+\}/g, "");

  // 18. Ensure xmlns is present
  if (!svgContent.includes('xmlns=')) {
    svgContent = svgContent.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  // 19. Add XML declaration
  return `<?xml version="1.0" encoding="UTF-8"?>\n${svgContent.trim()}\n`;
}

/**
 * Special handler for PlatformComparison which has complex computed geometry.
 * We'll generate the SVG directly since the component uses JS-computed values.
 */
function buildPlatformComparison(): string {
  const fg = "#FAFAFA";
  const fgLight = "#A1A1AA";
  const fgMuted = "#71717A";
  const border = "#27272A";
  const surface = "#0E0E10";
  const brand = "#A855F7";

  const labelColWidth = 130;
  const cellW = 84;
  const cellH = 38;
  const headerH = 44;
  const padX = 16;
  const padY = 16;

  const columns = [
    { label: "Agentic", highlighted: true },
    { label: "Supabase" },
    { label: "LangChain" },
    { label: "Agno" },
    { label: "Vectara" },
    { label: "Dify" },
    { label: "n8n" },
  ];

  const rows = [
    { label: "RAG Pipeline" },
    { label: "Agents" },
    { label: "Multi-Agent" },
    { label: "Workflows" },
    { label: "Database" },
    { label: "Auth" },
  ];

  const data: number[][] = [
    [1, 0.33, 0.66, 0.66, 1, 0.66, 0],
    [1, 0, 1, 1, 0.33, 0.66, 0.66],
    [1, 0, 0.66, 0.66, 0, 0.33, 0],
    [1, 0.33, 0.66, 0.33, 0, 1, 1],
    [1, 1, 0, 0, 0, 0.33, 0.33],
    [1, 1, 0, 0, 0, 0.33, 0.33],
  ];

  const tableX = padX;
  const tableY = padY;
  const tableW = labelColWidth + cellW * columns.length;
  const tableH = headerH + cellH * rows.length;
  const totalW = tableW + padX * 2;
  const totalH = tableH + padY * 2 + 26;

  function colX(ci: number) { return tableX + labelColWidth + ci * cellW; }
  function rowY(ri: number) { return tableY + headerH + ri * cellH; }

  const parts: string[] = [];
  parts.push(`<?xml version="1.0" encoding="UTF-8"?>`);
  parts.push(`<svg viewBox="0 0 ${totalW} ${totalH}" width="${totalW}" height="${totalH}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Feature coverage table comparing Agentic Platform with Supabase, LangChain, Agno, Vectara, Dify, and n8n">`);

  // Highlighted Agentic column background
  parts.push(`  <rect x="${colX(0)}" y="${tableY}" width="${cellW}" height="${tableH}" fill="${brand}" fill-opacity="0.06"/>`);

  // Zebra row striping
  rows.forEach((_, ri) => {
    if (ri % 2 === 1) {
      parts.push(`  <rect x="${tableX}" y="${rowY(ri)}" width="${tableW}" height="${cellH}" fill="${surface}" fill-opacity="0.5"/>`);
    }
  });

  // Header row
  columns.forEach((col, ci) => {
    const x = colX(ci) + cellW / 2;
    const y = tableY + headerH / 2 + 4;
    const fill = col.highlighted ? brand : fgLight;
    const fw = col.highlighted ? 700 : 600;
    parts.push(`  <text x="${x}" y="${y}" text-anchor="middle" fill="${fill}" font-size="11" font-weight="${fw}" letter-spacing="0.02em">${col.label}</text>`);
  });

  // Header bottom rule
  parts.push(`  <line x1="${tableX}" y1="${tableY + headerH}" x2="${tableX + tableW}" y2="${tableY + headerH}" stroke="${border}" stroke-width="1"/>`);

  // Row label divider
  parts.push(`  <line x1="${tableX + labelColWidth}" y1="${tableY}" x2="${tableX + labelColWidth}" y2="${tableY + tableH}" stroke="${border}" stroke-width="1"/>`);

  // Row labels
  rows.forEach((row, ri) => {
    parts.push(`  <text x="${tableX + labelColWidth - 12}" y="${rowY(ri) + cellH / 2 + 4}" text-anchor="end" fill="${fg}" font-size="11.5" font-weight="500">${row.label}</text>`);
  });

  // Row separators
  rows.slice(1).forEach((_, i) => {
    const ri = i + 1;
    parts.push(`  <line x1="${tableX + labelColWidth}" y1="${rowY(ri)}" x2="${tableX + tableW}" y2="${rowY(ri)}" stroke="${border}" stroke-opacity="0.4" stroke-width="0.5"/>`);
  });

  // Data cells
  rows.forEach((_, ri) => {
    columns.forEach((_, ci) => {
      const val = data[ri][ci];
      const cx = colX(ci) + cellW / 2;
      const cy = rowY(ri) + cellH / 2;

      if (val >= 0.99) {
        parts.push(`  <circle cx="${cx}" cy="${cy}" r="9" fill="${brand}"/>`);
        parts.push(`  <path d="M${cx - 4.2},${cy + 0.3} l3.3,3.2 l5.6,-6" fill="none" stroke="white" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>`);
      } else if (val >= 0.5) {
        parts.push(`  <circle cx="${cx}" cy="${cy}" r="8" fill="none" stroke="${brand}" stroke-width="1.4" stroke-opacity="0.85"/>`);
        parts.push(`  <path d="M${cx},${cy - 8} a8,8 0 0 1 0,16 z" fill="${brand}" fill-opacity="0.85"/>`);
      } else if (val > 0) {
        parts.push(`  <circle cx="${cx}" cy="${cy}" r="5" fill="none" stroke="${fgMuted}" stroke-width="1.2" stroke-opacity="0.7"/>`);
      } else {
        parts.push(`  <line x1="${cx - 5}" y1="${cy}" x2="${cx + 5}" y2="${cy}" stroke="${fgMuted}" stroke-opacity="0.35" stroke-width="1.2" stroke-linecap="round"/>`);
      }
    });
  });

  // Outer table border
  parts.push(`  <rect x="${tableX}" y="${tableY}" width="${tableW}" height="${tableH}" fill="none" stroke="${border}" stroke-width="1" rx="6"/>`);

  // Legend
  const lgY = tableY + tableH + 14;
  parts.push(`  <circle cx="${tableX + 6}" cy="${lgY + 6}" r="5" fill="${brand}"/>`);
  parts.push(`  <path d="M${tableX + 3.6},${lgY + 6.4} l2.0,1.9 l3.6,-3.7" fill="none" stroke="white" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>`);
  parts.push(`  <text x="${tableX + 18}" y="${lgY + 9.5}" fill="${fgLight}" font-size="10.5">Full</text>`);

  const lgXPartial = tableX + 72;
  parts.push(`  <circle cx="${lgXPartial + 6}" cy="${lgY + 6}" r="5" fill="none" stroke="${brand}" stroke-width="1.2"/>`);
  parts.push(`  <path d="M${lgXPartial + 6},${lgY + 1} a5,5 0 0 1 0,10 z" fill="${brand}" fill-opacity="0.85"/>`);
  parts.push(`  <text x="${lgXPartial + 18}" y="${lgY + 9.5}" fill="${fgLight}" font-size="10.5">Partial</text>`);

  const lgXLimited = tableX + 150;
  parts.push(`  <circle cx="${lgXLimited + 6}" cy="${lgY + 6}" r="4" fill="none" stroke="${fgMuted}" stroke-width="1.2"/>`);
  parts.push(`  <text x="${lgXLimited + 18}" y="${lgY + 9.5}" fill="${fgLight}" font-size="10.5">Limited</text>`);

  const lgXNone = tableX + 225;
  parts.push(`  <line x1="${lgXNone + 1}" y1="${lgY + 6}" x2="${lgXNone + 11}" y2="${lgY + 6}" stroke="${fgMuted}" stroke-width="1.2" stroke-linecap="round"/>`);
  parts.push(`  <text x="${lgXNone + 18}" y="${lgY + 9.5}" fill="${fgLight}" font-size="10.5">None</text>`);

  parts.push(`</svg>`);
  return parts.join("\n") + "\n";
}

// ── Main ─────────────────────────────────────────────────────────────────────

fs.mkdirSync(DIAGRAM_OUT, { recursive: true });

for (const { file, id } of DIAGRAMS) {
  const srcPath = path.join(DIAGRAM_SRC, file);

  if (!fs.existsSync(srcPath)) {
    console.error(`  MISSING: ${file}`);
    continue;
  }

  let svgContent: string;

  if (id === "platform-comparison") {
    // This component uses computed geometry — build directly
    svgContent = buildPlatformComparison();
    console.log(`  built ${id}.svg (computed)`);
  } else {
    const src = fs.readFileSync(srcPath, "utf8");
    // Apply token substitution (CSS variables → hex)
    const substituted = applyTokens(src);
    // Convert JSX to SVG
    svgContent = jsxToSvg(substituted);
    console.log(`  converted ${file} → ${id}.svg`);
  }

  const outPath = path.join(DIAGRAM_OUT, `${id}.svg`);
  fs.writeFileSync(outPath, svgContent, "utf8");
}

console.log(`\nDone! ${DIAGRAMS.length} diagrams written to diagrams/`);
