import { terminalUtils } from "../utils";
import * as vscode from 'vscode';

export class generateAtlasCommand {
    static GenerateAtlasCommand()
    {
        if (vscode.workspace.workspaceFolders === undefined) {
            vscode.window.showWarningMessage("Checking ampersand only works if you work in a workspace.")
            return null;
        }

        const activeEditorWindow = vscode.window.activeTextEditor;
    
        if(!activeEditorWindow){
            vscode.window.showWarningMessage("Make sure you have an active editor window.")
            return null;
        }

        const currentActiveFilePath : string = activeEditorWindow.document.uri.fsPath;
    
        if(!currentActiveFilePath.endsWith(".adl"))
        {
            vscode.window.showWarningMessage(`Make sure you have an .adl file open`) 
            return null;
        }

        terminalUtils.RunCommandInNewTerminal("ampersand generate atlas",
        `ampersand population --output-dir='./' --build-recipe Grind --output-format json --verbosity warn ${currentActiveFilePath}`)
    }
}