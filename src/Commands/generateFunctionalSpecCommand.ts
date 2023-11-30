import vscode from 'vscode';
import { TerminalUtils } from '../utils';

export class GenerateFunctionalSpecCommand{
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
    
        TerminalUtils.RunCommandInNewTerminal("ampersand generate spec",`ampersand documentation ${currentActiveFilePath} --format docx --no-graphics --language=NL --ConceptualAnalysis --verbosity debug`)
    }
}