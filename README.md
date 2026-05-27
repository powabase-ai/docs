# Powabase Docs

Mintlify-powered documentation for Powabase, deployed to https://docs.powabase.ai.

## Contributing

- Edit MDX files directly under `concepts/`, `guides/`, and `api-reference/`.
- Sidebar order and Mintlify config live in `docs.json` — edit it directly.
- Diagrams (`diagrams/*.svg`) can be edited by hand, or regenerated from `scripts/build-diagrams.ts` if you're working from the React/TSX sources.

## Local preview

```bash
npx mint dev
```

## Check for broken links

```bash
npx mint broken-links
```

## Deploy

Pushed to the connected GitHub repo; Mintlify deploys automatically.
