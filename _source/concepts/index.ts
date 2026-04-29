import type { ConceptPage } from "../types";

import { agentsToolsConcept } from "./agents-tools";
import { aiCodingAssistantsConcept } from "./ai-coding-assistants";
import { architectureConcept } from "./architecture";
import { databaseAccessConcept } from "./database-access";
import { knowledgeBasesIndexingConcept } from "./knowledge-bases-indexing";
import { orchestrationsConceptPage } from "./orchestrations-concept";
import { platformComparisonConcept } from "./platform-comparison";
import { platformOverviewConcept } from "./platform-overview";
import { sourcesExtractionConcept } from "./sources-extraction";
import { streamingPatternsConcept } from "./streaming-patterns";
import { workflowsConceptPage } from "./workflows-concept";

export const ALL_CONCEPTS: ConceptPage[] = [
  platformOverviewConcept,
  architectureConcept,
  sourcesExtractionConcept,
  knowledgeBasesIndexingConcept,
  agentsToolsConcept,
  orchestrationsConceptPage,
  workflowsConceptPage,
  streamingPatternsConcept,
  databaseAccessConcept,
  aiCodingAssistantsConcept,
  platformComparisonConcept,
];

export const CONCEPTS_BY_ID: Record<string, ConceptPage> = Object.fromEntries(
  ALL_CONCEPTS.map((c) => [c.id, c]),
);
