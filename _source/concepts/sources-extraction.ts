import type { ConceptPage } from "../types";

export const sourcesExtractionConcept: ConceptPage = {
  id: "sources-extraction",
  title: "Sources & Extraction",
  description: "Sources are the entry point for documents in the platform. Upload files, and the extraction pipeline converts them into structured text that can be indexed into knowledge bases.",
  content: [
    {
      type: "heading", level: 2, text: "What is a Source?", id: "what-is-source",
    },
    {
      type: "prose",
      text: "A Source represents a single uploaded document. When you upload a file, the platform creates a Source record, stores the original file, and kicks off an asynchronous extraction pipeline. The pipeline extracts text content from the document — handling PDFs, Word documents, images (via OCR), and other file types. The result is clean, structured text organized by page.",
    },
    {
      type: "heading", level: 2, text: "Supported File Types", id: "file-types",
    },
    {
      type: "table",
      headers: ["Type", "Extensions", "Extraction Method"],
      rows: [
        ["PDF", ".pdf", "Multiple extractors — see 'Extraction Models' below"],
        ["Word", ".docx, .doc", "Structured text extraction preserving headings and formatting"],
        ["Images", ".png, .jpg, .jpeg, .webp, .gif, .tiff", "OCR (Optical Character Recognition)"],
        ["Text", ".txt, .md, .csv", "Direct text reading"],
        ["PowerPoint", ".pptx", "Slide-by-slide text extraction (REST API only)"],
        ["Excel", ".xlsx", "Sheet-by-sheet cell content extraction (REST API only)"],
        ["URLs", "http(s)://", "Fetched via URL import — single URLs, crawl, or sitemap"],
      ],
    },
    {
      type: "heading", level: 2, text: "Extraction Models (PDF)", id: "extraction-models",
    },
    {
      type: "prose",
      text: "For PDFs you can choose how the text is extracted by passing extraction_model at upload time or via POST /sources/{id}/reextract. If you don't pass one, the pipeline uses auto, which tries mistral → opendataloader → fitz → pdfplumber in order until one succeeds. paddleocr and lighton are not part of the auto chain — request them explicitly.",
    },
    {
      type: "table",
      headers: ["Model", "What it does", "Requires"],
      rows: [
        ["auto", "Default fallback chain (mistral → opendataloader → fitz → pdfplumber)", "—"],
        ["mistral", "Mistral OCR — scanned PDFs, image-heavy documents", "MISTRAL_API_KEY"],
        ["paddleocr", "PaddleOCR-VL API — strong non-English support and layout detection", "PADDLEOCR_API_KEY, PADDLEOCR_BASE_URL"],
        ["lighton", "LightOn OCR API", "LIGHTON_API_KEY, LIGHTON_BASE_URL"],
        ["opendataloader", "Local high-accuracy structural extraction (tables, headings, layout)", "None (local)"],
        ["fitz", "PyMuPDF — fast, text-based extraction", "None (local)"],
        ["pdfplumber", "Reliable fallback for complex tables and unusual layouts", "None (local)"],
      ],
    },
    {
      type: "heading", level: 2, text: "Extraction Pipeline", id: "extraction-pipeline",
    },
    {
      type: "prose",
      text: "When you upload a file, it goes through several stages: the file is stored in project storage, a Celery worker picks up the extraction task, the appropriate strategy is selected based on file type, and the extracted content is stored as derivatives (page texts, markdown, per-page images) associated with the source. This process runs asynchronously — poll the source status to check progress.",
    },
    {
      type: "diagram",
      svgId: "extraction-pipeline",
      caption: "Document extraction pipeline from upload to structured derivatives",
      alt: "Extraction pipeline: File Upload → Project Storage → Celery Worker (selects strategy: PDF extractor, DOCX parser, OCR engine) → Derivatives (page texts, markdown, images) → Source record updated to extracted status.",
    },
    {
      type: "heading", level: 2, text: "Status Lifecycle", id: "status-lifecycle",
    },
    {
      type: "prose",
      text: "Every source goes through an extraction_status lifecycle. After upload the source is pending; a worker picks it up and it moves to extracting; on success it becomes extracted. If some pages fail but others succeed the status is attention_required (partial success — the source is still indexable). Terminal states are extracted, failed, attention_required, and cancelled.",
    },
    {
      type: "table",
      headers: ["Status", "Meaning"],
      rows: [
        ["pending", "Uploaded but not yet picked up by a worker"],
        ["extracting", "Currently being extracted"],
        ["extracted", "Extraction finished — derivatives available, source is indexable"],
        ["attention_required", "Partial success — some pages failed. error_message explains. Still indexable."],
        ["failed", "Extraction failed — check error_message for details"],
        ["cancelled", "User cancelled via POST /sources/{id}/cancel"],
      ],
    },
    {
      type: "heading", level: 2, text: "Storage Integration", id: "storage",
    },
    {
      type: "prose",
      text: "You can also import files that are already in your project's storage buckets using the import-from-storage endpoint. This avoids re-uploading files and is useful when you have an existing storage workflow. The extraction process is the same regardless of whether the file was uploaded directly or imported from storage.",
    },
    {
      type: "heading", level: 2, text: "Next Steps", id: "next-steps",
    },
    {
      type: "card-grid",
      cards: [
        {
          title: "Upload a Document",
          description: "Step-by-step guide to uploading and extracting.",
          icon: "FileText",
          target: { type: "guide", guideId: "upload-document" },
        },
        {
          title: "Knowledge Bases & Indexing",
          description: "Turn extracted text into searchable vectors.",
          icon: "Database",
          target: { type: "concept", conceptId: "knowledge-bases-indexing" },
        },
        {
          title: "Sources API Reference",
          description: "Full endpoint documentation.",
          icon: "FileText",
          target: { type: "reference", sectionId: "sources" },
        },
      ],
    },
  ],
};
