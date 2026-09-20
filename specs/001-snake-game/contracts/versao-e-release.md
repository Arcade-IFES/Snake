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
- Trigger: every push to `main` (including a merged Pull Request).
- Permission: `contents: write` only.
- The version commit made by the workflow is skipped (`[skip ci]` and the bot actor), so it never re-triggers.
- Runs are serialized with a concurrency group so two runs never bump the same version.

## Automatic bump

The bump is read from the head commit message on `main` (for a merged Pull Request, its title):

| Message | Bump |
|---------|------|
| Contains `BREAKING CHANGE` or starts with `type!:` | MAJOR |
| A line starts with `feat` | MINOR |
| Anything else | PATCH |

## Workflow steps

| Step | Rule | On failure |
|------|------|------------|
| Check out `main` | Full history | Workflow fails |
| Read and bump `VERSAO` | Extract the value from `index.html`, apply the bump | Workflow fails; fails also if the new tag already exists |
| Write `VERSAO` | Update `index.html` and verify the edit | Workflow fails |
| Commit and tag | Commit `chore: versão X.Y.Z [skip ci]` to `main`, push tag `vX.Y.Z` | Workflow fails |
| Package | Zip `index.html`, `perguntas.js`, `README.md` as `snake-vX.Y.Z.zip` | Workflow fails |
| Publish | `gh release create` with generated notes and the zip attached | Workflow fails |

The workflow uses only the `gh` CLI pre-installed on GitHub-hosted runners, with the built-in token; it uses
no third-party actions beyond checkout. `main` MUST NOT require pull requests for the workflow token, or the
version commit cannot be pushed.

## Release procedure for maintainers

Nobody edits `VERSAO` by hand. Merge a Pull Request whose title follows the table above; the workflow does the
rest. Check that the Release zip opens and the game starts.

## Versioning rules

- MAJOR: a change that breaks the `perguntas.js` format or the saved ranking.
- MINOR: new player-visible features or rules.
- PATCH: fixes and content-only changes.
