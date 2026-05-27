export type Language = "python" | "typescript" | "curl";

export type CalloutVariant = "info" | "warning" | "tip";

export type ContentBlock =
  | { type: "prose"; text: string }
  | { type: "heading"; level: 2 | 3; text: string; id: string }
  | { type: "code"; snippets: Record<Language, string> }
  | { type: "callout"; variant: CalloutVariant; title?: string; text: string }
  | { type: "diagram"; svgId: string; caption?: string; alt: string }
  | { type: "card-grid"; cards: NavCard[] }
  | { type: "table"; headers: string[]; rows: string[][] };

export interface NavCard {
  title: string;
  description: string;
  icon?: string;
  target: PageSelection;
}

export interface ConceptPage {
  id: string;
  title: string;
  description: string;
  content: ContentBlock[];
}

export type PageSelection =
  | { type: "guide"; guideId: string }
  | { type: "reference"; sectionId: string }
  | { type: "concept"; conceptId: string };

export interface NavSection {
  title: string;
  items: NavItem[];
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  selection: PageSelection;
}

export interface Guide {
  id: string;
  title: string;
  description: string;
  steps: GuideStep[];
  prerequisites?: string[];
  introduction?: string;
  // Raw MDX rendered between `introduction` and the `<Steps>` block. Unlike
  // `introduction` / step descriptions, the contents are NOT escaped — author
  // them as you would write them in an .mdx file (Markdown + JSX components).
  preface?: string;
  whatNext?: NavCard[];
}

export interface GuideStep {
  title: string;
  description: string;
  endpoint: string;
  snippets: Record<Language, string>;
  responseExample?: string;
  notes?: string;
}

export interface EndpointRef {
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  path: string;
  description: string;
  parameters?: ParamDef[];
  requestBody?: string;
  responseBody?: string;
  snippets: Record<Language, string>;
}

export interface ParamDef {
  name: string;
  in: "path" | "query";
  type: string;
  required: boolean;
  description: string;
}

export interface EndpointGroup {
  title?: string;
  endpoints: EndpointRef[];
}

export interface ReferenceSection {
  id: string;
  title: string;
  description: string;
  groups: EndpointGroup[];
  introduction?: string;
  commonPatterns?: string;
  errorResponses?: { status: number; code: string; description: string }[];
}
