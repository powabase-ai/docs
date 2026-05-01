// scripts/build-config.ts
// Generates docs.json (Mintlify config) from the NAV_SECTIONS source data.
// Run with: npx tsx scripts/build-config.ts

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import { NAV_SECTIONS } from "../_source/navigation.ts";
import type { NavSection, NavItem, PageSelection } from "../_source/types.ts";

const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);

// IDs to skip (no corresponding MDX file)
const SKIP_IDS = new Set<string>();

function selToPage(sel: PageSelection): string {
  if (sel.type === "guide") return `guides/${sel.guideId}`;
  if (sel.type === "concept") return `concepts/${sel.conceptId}`;
  if (sel.type === "reference") return `api-reference/${sel.sectionId}`;
  return "";
}

// Build the navigation groups from NAV_SECTIONS
const groups = NAV_SECTIONS.map((section: NavSection) => {
  const pages = section.items
    .filter((item: NavItem) => !SKIP_IDS.has(item.id))
    .map((item: NavItem) => selToPage(item.selection))
    .filter(Boolean);

  return {
    group: section.title,
    pages,
  };
});

const config = {
  $schema: "https://mintlify.com/docs.json",
  theme: "mint",
  name: "Powabase",
  colors: {
    primary: "#A855F7",
    light: "#C4B5FD",
    dark: "#6D28D9",
  },
  favicon: "/favicon.svg",
  navigation: {
    tabs: [
      {
        tab: "Documentation",
        groups,
      },
    ],
  },
  logo: {
    light: "/logo/powabase-compact-colored.svg",
    dark: "/logo/powabase-compact-white.svg",
  },
  navbar: {
    links: [],
    primary: {
      type: "button",
      label: "Start a project",
      href: "https://app.powabase.ai/sign-up",
    },
  },
  footer: {
    socials: {
      discord: "https://discord.gg/k8W2A9KRtc",
    },
  },
  redirects: [
    {
      source: "/",
      destination: "/concepts/platform-overview",
    },
  ],
};

const outPath = path.join(REPO_ROOT, "docs.json");
fs.writeFileSync(outPath, JSON.stringify(config, null, 2) + "\n", "utf8");
console.log(`Wrote docs.json`);

// Verify all referenced pages exist
console.log("\nVerifying page references...");
let errors = 0;
for (const group of groups) {
  for (const page of group.pages) {
    const filePath = path.join(REPO_ROOT, `${page}.mdx`);
    if (!fs.existsSync(filePath)) {
      console.error(`  MISSING: ${page}.mdx (referenced in "${group.group}")`);
      errors++;
    } else {
      console.log(`  ok: ${page}`);
    }
  }
}

if (errors > 0) {
  console.error(`\n${errors} missing page(s)!`);
  process.exit(1);
} else {
  console.log(`\nAll ${groups.reduce((n, g) => n + g.pages.length, 0)} pages verified.`);
}
