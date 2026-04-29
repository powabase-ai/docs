import type { ConceptPage } from "../types";

export const workflowsConceptPage: ConceptPage = {
  id: "workflows-concept",
  title: "Workflows",
  description: "Workflows are DAG-based automation pipelines that chain together LLM calls, code execution, conditions, and agent runs into deterministic, repeatable processes.",
  content: [
    {
      type: "heading", level: 2, text: "What is a Workflow?", id: "what-is-workflow",
    },
    {
      type: "prose",
      text: "A Workflow is a directed acyclic graph (DAG) of blocks connected by edges. Each block performs a specific action — calling an LLM, running code, evaluating a condition, or executing an agent. Data flows from block to block through the edges. Unlike orchestrations (where the coordinator decides what happens), workflows follow a fixed, predetermined path every time.",
    },
    {
      type: "heading", level: 2, text: "Block Types", id: "block-types",
    },
    {
      type: "table",
      headers: ["Block", "Description", "Key Config"],
      rows: [
        ["input", "Entry point — accepts user input or webhook payload", "Variable name for downstream blocks"],
        ["output", "Exit point — returns the workflow result", "Result template with block references"],
        ["llm", "Calls a language model with a prompt template", "Model, temperature, system prompt, input references"],
        ["agent", "Runs an existing agent with a message", "Agent ID, message template"],
        ["condition", "Branches the flow based on a boolean expression", "JavaScript expression evaluated against block outputs"],
        ["code", "Executes custom Python or JavaScript code", "Language, source code, input variable mappings"],
      ],
    },
    {
      type: "heading", level: 2, text: "Graph Execution", id: "execution",
    },
    {
      type: "prose",
      text: "When you execute a workflow, the engine evaluates blocks in topological order. Each block receives the outputs of its upstream blocks as input. Condition blocks create branches — only the matching branch continues execution. The workflow finishes when all output blocks have been reached.",
    },
    {
      type: "diagram",
      svgId: "workflow-execution",
      caption: "Workflow DAG with branching logic",
      alt: "Workflow execution DAG: Input block → LLM block (processes input) → Condition block (branches based on result) → Branch A: Output A / Branch B: Output B. Blocks are connected by directional edges showing data flow.",
    },
    {
      type: "heading", level: 2, text: "Programmatic vs Copilot", id: "programmatic-vs-copilot",
    },
    {
      type: "prose",
      text: "You can build workflows two ways. The programmatic approach uses the PUT /api/workflows/{id}/graph endpoint to define blocks and edges as JSON. The Copilot approach uses natural language — describe what you want, and the AI copilot generates the workflow graph for you. Both produce the same underlying graph structure.",
    },
    {
      type: "heading", level: 2, text: "Deployment & Webhooks", id: "deployment",
    },
    {
      type: "prose",
      text: "Workflows can be deployed and armed for webhook execution. Once armed, you get a webhook URL and secret. External systems can trigger the workflow by POSTing to the webhook URL. Each arm produces a single-use webhook — after it fires, you need to re-arm for the next execution.",
    },
    {
      type: "callout",
      variant: "tip",
      title: "Webhook security",
      text: "The webhook secret is returned when you arm the workflow. Include it in your webhook payload to verify that the request is legitimate. Each arm generates a new secret.",
    },
    {
      type: "heading", level: 2, text: "Next Steps", id: "next-steps",
    },
    {
      type: "card-grid",
      cards: [
        {
          title: "Workflows (Programmatic)",
          description: "Build a workflow step by step using the API.",
          icon: "Workflow",
          target: { type: "guide", guideId: "workflows-programmatic" },
        },
        {
          title: "Workflows (Copilot)",
          description: "Build a workflow using natural language.",
          icon: "BrainCircuit",
          target: { type: "guide", guideId: "workflows-copilot" },
        },
        {
          title: "Workflows API Reference",
          description: "Full endpoint documentation.",
          icon: "Workflow",
          target: { type: "reference", sectionId: "workflows" },
        },
      ],
    },
  ],
};
