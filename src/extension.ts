"use strict";
import * as vscode from "vscode";
import * as fs from "fs";
import {
  fileUtils,
  watcherUtils,
  loadSettings,
  registerSettingsListener
} from "./utils";
import { ampersandVersionChecker } from "./ampersand";
import { constants } from "./constants";
import {
  checkVersionCommand,
  generateAtlasCommand,
  generateFunctionalSpecCommand,
  generatePrototypeCommand,
} from "./commands";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error).
  // This line of code will only be executed once when your extension is activated.
  console.info(
    `[${constants.extension.name}] v${constants.extension.version} activated!`
  );
  loadSettings(); // Load settings on startup
  registerSettingsListener(context); // Keep settings updated

  ampersandVersionChecker.checkVersion();

  watcherUtils.setupLastRunningWatcher(context);

  pushDisposable(context, generatePrototypeCommand.commandName, () =>
    new generatePrototypeCommand().runCommand()
  );
  pushDisposable(context, generateAtlasCommand.commandName, () =>
    new generateAtlasCommand().runCommand()
  );
  pushDisposable(context, generateFunctionalSpecCommand.commandName, () =>
    new generateFunctionalSpecCommand().runCommand()
  );
  pushDisposable(context, checkVersionCommand.commandName, () =>
    new checkVersionCommand().runCommand()
  );

  // generateWorkingFolders();
  // createAndFillGitIgnore();
}
export function deactivate() {
  console.info(
    `[${constants.extension.name}] v${constants.extension.version} deactivated!`
  );
}

function pushDisposable(
  context: vscode.ExtensionContext,
  extensionName: string,
  commandFunction: (...args: any[]) => any
) {
  context.subscriptions.push(
    vscode.commands.registerCommand(extensionName, commandFunction)
  );
}

// function generateWorkingFolders() {
//   fileUtils.generateFolderInCurrentWorkspace(["ampersand"]);
//   fileUtils.generateFolderInCurrentWorkspace(["project"]);
// }

// function createAndFillGitIgnore() {
//   const gitIgnorePath = fileUtils.generateWorkspacePath([
//     "ampersand",
//     ".gitignore",
//   ]);
//   const gitIgnoreContent =
//     "# Ignore everything in this directory\n*\n# Except this file\n!.gitignore";
//   fs.writeFileSync(`${gitIgnorePath}`, gitIgnoreContent);
// }
