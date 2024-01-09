import * as vscode from 'vscode';
import * as fs from 'fs';
import { daemonCommand } from '../commands/daemonCommand';

export class watcherUtils {
    static setupLastRunningWatcher(context: vscode.ExtensionContext)
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

        add(context, 'extension.startDaemon', () => daemonCommand.runDaemonCommand(context, oldTerminal));

        function add(context: vscode.ExtensionContext,name : string, act : () => fs.FSWatcher | null)
        {
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
    }
}