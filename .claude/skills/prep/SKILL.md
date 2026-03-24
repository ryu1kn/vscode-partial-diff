---
name: prep
description: Run full pre-PR validation (compile, lint, test) and report any issues
disable-model-invocation: true
---

Run the full pre-PR check: `npm run prep`

This runs compile:prod, lint, and test in sequence. If any step fails, analyze the output and fix the issues.
