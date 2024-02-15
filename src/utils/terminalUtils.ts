import vscode, { Terminal } from 'vscode';
import { fileUtils } from './fileUtils';

export class terminalUtils{
    static RunCommandInNewTerminal(terminalName : string, runAmpersandCommand : string, workingDir? : string[])
    {
        if(workingDir === undefined)
        {
            workingDir = [''];
        }

        let terminal = vscode.window.createTerminal({name:terminalName,cwd:fileUtils.generateWorkspacePath(workingDir)});
        this.RunCommandsInExistingTerminal(terminal,[runAmpersandCommand])
    }

    static RunCommandsInNewTerminal(terminalName : string, runAmpersandCommands : string[], workingDir? : string[]) : Terminal
    {
        if(workingDir === undefined)
        {
            workingDir = [''];
        }

        let terminal = vscode.window.createTerminal({name:terminalName,cwd:fileUtils.generateWorkspacePath(workingDir)});
        
        this.RunCommandsInExistingTerminal(terminal,runAmpersandCommands);

        return terminal;
    }

    static RunCommandsInExistingTerminal(terminal : Terminal, runAmpersandCommands : string[], workingDir? : string[])
    {
        if(workingDir === undefined)
        {
            workingDir = [''];
        }

        terminal.show();
        runAmpersandCommands.forEach(command => {
            terminal.sendText(command)
        });
    }
}