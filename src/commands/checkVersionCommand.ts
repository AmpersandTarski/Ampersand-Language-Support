import * as vscode from 'vscode';
import { ampersandVersionChecker } from '../ampersand';

export class checkVersionCommand implements ICommand {
    static commandName: string = "extension.checkVersion";

    runCommand() {
        if (!vscode.workspace.rootPath) {
            vscode.window.showWarningMessage("Checking ampersand only works if you work in a workspace.")
            return;
        }

        let versionString: string = ampersandVersionChecker.getVersion();
        vscode.window.setStatusBarMessage("your current ampersand version is: " + versionString, 10000);
    }
}