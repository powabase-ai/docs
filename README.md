# Powabase Docs

Mintlify-powered documentation for Powabase, deployed to https://docs.powabase.ai.

## Contributing

- Edit MDX files directly under `getting-started/`, `concepts/`, `guides/`, and `api-reference/`.
- Reference docs and content data is sourced from the platform repo; the conversion script at `scripts/build-from-source.ts` regenerates MDX from the TypeScript data when the platform changes.

## Local preview

```bash
npx mintlify dev
```

## Deploy

Pushed to the connected GitHub repo; Mintlify deploys automatically.
