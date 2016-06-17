# partial-diff

## Features

You can take a diff of 2 parts within one file, as well as 2 parts from 2 different files.

![Select 2 texts and take diff](https://raw.githubusercontent.com/ryu1kn/vscode-partial-diff/master/images/select-2-texts-and-take-diff.gif)

## Commands

* `PartialDiff: Mark 1st text`: Mark the selected text as the 1st text to compare.
* `PartialDiff: Mark 2nd text and Take diff`: Mark the selected text as the 2nd text and compare it with the 1st.

Diff will be taken only after selecting the 2nd text.

## Keyboard Shortcuts

You can quickly mark a selected text by registering the `partial-diff` commands to your keyboard shortcut settings. For example:

```json
  { "key": "ctrl+1", "command": "extension.partialDiff.markSection1",
                        "when": "editorTextFocus" },
  { "key": "ctrl+2", "command": "extension.partialDiff.markSection2AndTakeDiff",
                        "when": "editorTextFocus" }
```

## Release Notes

### 0.1.0

* Marking a text without selecting a part of text will mark the entire text

### 0.0.4

* Fixed the problem that it was not working on windows

### 0.0.3

* Added the extension icon (thanks to @tauri_34 !)

### 0.0.2

* Fix the problem that the gif animation is not shown

### 0.0.1

* Initial release of partial-diff
