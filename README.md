# Ampersand-Language-Support

This extension provides langauge support for the [Ampersand](http://ampersandtarski.github.io/) Definition Language [(ADL)](https://ampersandtarski.gitbook.io/documentation). This is a language that allows one to define an application in terms of state (expressed in terms of concepts, relations and relation algebraic invariant rules), and interfaces that allow for state changes. The [tooling](https://github.com/AmpersandTarski/Ampersand) takes an ADL-script, and generates a complete web-application.

## Features

- syntax coloring grammar
- syntax coloring theme (ampersand)
- snippets that help you write the common language constructs
- syntax and type checking as you type

## Requirements

- In order to use the ampersand commands, it is required that you have [the ampersand executable](https://github.com/AmpersandTarski/Ampersand/releases/latest) in your path. The default build task is now set to check the current script. If the ampersand executable is found, a message showing its version will show up.
- In order to get syntax coloring, select the Ampersand coloring theme as the default theme for .adl files. The reason for this is that default syntax coloring is designed for traditional languages (e.g. PHP), and Ampersand is far from that.

## Extension Settings

- `ampersand.enable`: enable/disable this extension
- Select theme `Ampersand` (File > Preferences > Color Theme > Ampersand)

## Known Issues

Features are currently testable, and may contain bugs. Please create an [issue](https://github.com/AmpersandTarski/Ampersand-Language-Support/issues) if you find a mistake.

## Acknowledgement

The way the syntax- and typechecking of Ampersand is made available to the VScode extention was very much inspired by the awsome work Neil Mitchell did for the [ghcid extension](https://github.com/ndmitchell/ghcid.). I shamelessly copied and modified parts of his work. Thanks Neil!

## Release Notes

The releasenotes can be found [here](./CHANGELOG.md).

**Enjoy!**
