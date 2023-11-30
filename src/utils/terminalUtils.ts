import vscode from 'vscode';

export class TerminalUtils{
    static RunCommandInNewTerminal(terminalName : string, runAmpersandCommand : string)
    {
        let terminal = vscode.window.createTerminal(terminalName);
        terminal.sendText(runAmpersandCommand)
        terminal.show();
    }
}