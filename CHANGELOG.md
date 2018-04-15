# Change Log

All notable changes to "Partial Diff" extension will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.6.0] - 2018-04-15
### Added
- A command to quickly compare text in 2 visible editors. [#11](https://github.com/ryu1kn/vscode-partial-diff/issues/11)

## [0.5.1] - 2017-11-29
### Fixed
- Fixed the issue that **Compare with Clipboard** was not working. [#19](https://github.com/ryu1kn/vscode-partial-diff/issues/19)

## [0.5.0] - 2017-11-12
### Added
- Support user defined text normalisation rules to reduce the noise in the diff. [#15](https://github.com/ryu1kn/vscode-partial-diff/issues/15)

## [0.4.1] - 2017-10-28
### Fixed
- Sort text selections by the line/character position. [#16](https://github.com/ryu1kn/vscode-partial-diff/issues/16)

## [0.4.0] - 2017-10-26
### Added
- Support text selection with multi cursors. [#16](https://github.com/ryu1kn/vscode-partial-diff/issues/16)

## [0.3.3] - 2017-10-01
### Fixed
- Fixed the issue that **Compare with Clipboard** command inserts extra new line characters on Windows. [#12](https://github.com/ryu1kn/vscode-partial-diff/issues/12)

## [0.3.2] - 2017-09-14
### Fixed
- Fixed the link to the gif animation

## [0.3.1] - 2017-05-14
### Fixed
- Fixed the problem that one library is used without being listed as dependencies

## [0.3.0] - 2017-05-14
### Added
- A feature to compare text against clipboard contents (thanks to @eamodio ! [PR #6](https://github.com/ryu1kn/vscode-partial-diff/pull/6))

### Changed
- Show file names and line numbers of the compared text as the title of the diff view (thanks to @eamodio ! [PR #5](https://github.com/ryu1kn/vscode-partial-diff/pull/5))
- Revised command labels (thanks to @eamodio ! [PR #5](https://github.com/ryu1kn/vscode-partial-diff/pull/5))

## [0.2.0] - 2016-12-03
### Added
- Make commands available in the right click menu (editor context menu)

## [0.1.0] - 2016-06-17
### Added
- Marking a text without selecting a part of text will mark the entire text

## [0.0.4] - 2016-06-13
### Fixed
- Fixed the problem that it was not working on windows

## [0.0.3] - 2016-06-12
### Added
* Added the extension icon (thanks to @tauri_34 !)

### [0.0.2] - 2016-06-11
### Fixed
* Fix the problem that the gif animation is not shown

## [0.0.1] - 2016-06-11
### Added
* Initial release of partial-diff
