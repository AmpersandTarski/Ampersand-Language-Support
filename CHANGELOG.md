# Change Log

<!--
    Special reminder for Rieks ;) 
    Please do not forget to update the version number.
    It is in the file `package.json` 
-->

## [0.3.4] - 2019-xx-yy

- fixes #32
- fixes some other bugs that had not been mentioned as issues

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
