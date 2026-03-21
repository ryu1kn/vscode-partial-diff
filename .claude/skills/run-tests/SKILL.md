---
name: run-tests
description: Run mocha tests - optionally filtered by suite/test name pattern
disable-model-invocation: true
---

Run tests for this project.

- If an argument is given, use it as the --grep pattern: `yarn test --grep "<argument>"`
- If no argument, run all tests: `yarn test`
- On failure, analyze the output and suggest fixes
