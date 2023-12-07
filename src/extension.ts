'use strict';
import * as vscode from 'vscode';
import * as fs from 'fs';
import { ampersandVersionChecker } from './ampersand';
import { constants } from './constants';
import { daemonCommand, generateFunctionalSpecCommand, checkVersionCommand, generateAtlasCommand, generatePrototypeCommand } from './commands';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error).
    // This line of code will only be executed once when your extension is activated.
    console.info(
		`[${constants.extension.name}] v${constants.extension.version} activated!`,
	  );

	ampersandVersionChecker.checkVersion();

    setupLastRunningWatcher(context);

    pushDisposable(context, "extension.checkVersion", () => checkVersionCommand.checkVersionCommand())
    pushDisposable(context, "extension.generateFunctionalSpec", () => generateFunctionalSpecCommand.GenerateFunctionalSpecCommand())
    pushDisposable(context, "extension.generateAtlas", () => generateAtlasCommand.GenerateAtlasCommand())
    pushDisposable(context, "extension.generatePrototype", () => generatePrototypeCommand.GeneratePrototypeCommand(context))
}

function pushDisposable(context: vscode.ExtensionContext,extensionName : string, commandFunction: (...args: any[]) => any)
{
    let dispose = vscode.commands.registerCommand(extensionName,commandFunction);
    context.subscriptions.push(dispose);
}

// Setup last running watcher, so we can undo it
function setupLastRunningWatcher(context: vscode.ExtensionContext)
{
    // Pointer to the last running watcher, so we can undo it
    var oldWatcher : fs.FSWatcher | null = null;
    var oldTerminal : vscode.Terminal | null = null;

    const cleanup = () => {
        if (oldWatcher != null)
            oldWatcher.close();
        oldWatcher = null;
        if (oldTerminal != null)
            oldTerminal.dispose();
        oldTerminal = null;
    }
    context.subscriptions.push({dispose: cleanup});

    const add = (name : string, act : () => fs.FSWatcher | null ) => {
        const dispose = vscode.commands.registerCommand(name, () => {
            try {
                cleanup();
                oldWatcher = act();
            }
            catch (e) {
                console.error("Ampersand extension failed in " + name + ": " + e);
                throw e;
            }
        });
        context.subscriptions.push(dispose);
    }

    add('extension.startDaemon', () => daemonCommand.runDaemonCommand(context, oldTerminal));
}