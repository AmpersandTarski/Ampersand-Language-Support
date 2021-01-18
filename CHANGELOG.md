# Change Log

<!--
    Special reminder for Rieks ;) 
    Please do not forget to update the version number.
    It is in the file `package.json` 
-->

## [0.3.13] - 2021-01-18
- Snippets update: shortened rule names for EQUIVALENCEs.
- minor bug fix in BOX headers

## [0.3.12] - 2020-09-18

- added snippet for REPRESENT statmemnt
- updated Ampersand color theme to support `--$` comment coloring (subsections)
- deprecated ROWS, COLS, TABS, PANELS (superseded by new `BOX` syntax with templates `FORM`, `TABLE`, `TABS`)
  For now, some old syntaxes are still recognized and colored (that will change in future)
## [0.3.12] - 2020-07-20

- fixes [#52](https://github.com/AmpersandTarski/Ampersand-Language-Support/issues/52) - syntax coloring for BOX <TEMPLATE {key[=value]}*>

## [0.3.11] - 2020-04-19

- fixes #48 - syntax coloring for `PURPOSE VIEW` and `PURPOSE IDENT`
- security fixes
- update dependencies

## [0.3.10] - 2020-01-20

- Add support for Ampersand 4.0. This release of ampersand has a new command line interface. The plugin now
  automatically detects the version you use. The daemon is launched using the correct command.
- Support for (deprecated!!) `PATTERN`/`ENDPATTERN`, `PROCESS`/`ENDPROCESS`, and `SERVICE`/`ENDSERVICE` syntax reinstated

## [0.3.9] - 2019-08-23

- Fix launching on MacOS

- Snippets now support the templates `BOX <OBJECTDROPDOWN>` and `BOX <VALUEDROPDOWN>`. These templates provide dropdown-boxes that allow users to select OBJECTS or VALUEs respectively. The snippets provide some (minimal) documentation w.r.t. to how these templates must be used in scripts. At the time of writing, developers that want to use them have to get hold of them (commit ref needed), and include them in their `templates` directory.
- Support is included for the newly enhanced PROPBUTTON template, which now allows developers to specify:
  - its label (the text that shows on the button);
  - the `[PROP]`type relation that will be flipped when the user presses the button;
  - its regular color, i.e. when it is not disabled;
  - its color when it is disabled;
  - `[PROP]`type expressions that indicate whether or not the button should be
    - disabled (you see it but cannot click it); or
    - hidden (you cannot see it); and
  - a text that shows when the user hovers over the button.
- Snippets that support the use of the new `PROPBUTTON` template are:
  - `PROPBUTTON (simple)`, which helps to create a button if you only want to specify the flippable `[PROP]`-type relation;
  - `PROPBUTTON (extended)`, which includes all supported extensions, and associated documentation.

## [0.3.8] - 2019-06-27

- Bugfix in `ROLE` statement

## [0.3.7] - 2019-06-17

- Syntax coloring for `INTERFACE`, `API` and `GUI` `PURPOSE` statements
- Added `{EX}` in `VIOLATION` snippet
- Added snippet for ExecEnging function MrgAtom
- Added `MrgAtom` to the list of predefined ExecEngine functions
- Enhancement of PROPBUTTON snippet

## [0.3.6] - 2019-05-15

- support/bugfix for INTERFACE references
- Update VIOLATION and TXT snippets
- bugfix in CONTEXT snippet

## [0.3.5] - 2019-05-06

- fixes issues #35
- bugfix: `IN <LANGUAGESPEC>` is now supported in PURPOSE statements
- snippets better support the creation of ExecEngine violation statements and CONTEXT statements

## [0.3.4] - 2019-04-20

- fixed PROPBUTTON snippet bug that Sterre reported by mail
- fixes #32
- fixes some syntax coloring bugs that had not been mentioned as issues

## [0.3.3] - 2019-04-12

- Fixes issues #27, #28, #30.
- Updated snippets to accommodate for current set of well-known BOX templates

## [0.3.2] - 2019-04-06

- Fixes issues #22, #23 and #24.

## [0.3.1] - 2019-03-28

- Syntax- and typechecking of your script as you type is now available. (Needs ampersand v3.16.0 or higher)

## [0.2.22] - 2019-03-01

- Check availability of ampersand in path when activating extension.

## [0.2.21] - 2019-02-27

- First step in attaching ampersand executable. Still work in progress.

## [0.2.20] - 2019-02-20

- Minor sanitation of dependencies

## [0.2.19] - 2019-02-19

- Support for TXT statements in INTERFACEs
- Issue: TXT statements contain markdown; however, I cannot get VSCode to show the associated markdown syntax coloring
- Added snippets for most of the well-known ExecEngine functions
- Added snippet for computing transitive closure (r -> r+) using Warshall
- Various fixes for minor bugs and enhancements

## [0.2.18] - 2019-01-02

- Supports relations with signature in POPULATION statements (Fixes #17)

## [0.2.17] - 2018-12-31

- Syntax coloring now better distinguishes between keywords, errors and deprecated stuff
- Support for SERVICEs and ExecEngine termination requests in syntax coloring and snippets
- Support for OBJECT keyword in REPRESENT statement

## [0.2.16] - 2018-12-13

- Preview disabled

## [0.2.15] - 2018-12-13

- Synchronized version number of this changelog and that of `package.json`
- Minor changes in functionality of snippets.
- Syntax coloring supports concept lists in `CLASSIFY` statements
- Syntax coloring supports negations (!-chars) in preprocessor argument lists of `INCLUDE` statements

## [0.2.8] - 2018-08-09

- Parse error messages.

## [0.2.7] - 2018-08-09

- Add default build task.

## [0.2.6] - 2018-08-07

- first automatically build & deployed version

## [0.0.7] - 2018-08-01

- upgrade gulp

## [0.0.6] - 2018-08-01

- trying to get automatic publishing at vs-code markteplace to work.
- syntax coloring grammar is testable.
- syntax coloring theme 'ampersand' is testable.
- snippets are available for most language constructs.
- snippet `eqv` enables easy definition of equivalence relations.

## [0.0.5] - 2018-07-18

- first attempt to add snippets.
- first attempt to use travis-ci (shamelessly copied .travis.yaml from <https://github.com/VSCodeVim/Vim>)

## [0.0.4] - 2018-07-18

- Add logo.

## [0.0.3] - 2018-07-18

- Some more initial work.

## [0.0.2] - 2018-07-16

- This version compiles.

## [0.0.1] - 2018-07-14

### Initial version

- Trying out language support with VSCode.
