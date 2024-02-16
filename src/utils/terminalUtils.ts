import vscode, { Terminal } from 'vscode';
import { fileUtils } from './fileUtils';

export class terminalUtils{
    static RunCommandsInNewTerminal(terminalName : string, runAmpersandCommands : string[], showTerminal: boolean = true, workingDir? : string[]) : Terminal
    {
        if(workingDir === undefined)
            workingDir = [''];
        
        let terminal = vscode.window.createTerminal({name:terminalName,cwd:fileUtils.generateWorkspacePath(workingDir)});
        
        this.RunCommandsInExistingTerminal(terminal,runAmpersandCommands);

        if(showTerminal)
            terminal.show();

        return terminal;
    }

    static RunCommandsInExistingTerminal(terminal : Terminal, runAmpersandCommands : string[])
    {
        runAmpersandCommands.forEach(command => {
            terminal.sendText(command)
        });
    }
}