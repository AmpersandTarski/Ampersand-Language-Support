import vscode from 'vscode';
import { fileUtils } from './fileUtils';

export class terminalUtils{
    static RunCommandInNewTerminal(terminalName : string, runAmpersandCommand : string, workingDir? : string)
    {
        if(workingDir === 'undefined')
        {
            workingDir = '';
        }

        let terminal = vscode.window.createTerminal({name:terminalName,cwd:workingDir});
        terminal.sendText(runAmpersandCommand)
        terminal.show();
    }
}