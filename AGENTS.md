# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## What This Is

A VS Code extension ("Partial Diff") that lets users compare text selections within a file, across files, or against the clipboard using VS Code's built-in diff viewer.

## Commands

- `npm test` — run all tests (mocha, TDD style)
- `npm test -- --grep "pattern"` — run a single test by name
- `npm run lint` — tslint
- `npm run compile:dev` — webpack dev build
- `npm run compile:prod` — clean + webpack prod build (output: `dist/extension.js`)
- `npm run watch` — webpack dev build in watch mode
- `npm run prep` — full pre-PR check (compile:prod + lint + test)
- `npm run coverage` — nyc coverage report

## Git Worktrees

- Store git worktrees under `.git-worktrees/<branch_name>` relative to the repository root.
- `<branch_name>` must not contain `/`. Use a slash-free branch name when creating worktrees.

## Architecture

**Entry flow:** `src/extension.ts` → `BootstrapperFactory` → `Bootstrapper` → registers commands and content provider with VS Code.

**Adaptor pattern:** All VS Code API access is wrapped in adaptors (`src/lib/adaptors/`) so the core logic is testable without VS Code. `TextEditor`, `WindowAdaptor`, `WorkspaceAdaptor`, and `CommandAdaptor` each wrap a corresponding VS Code API surface.

**Command pattern:** Each user action is a `Command` (interface in `src/lib/commands/command.ts`) created by `CommandFactory`. Commands are either `TEXT_EDITOR` type (receive the active editor) or `GENERAL` type.

**Diff flow:** Commands store selections in `SelectionInfoRegistry` (keyed by text keys: `reg1`, `reg2`, `clipboard`, `visible1`, `visible2`). When a diff is requested, `DiffPresenter` builds `partialdiff://` URIs and calls `vscode.diff`. VS Code then calls `ContentProvider.provideTextDocumentContent()` to resolve the URI back to text, applying normalization rules via `TextProcessRuleApplier`.

**Text normalization:** `NormalisationRuleStore` loads rules from user config and tracks active/inactive state. `TextProcessRuleApplier` applies active rules to text before it enters the diff view. The diff title uses `~` instead of `↔` when normalization is active.

## Testing

- **Framework:** Mocha with TDD interface (`suite`/`test`, not `describe`/`it`)
- **Mocking:** testdouble (`td`) — helpers in `src/test/helpers.ts` provide `mock()`, `mockType()`, `mockMethods()`, `verify`, `when`, `contains`, `any`, and `wrapVerify`
- **Test location:** `src/test/` mirrors `src/lib/` structure
- **Execution:** Tests run directly via ts-node (not compiled first)
