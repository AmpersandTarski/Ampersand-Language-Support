import vscode, { Terminal } from 'vscode';
import { fileUtils } from './fileUtils';
import { terminalInfo } from '../models/terminal';

export class terminalUtils {
    static RunCommandsInNewTerminal(terminalInfo: terminalInfo, runAmpersandCommands: string[]): Terminal {
        if (terminalInfo.workingDir === undefined)
            terminalInfo.workingDir = [''];

        let terminal = vscode.window.createTerminal({ name: terminalInfo.terminalName, cwd: fileUtils.generateWorkspacePath(terminalInfo.workingDir) });

        this.runCommandsInExistingTerminal(terminal, runAmpersandCommands);

        if (terminalInfo.terminalVisible)
            terminal.show();

        return terminal;
    }

    static runCommandsInExistingTerminal(terminal: Terminal, runAmpersandCommands: string[]) {
        runAmpersandCommands.forEach(command => {
            terminal.sendText(command)
        });
    }
}