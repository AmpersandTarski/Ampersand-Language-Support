import * as vscode from 'vscode';
export class fileUtils {
  static pair<A, B>(a: A, b: B): [A, B] {
    return [a, b];
  }

  static getActiveTextEditor() : vscode.TextEditor | undefined
  {
    if (vscode.workspace.workspaceFolders === undefined) {
      vscode.window.showWarningMessage("Checking ampersand only works if you work in a workspace.")
      return;
    }

    return vscode.window.activeTextEditor;
  }

  static getCurrentOpenFile(): string | undefined
  {
    const activeEditorWindow = this.getActiveTextEditor();

    if(!activeEditorWindow){
      vscode.window.showWarningMessage("Make sure you have an active editor window.")
      return;
    }

    const currentActiveFilePath : string = activeEditorWindow.document.uri.fsPath;

    if(!currentActiveFilePath.endsWith(".adl"))
    {
      vscode.window.showWarningMessage(`Make sure you have an .adl file open`) 
      return;
    }

    return currentActiveFilePath;
  }

  static getCurrentOpenFileName() : string | undefined
  {
    const activeEditorWindow = this.getActiveTextEditor();

    if(!activeEditorWindow){
      vscode.window.showWarningMessage("Make sure you have an active editor window.")
      return;
    }

    const document : vscode.TextDocument = activeEditorWindow.document;

    return document.fileName;

  }
}