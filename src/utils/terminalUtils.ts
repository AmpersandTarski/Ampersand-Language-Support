import vscode from 'vscode';
import { fileUtils } from './fileUtils';

export class terminalUtils{
    static RunCommandInNewTerminal(terminalName : string, runAmpersandCommand : string, workingDir? : string[])
    {
        if(workingDir === undefined)
        {
            workingDir = [''];
        }

        let terminal = vscode.window.createTerminal({name:terminalName,cwd:fileUtils.generateWorkspacePath(workingDir)});
        terminal.sendText(runAmpersandCommand)
        terminal.show();
    }

    static RunCommandsInNewTerminal(terminalName : string, runAmpersandCommands : string[], workingDir? : string[])
    {
        if(workingDir === undefined)
        {
            workingDir = [''];
        }

        let terminal = vscode.window.createTerminal({name:terminalName,cwd:fileUtils.generateWorkspacePath(workingDir)});
        terminal.show();
        runAmpersandCommands.forEach(command => {
            terminal.sendText(command)
        });
    }
}