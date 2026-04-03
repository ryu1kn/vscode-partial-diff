#!/usr/bin/env bash

set -euo pipefail

cmd_git=git
cmd_gh=gh
if [[ "${1:-}" == "--dry-run" ]]; then
  echo ">>> dry-run mode <<<"
  cmd_git="echo (dry run) git"
  cmd_gh="echo (dry run) gh"
fi

RELEASE_VER="$(node -p 'require("./package.json").version')"

GIT_TAG_NAME="v$RELEASE_VER"
$cmd_git tag -a "$GIT_TAG_NAME" -m "$GIT_TAG_NAME"
$cmd_git push origin "$GIT_TAG_NAME"

PREV_TAG="$(git tag --sort=-version:refname | sed -n '2p')"
read -rp "Create a GitHub release for $GIT_TAG_NAME (notes since $PREV_TAG)? [y/N] " answer
if [[ "$answer" =~ ^[Yy]$ ]]; then
  $cmd_gh release create "$GIT_TAG_NAME" --generate-notes --notes-start-tag "$PREV_TAG"
fi
