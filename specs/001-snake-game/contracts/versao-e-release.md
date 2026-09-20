# Contract: Version and Release

Implements Part I, Principle IX. The version has one source of truth: a constant in `index.html`.

## Version constant

```js
const VERSAO = "1.0.0";   // MAJOR.MINOR.PATCH, no leading "v"
```

- Shown in the HUD and on the title screen as `v` + `VERSAO` (for example "v1.0.0").
- MUST be exactly three dot-separated non-negative integers.
- MUST be the only place in the game where the number is written.

## Release trigger

- Workflow file: `.github/workflows/release.yml`.
- Trigger: a pushed tag matching `v*.*.*`.
- Permission: `contents: write` only.

## Workflow steps

| Step | Rule | On failure |
|------|------|------------|
| Check out the tagged commit | Standard checkout | Workflow fails |
| Read `VERSAO` from `index.html` | Extract the quoted value of `const VERSAO` | Workflow fails with a clear message |
| Compare with the tag | Tag `vX.Y.Z` MUST equal `v` + `VERSAO` | Workflow fails; no Release is created |
| Package | Zip `index.html`, `perguntas.js`, `README.md` as `snake-vX.Y.Z.zip` | Workflow fails |
| Publish | `gh release create <tag>` with generated notes and the zip attached | Workflow fails |

The workflow uses only the `gh` CLI pre-installed on GitHub-hosted runners, with the built-in token; it uses
no third-party actions beyond checkout.

## Release procedure for maintainers

1. Change `VERSAO` in `index.html` in a Pull Request; merge after review.
2. Create and push the tag `vX.Y.Z` on the merge commit.
3. The workflow publishes the Release; check that the zip opens and the game starts.

## Versioning rules

- MAJOR: a change that breaks the `perguntas.js` format or the saved ranking.
- MINOR: new player-visible features or rules.
- PATCH: fixes and content-only changes.
