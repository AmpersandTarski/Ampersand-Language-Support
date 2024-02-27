'use strict';
import * as vscode from 'vscode';
import * as fs from 'fs';
import { fileUtils, watcherUtils } from "./utils";
import { ampersandVersionChecker } from './ampersand';
import { constants } from './constants';
import { checkVersionCommand, generateAtlasCommand, generateFunctionalSpecCommand, generatePrototypeCommand } from './commands';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    
    let commands: Array<ICommand> = new Array<ICommand>();
    // Use the console to output diagnostic information (console.log) and errors (console.error).
    // This line of code will only be executed once when your extension is activated.
    console.info(
		`[${constants.extension.name}] v${constants.extension.version} activated!`,
	  );

	ampersandVersionChecker.checkVersion();

    watcherUtils.setupLastRunningWatcher(context);

    commands.push(
            new generatePrototypeCommand(context),
            new generateAtlasCommand(),
            new generateFunctionalSpecCommand(),
            new checkVersionCommand()
        );

    for (let index = 0; index < commands.length; index++) {
        const command = commands[index];
        pushDisposable(context, command.commandName, command.RunCommand());
    }
    generateWorkingFolders();
    createAndFillGitIgnore();
}

function pushDisposable(context: vscode.ExtensionContext,extensionName : string, commandFunction: (...args: any[]) => any)
{
    let dispose = vscode.commands.registerCommand(extensionName,commandFunction);
    context.subscriptions.push(dispose);
}

function generateWorkingFolders()
{
    fileUtils.generateFolderInCurrentWorkspace(['ampersand']);
    fileUtils.generateFolderInCurrentWorkspace(['project']);
}

function createAndFillGitIgnore()
{
    const gitIgnorePath = fileUtils.generateWorkspacePath(['ampersand', '.gitignore']);
    const gitIgnoreContent = '# Ignore everything in this directory\n*\n# Except this file\n!.gitignore';
    fs.writeFileSync(`${gitIgnorePath}`, gitIgnoreContent);
}