[![Build Status](https://travis-ci.org/ryu1kn/vscode-partial-diff.svg?branch=master)](https://travis-ci.org/ryu1kn/vscode-partial-diff)
[![Code Climate](https://codeclimate.com/github/ryu1kn/vscode-partial-diff/badges/gpa.svg)](https://codeclimate.com/github/ryu1kn/vscode-partial-diff)

# Partial Diff

## Features

* You can compare (diff) text selections within a file, across different files, or to the clipboard.
* Multi cursor text selection.
* User defined text normalization rules to reduce the noise in the diff (e.g. replace tab characters to spaces).
* User defined text normalization rules can be toggled off without removing them from the configuration.
* Compare text in 2 visible editors (i.e. tabs) with one action.

![Compare two text selections](https://raw.githubusercontent.com/ryu1kn/vscode-partial-diff/master/images/public.gif)

## Request Features or Report Bugs

Feature requests and bug reports are very welcome: https://github.com/ryu1kn/vscode-partial-diff/issues

A couple of requests from me when you raise an github issue.

* **Requesting a feature:** Please try to provide the context of why you want that feature. Such as, in what situation the feature could help you and how, or how the lack of the feature is causing an inconvenience to you. I can't think of introducing it until I understand how it helps you 🙂
* **Reporting a bug:** Please include environment information (OS name/version, the editor version). Also screenshots (or even videos) are often very very helpful!

## Commands

* `Select Text for Compare` (**Command ID:** `extension.partialDiff.markSection1`)

    Marks the selected text as the text to compare the next selection with.

* `Compare Text with Previous Selection` (**Command ID:** `extension.partialDiff.markSection2AndTakeDiff`)

    Compares the selected text to the first selection.

* `Compare Text with Clipboard` (**Command ID:** `extension.partialDiff.diffSelectionWithClipboard`)

    Compares the current clipboard to the selected text.

* `Compare Text in Visible Editors` (**Command ID:** `extension.partialDiff.diffVisibleEditors`)

    Compares text in 2 visible editors.

* `Toggle Pre-Comparison Text Normalization Rules` (**Command ID:** `extension.partialDiff.togglePreComparisonTextNormalizationRules`)

    Toggle pre-comparison text normalization rules.

**NOTE:**

* A diff will be shown only after selecting comparison text first (using `Select Text for Compare`) except `Compare Text in Visible Editors`.
* Executing `Select Text for Compare`, `Compare Text with Previous Selection` or `Compare Text in Visible Editors` command without selecting any text will use the entire text of the current file.

## Configurations

* `partialDiff.commandsOnContextMenu` (default: `{"markSection1": true, ...}`, all commands visible)

    Commands appear on the context menu. Unlisted commands will still appear.
   
    For example, if you don't want to see *Compare Text in Visible Editors* command (Command ID: `extension.partialDiff.diffVisibleEditors`)
    on the context menu, you can set this setting as follows:

    ```
    "partialDiff.commandsOnContextMenu": {
      "diffVisibleEditors": false
    }
    ```

* `partialDiff.preComparisonTextNormalizationRules` (default: `[]`)

    Rules to normalize texts for diff view.

    It doesn't mutate texts in the editors. Only texts in diff views get normalised.
    If a diff is presented with text normalised (or possibly normalised), `~` is used in the diff title instead of `↔`)

    Each rule has `match`, `replaceWith`. `name` or `enableOnStart` are optional.

    * `name`: Optional. Name of the rule to describe what the rule is for. You see this name on normalisation rule toggle menu.
    * `match`: Regular expression to find text you want to normalise. [Global search flag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions?redirectlocale=en-US&redirectslug=JavaScript%2FGuide%2FRegular_Expressions#Advanced_searching_with_flags) is automatically applied.
    * `replaceWith`: One of the following
      * **Replacement text** as a string. You can use `$N`, where `N` is the index of substring (starting from 1) you captured in `match` with `()`.
      * **Letter case specification** as an object. Valid cases are `upper` and `lower`.
    * `enableOnStart`: Optional. Set it `false` if you don't want to use the rule when the extension starts up.

    Sample `preComparisonTextNormalizationRules`:

    ```
    "partialDiff.preComparisonTextNormalizationRules": [
      {
        "name": "Replace tabs with whitespaces",
        "match": "\t",
        "replaceWith": "  "
      },
      {
        "name": "One space after comma",
        "match": ", *([^,\n]+)",
        "replaceWith": ", $1"
      },
      {
        "name": "Capitalise",
        "match": ".*",
        "replaceWith": {"letterCase": "upper"},
        "enableOnStart": false
      }
      ...
    ]
    ```

* `partialDiff.enableTelemetry` (default: `true`)

    Allow the extension usage data to be sent to the extension author.
    
    Partial Diff sends usage data only when **both** `partialDiff.enableTelemetry` and
    [`telemetry.enableTelemetry`](https://code.visualstudio.com/docs/supporting/faq#_how-to-disable-telemetry-reporting)
    are set to `true`.

* `partialDiff.hideCommandsOnContextMenu` (default: `false`)

    (DEPRECATED) Hide Partial Diff commands on the context menu.
    Please use `partialDiff.commandsOnContextMenu` instead.

## Keyboard Shortcuts

You can quickly mark the selected text by adding the `partial-diff` commands to your keyboard shortcut settings. For example:

```json
  { "key": "ctrl+1", "command": "extension.partialDiff.markSection1",
                        "when": "editorTextFocus" },
  { "key": "ctrl+2", "command": "extension.partialDiff.markSection2AndTakeDiff",
                        "when": "editorTextFocus" },
  { "key": "ctrl+3", "command": "extension.partialDiff.diffSelectionWithClipboard",
                        "when": "editorTextFocus" },
```

## Known problems

* If you want to compare text in Output channels, you'll need to execute the commands via keyboard shortcuts or the context menu (i.e. right-click menu). Executing the commands through the command palette doesn't work. See [Cannot compare texts in Outputs channel if the mark text commands are executed from the command palette](https://github.com/ryu1kn/vscode-partial-diff/issues/3).

## Changelog

* https://github.com/ryu1kn/vscode-partial-diff/blob/master/CHANGELOG.md

## How to Contribute

1. Clone this repository
1. Make code changes
1. Before you make a pull request, you can run linter and tests to avoid build failure

    ```sh
    $ yarn run prep
    ```
