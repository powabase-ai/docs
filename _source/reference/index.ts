import type { ReferenceSection } from "../types";

import { agentsReference } from "./agents";
import { authStorageReference } from "./auth-storage";
import { contextHandlersReference } from "./context-handlers";
import { copilotReference } from "./copilot";
import { knowledgeBasesReference } from "./knowledge-bases";
import { orchestrationsReference } from "./orchestrations";
import { sessionsReference } from "./sessions";
import { sourcesReference } from "./sources";
import { toolsReference } from "./tools";
import { workflowsReference } from "./workflows";

export const ALL_REFERENCES: ReferenceSection[] = [
  sourcesReference,
  knowledgeBasesReference,
  agentsReference,
  sessionsReference,
  orchestrationsReference,
  workflowsReference,
  copilotReference,
  toolsReference,
  contextHandlersReference,
  authStorageReference,
];

export const REFERENCES_BY_ID: Record<string, ReferenceSection> = Object.fromEntries(
  ALL_REFERENCES.map((r) => [r.id, r]),
);
