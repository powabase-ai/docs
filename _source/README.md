# _source/

Snapshot of the platform's docs source data, copied verbatim from
`powabase-website/content/docs/`. This is the input to
`scripts/build-from-source.ts`, which generates the MDX files at the repo
root.

To re-sync after platform docs change:

```bash
cp -r /path/to/powabase-website/content/docs/. _source/
npx tsx scripts/build-from-source.ts
```

Don't edit files under `_source/` directly — edit the platform source
or the generated MDX.
