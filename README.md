[![Build Status](https://travis-ci.org/ryu1kn/vscode-partial-diff.svg?branch=master)](https://travis-ci.org/ryu1kn/vscode-partial-diff) [![Code Climate](https://codeclimate.com/github/ryu1kn/vscode-partial-diff/badges/gpa.svg)](https://codeclimate.com/github/ryu1kn/vscode-partial-diff)

# Partial Diff

## Features

You can compare (diff) text selections within a file, across different files, or to the clipboard.

![Compare two text selections](https://raw.githubusercontent.com/ryu1kn/vscode-partial-diff/master/images/select-2-texts-and-take-diff.gif)

## Commands

* `Select Text for Compare`: Marks the selected text as the text to compare the next selection with.
* `Compare Text with Previous Selection`: Compares the selected text to the first selection.
* `Compare Text with Clipboard`: Compares the current clipboard to the selected text.

**NOTE:**

* A diff will be shown only after selecting comparison text first (using `Select Text for Compare`)
* Executing the `Select Text for Compare` or `Compare Text with Previous Selection` command without selecting any text will use the entire text of the current file
* If the `Compare Text with Clipboard` command doesn't work on Linux -- `xclip` needs to be installed. You can install it via `sudo apt-get install xclip`

## Keyboard Shortcuts

You can quickly mark the selected text by adding the `partial-diff` commands to your keyboard shortcut settings. For example:

```json
  { "key": "ctrl+1", "command": "extension.partialDiff.markSection1",
                        "when": "editorTextFocus" },
  { "key": "ctrl+2", "command": "extension.partialDiff.markSection2AndTakeDiff",
                        "when": "editorTextFocus" }
  { "key": "ctrl+3", "command": "extension.partialDiff.diffSelectionWithClipboard",
                        "when": "editorTextFocus" }
```

## Known problems

* If you want to compare text in Output channels, you'll need to execute the commands via keyboard shortcuts or the context menu (i.e. right-click menu). Executing the commands through the command palette doesn't work. See [Cannot compare texts in Outputs channel if the mark text commands are executed from the command palette](https://github.com/ryu1kn/vscode-partial-diff/issues/3).

## Request Features or Report Bugs

* https://github.com/ryu1kn/vscode-partial-diff/issues

## Changelog

* https://github.com/ryu1kn/vscode-partial-diff/blob/master/CHANGELOG.md
