---
name: release
description: Cut a new release of the Partial Diff VS Code extension - guides through version bump, changelog, validation, and publish
---

Guide the user through cutting a release of the Partial Diff extension. The argument, if given, is the bump level (`major`, `minor`, or `patch`). If omitted, ask the user.

## Execution rules

1. Before starting, create a task for each step below using TaskCreate.
2. Work through the tasks strictly in order. Mark each task `in_progress` when starting and `completed` when done.
3. Do NOT skip, reorder, or combine steps.
4. At each step, confirm with the user before moving to the next.

### 1. Determine scope

- Run `git log v<current-version>..HEAD --oneline` to list commits since the last release.
- Summarise the user-facing changes (skip purely internal/CI/tooling commits unless they affect the shipped package).
- Confirm the bump level (major/minor/patch) with the user.

### 2. Bump version

- Run `npm version <major|minor|patch> --no-git-tag-version`. This updates both `package.json` and `package-lock.json`.

### 3. Update CHANGELOG.md

- Add a new entry at the top following the existing Keep a Changelog format.
- Only include changes relevant to users. Infrastructure-only changes can be omitted or summarised briefly.
- Use today's date.

### 4. Run pre-publish checks

- Run `npm run prep` (compile:prod + lint + test). All must pass.

### 5. Verify package contents

- Run `npx @vscode/vsce ls` and show the output.
- Review the file list with the user. Every listed file will be delivered to users — flag anything that looks unnecessary (test files, local config, CI files, etc.).
- For reference, the v1.4.4 release contained exactly these files:
  - package.json
  - README.md
  - LICENSE.txt
  - CHANGELOG.md
  - images/partial-diff_128x128.png
  - dist/extension.js.map
  - dist/extension.js

### 6. Test locally

- Install into VS Code: `npm run test:e2e:vscode`
- Install into Cursor: `npm run test:e2e:cursor`
- Ask the user to verify that the extension works correctly in both editors and that no errors appear.

### 7. Commit

- Stage `package.json`, `package-lock.json`, and `CHANGELOG.md`.
- Commit with message: `Bump up version to v<version>`

### 8. Publish

- Remind the user they need Personal Access Tokens for both the VS Code Marketplace and Open VSX if they haven't set them up.
- **VS Code Marketplace:**
  - Run `npx @vscode/vsce publish` — this triggers `vscode:prepublish` (production build) and uploads to the VS Code Marketplace.
- Run `npm run vscode:postpublish` to create and push the git tag. Note: `vsce publish` does NOT run `postpublish` automatically.
- **Open VSX:**
  - Run `npx ovsx publish partial-diff-<version>.vsix` — reuses the .vsix already built by `vsce publish`.
- Push the release commit: `git push origin main`
