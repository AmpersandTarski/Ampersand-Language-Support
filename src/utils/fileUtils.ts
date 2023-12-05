import * as vscode from 'vscode';
import * as Buffer from 'buffer'
export class fileUtils {
  static pair<A, B>(a: A, b: B): [A, B] {
    return [a, b];
  }

  static getCurrentOpenFile(): string | undefined
  {
    if (vscode.workspace.workspaceFolders === undefined) {
      vscode.window.showWarningMessage("Checking ampersand only works if you work in a workspace.")
      return;
    }

    const activeEditorWindow = vscode.window.activeTextEditor;

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
    const openFile = this.getCurrentOpenFile();

    if(!openFile){
      vscode.window.showWarningMessage("Make sure you have an active editor window.")
      return;
    }

    const startOfFileName : number = openFile.lastIndexOf('/');

    let fileName : string = openFile.substring(startOfFileName);
    fileName = fileName.replace('adl', 'yaml');

    return fileName;
  }

  static replaceMarker(from: vscode.Uri, to: vscode.Uri, marker: string, newValue: string,) {
    vscode.workspace.fs.readFile(from).then(data => {

        const text: string = Buffer.Buffer.from(data).toString();

        const newText: string = text.replace(marker, newValue);

        let newData = Buffer.Buffer.from(newText);

        vscode.workspace.fs.writeFile(to, newData).then(() => {

            vscode.window.showInformationMessage('Applying prototype');
        });
    });
}
}