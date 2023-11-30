import vscode from 'vscode';
import { terminalUtils } from '../utils';

export class generateFunctionalSpecCommand{
    static GenerateFunctionalSpecCommand()
    {
        if (vscode.workspace.workspaceFolders === undefined) {
            vscode.window.showWarningMessage("Checking ampersand only works if you work in a workspace.")
            return null;
        }
    
        let activeEditorWindow = vscode.window.activeTextEditor;
    
        if(!activeEditorWindow){
            vscode.window.showWarningMessage("Make sure you have an active editor window.")
            return null;
        }
    
        let currentActiveFilePath : string = activeEditorWindow.document.uri.fsPath;
    
        if(!currentActiveFilePath.endsWith(".adl"))
        {
            vscode.window.showWarningMessage(`Make sure you have an .adl file open`) 
            return null;
        }
    
        terminalUtils.RunCommandInNewTerminal("ampersand generate spec",`ampersand documentation ${currentActiveFilePath} --format docx --no-graphics --language=NL --ConceptualAnalysis --verbosity debug`)
    }
}