# Ampersand-Language-Support

This extension provides langauge support for the [Ampersand](http://ampersandtarski.github.io/) Definition Language [(ADL)](https://ampersandtarski.gitbook.io/documentation). This is a language that allows one to define an application in terms of state (expressed in terms of concepts, relations and relation algebraic invariant rules), and interfaces that allow for state changes. The [tooling](https://github.com/AmpersandTarski/Ampersand) takes an ADL-script, and generates a complete web-application.

## Features

- syntax coloring grammar
- syntax coloring theme (ampersand)
- snippets that help you write the common language constructs
- syntax and type checking as you type

## Requirements

- In order to use the ampersand commands, it is required that you have [the ampersand executable](https://github.com/AmpersandTarski/Ampersand/releases/latest) in your path. Make sure it is a recent version.

- In order to get syntax coloring, select the Ampersand coloring theme as the default theme for .adl files. The reason for this is that default syntax coloring is designed for traditional languages (e.g. PHP), and Ampersand is far from that.

## How to use this extension

### Ampersand: checker

A cool feature is the syntax- and typechecking of your ampersand script. To use this, you should be working in a workspace. The workspace has a root directory. In that directory, you should create a file named `.ampersand`. That file must contain a single line, which contains the relative path to your root ampersand file.

The checker should load automatically, when the extension is activated. If for some reason this doesn't work, you can spin it off manually by using the command `Ampersand: Start checker`. The checker will read the content of the `.ampersand` file. Then it will check that file and all included files. Errors or warnings will show up each time you save the file. In combination with autosave, this helps you to find errors as you type.

### Syntax colouring

This works best with the ampersand theme:
  ```Select theme `Ampersand` (File > Preferences > Color Theme > Ampersand)```

## Known Issues

Features are currently testable, and may contain bugs. Please create an [issue](https://github.com/AmpersandTarski/Ampersand-Language-Support/issues) if you find a mistake.

## Acknowledgements

The way the syntax- and typechecking of Ampersand is made available to the VScode extention was very much inspired by the awsome work Neil Mitchell did for the [ghcid extension](https://github.com/ndmitchell/ghcid.). I shamelessly copied and modified parts of his work. Thanks Neil!

## Release Notes

The releasenotes can be found [here](./CHANGELOG.md).

**Enjoy!**
