#!/usr/bin/env bash

set -euo pipefail

cat CLAUDE.md \
    | sed 's/CLAUDE.md/AGENTS.md/g' \
    | sed 's#Claude Code (claude.ai/code)#Codex (Codex.ai/code)#' \
    > AGENTS.md
