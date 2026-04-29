import type { Guide } from "../types";

import { advancedAgentConfigGuide } from "./advanced-agent-config";
import { buildAgentGuide } from "./build-agent";
import { createKnowledgeBaseGuide } from "./create-knowledge-base";
import { introductionGuide } from "./introduction";
import { orchestrationGuide } from "./orchestration";
import { quickstartGuide } from "./quickstart";
import { streamingGuide } from "./streaming-guide";
import { uploadDocumentGuide } from "./upload-document";
import { workflowsCopilotGuide } from "./workflows-copilot";
import { workflowsProgrammaticGuide } from "./workflows-programmatic";

export const ALL_GUIDES: Guide[] = [
  introductionGuide,
  quickstartGuide,
  uploadDocumentGuide,
  createKnowledgeBaseGuide,
  buildAgentGuide,
  orchestrationGuide,
  workflowsProgrammaticGuide,
  workflowsCopilotGuide,
  streamingGuide,
  advancedAgentConfigGuide,
];

export const GUIDES_BY_ID: Record<string, Guide> = Object.fromEntries(
  ALL_GUIDES.map((g) => [g.id, g]),
);
